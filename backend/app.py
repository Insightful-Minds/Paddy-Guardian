from flask import Flask, request, jsonify
from flask_cors import CORS
from image_utils import predict_from_image
import joblib
import os
# Translation-related imports
from transformers import MBart50TokenizerFast, MBartForConditionalGeneration
from peft import PeftModel

# Load model and vectorizer
clf = joblib.load("./model/symptom_model.pkl")
vectorizer = joblib.load("./model/vectorizer.pkl")

# Sinhala label mapping
disease_map = {
    "Rice Blast": "පතුරු රෝගය",
    "Tungro": "ටුංග්රෝ රෝගය",
    "Bacterial Leaf Blight": "බැක්ටීරියානු පත්‍ර දාහය",
    "Brown Spot": "කළු ලප රෝගය"
}

# Fallback Sinhala questions per disease
fallback_questions = {
    "Brown Spot": [
        "කොලේ දුඹුරු පුල්ලි පෙනෙන්නෙ ද?",
        "ඒ පුල්ලි රවුම් හැඩයකද?",
    ],
    "Tungro": [
        "කොල කහ පැහැයක් ඇතිද?",
        "වර්ධනය නවතිලා ද?",
    ],
    "Rice Blast": [
        "කොලේ ඇස් හැඩයට සමාන තැන් තිබේද?",
        "කොල ගෙල අසළ කොටස ලෙඩ signs පෙන්වන්නෙ ද?",
    ],
    "Bacterial Leaf Blight": [
        "කොල ඉදල වියළී යන හැඩයක් පෙනෙන්නෙ ද?",
        "දිය වගේ පාටකින් streaks පේනවද?",
    ]
}

# Keyword-based validation
def is_valid_symptom(text):
    keywords = ["yellow", "brown", "spot", "wilt", "leaf", "tip", "dry", "patch", "streak", "rot", "lesion"]
    return sum(1 for word in keywords if word in text.lower()) >= 2

# Load translation model (LoRA adapter)
print("🔁 Loading translation model...")
tokenizer = MBart50TokenizerFast.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
tokenizer.src_lang = "si_LK"
tokenizer.tgt_lang = "en_XX"
base_model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
translator = PeftModel.from_pretrained(base_model, "model")  # adapter_model.safetensors and config must be in /model
print("✅ Translator loaded.")

def translate_sinhala_to_english(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True)
    generated_ids = translator.generate(**inputs, forced_bos_token_id=tokenizer.lang_code_to_id["en_XX"])
    translated = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
    return translated[0]

# Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ Paddy Disease Text Prediction API Running"

# Sinhala → English → Disease Prediction
@app.route('/sinhala-text-predict', methods=['POST'])
def sinhala_text_predict():
    data = request.get_json()
    sinhala_text = data.get("input_text", "").strip()

    if not sinhala_text:
        return jsonify({"result": "❌ හිස් ඉන්පุตයක්. කරුණාකර රෝග ලක්ෂණ ඇතුළත් කරන්න."})

    english_text = translate_sinhala_to_english(sinhala_text)
    print("🔁 Translated:", english_text)

    if not is_valid_symptom(english_text):
        return jsonify({"result": f"❌ This input doesn't appear to describe symptoms (after translation).\nTranslated: {english_text}"})

    vec = vectorizer.transform([english_text])
    pred = clf.predict(vec)[0]
    sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

    result = (
        f"🈁 Sinhala Input: {sinhala_text}\n"
        f"🌐 Translated: {english_text}\n"
        f"✅ Predicted Disease: {pred}\n"
        f"✅ අනාවැකි රෝගය: {sinhala_pred}"
    )

    return jsonify({"result": result})

@app.route('/text-predict', methods=['POST'])
def english_text_predict():
    data = request.get_json()
    input_text = data.get("input_text", "")

    if not is_valid_symptom(input_text):
        return jsonify({"result": "❌ Input does not appear to describe symptoms. Please enter valid paddy leaf symptoms."})

    vec = vectorizer.transform([input_text])
    pred = clf.predict(vec)[0]
    sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

    return jsonify({"result": f"✅ Predicted Disease: {pred}\n✅ අනාවැකි රෝගය: {sinhala_pred}"})

@app.route('/image-predict', methods=['POST'])
def image_predict():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded."})
    try:
        prediction = predict_from_image(file)
        
        # Check if prediction contains an error
        if isinstance(prediction, dict) and "error" in prediction:
            return jsonify({"error": prediction["error"]})
        
        # Return the structured prediction data
        return jsonify(prediction)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"})
    
chat_sessions = {}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id")
    user_message = data.get("message", "").strip()

    if not user_id or not user_message:
        return jsonify({"response": "❌ අනීතික ඉල්ලීමකි. පරිශීලක හැඳුනුම සහ පණිවිඩය අවශ්‍ය වේ."})

    # Initialize session if new user
    if user_id not in chat_sessions:
        chat_sessions[user_id] = {
            "stage": "initial",
            "history": [],
            "predicted_disease": None,
            "pending_questions": [],
            "answers": {}
        }

    session = chat_sessions[user_id]
    stage = session["stage"]

    # Stage 1: Initial symptom description
    if stage == "initial":
        english_text = translate_sinhala_to_english(user_message)
        print(f"🔁 Translated: {english_text}")

        if not is_valid_symptom(english_text):
            return jsonify({"response": f"❌ මෙම පණිවිඩය රෝග ලක්ෂණයක් නොවන බව පෙනේ.\n🌐 Analyzed as: {english_text}"})

        # Vectorize and predict
        vec = vectorizer.transform([english_text])
        probs = clf.predict_proba(vec)[0]
        confidence = max(probs)
        pred = clf.predict(vec)[0]
        sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

        session["predicted_disease"] = pred
        session["history"].append({"user": user_message, "translation": english_text})

        # High confidence → return prediction
        if confidence >= 0.6:
            session["stage"] = "done"
            return jsonify({
                "response": f"✅ අනාවැකි රෝගය: {sinhala_pred} ({pred})\n📈 විශ්වාසය: {round(confidence*100, 2)}%"
            })

        # Low confidence → Ask follow-up questions
        follow_ups = fallback_questions.get(pred, [])
        if not follow_ups:
            return jsonify({
                "response": f"🟡 අනාවැකි රෝගය: {sinhala_pred} ({pred})\n📉 විශ්වාසය අඩුයි ({round(confidence*100, 2)}%).\nකරුණාකර තවත් විස්තර ලබාදෙන්න."
            })

        session["stage"] = "followup"
        session["pending_questions"] = follow_ups

        return jsonify({
            "response": f"🟡 අනාවැකි රෝගය: {sinhala_pred} ({pred})\n📉 විශ්වාසය අඩුයි ({round(confidence*100, 2)}%).\n👇 කරුණාකර පහත ප්‍රශ්න වලට පිළිතුරු දී තහවුරු කරන්න:",
            "questions": follow_ups
        })

    # Stage 2: Follow-up questions
    elif stage == "followup":
        current_q = session["pending_questions"].pop(0)
        session["answers"][current_q] = user_message

        if session["pending_questions"]:
            next_q = session["pending_questions"][0]
            return jsonify({"response": f"👉 {next_q}"})
        else:
            session["stage"] = "done"
            sinhala_pred = disease_map.get(session["predicted_disease"], "නොදන්නා රෝගයකි")
            return jsonify({
                "response": f"✅ පිළිතුරු ලබාගන්නා ලදී.\n🔍 අනාවැකි රෝගය: {sinhala_pred}\nඔබ ලබාදුන් තොරතුරු මත මද විශ්වාසයකින් මෙම අනාවැකිය ලබාදෙනු ලැබේ."
            })

    # Stage 3: Done
    else:
        return jsonify({
            "response": "🔁 ඔබගේ රෝග අනාවැකිය දැනටමත් ලබා දී ඇත. නව වරක් ඇරඹීමට 'නව පණිවිඩයක්' යවන්න."
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

