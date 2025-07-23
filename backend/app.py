from flask import Flask, request, jsonify, make_response
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
    "Blast": "පතුරු රෝගය",
    "Tungro": "ටුංග්රෝ රෝගය",
    "Bacterial Blight": "බැක්ටීරියානු පත්‍ර දාහය",
    "Brown Spot": "කළු ලප රෝගය"
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
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'], 
     allow_headers=['Content-Type', 'Authorization'], 
     methods=['GET', 'POST', 'OPTIONS'])

@app.route('/')
def home():
    return "✅ Paddy Disease Text Prediction API Running"

# Sinhala → English → Disease Prediction
# Enhanced chatbot endpoint with detailed analysis
@app.route('/chatbot-predict', methods=['POST', 'OPTIONS'])
def chatbot_predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        return response
    
    data = request.get_json()
    input_text = data.get("input_text", "").strip()
    is_sinhala = data.get("is_sinhala", False)

    if not input_text:
        return jsonify({
            "error": "Empty input",
            "message": "❌ හිස් ඉන්පුතයක්. කරුණාකර රෝග ලක්ෂණ ඇතුළත් කරන්න.\nEmpty input. Please enter disease symptoms."
        })

    try:
        # Translation if needed
        english_text = input_text
        translation = None
        
        if is_sinhala:
            english_text = translate_sinhala_to_english(input_text)
            translation = english_text
            print(f"🔁 Translated: {input_text} -> {english_text}")

        # Validation
        if not is_valid_symptom(english_text):
            return jsonify({
                "error": "Invalid symptoms",
                "message": f"❌ මෙම ඉන්පුතය රෝග ලක්ෂණ විස්තර නොකරයි.\nThis input doesn't appear to describe symptoms.",
                "translation": translation,
                "confidence": 0
            })

        # Prediction
        vec = vectorizer.transform([english_text])
        pred = clf.predict(vec)[0]
        confidence_scores = clf.predict_proba(vec)[0]
        max_confidence = float(max(confidence_scores) * 100)
        
        sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

        # Symptom analysis
        symptoms_found = []
        symptom_keywords = {
            "color": ["yellow", "brown", "black", "white", "gray", "green"],
            "spots": ["spot", "patch", "lesion", "mark"],
            "shape": ["circular", "oval", "diamond", "irregular", "round"],
            "texture": ["dry", "wet", "wilted", "crispy", "soft"],
            "severity": ["severe", "mild", "spreading", "small", "large"]
        }
        
        for category, keywords in symptom_keywords.items():
            found = [kw for kw in keywords if kw in english_text.lower()]
            if found:
                symptoms_found.append(f"{category}: {', '.join(found)}")

        return jsonify({
            "success": True,
            "disease": pred,
            "disease_sinhala": sinhala_pred,
            "confidence": round(max_confidence, 2),
            "translation": translation,
            "symptoms_identified": symptoms_found,
            "original_text": input_text,
            "processed_text": english_text,
            "message": f"✅ හඳුනාගත් රෝගය: {sinhala_pred}\n✅ Predicted Disease: {pred}\n📊 විශ්වාසය: {max_confidence:.1f}%"
        })

    except Exception as e:
        print(f"❌ Error in chatbot prediction: {str(e)}")
        return jsonify({
            "error": "Processing failed",
            "message": "❌ සැකසීමේදී දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.\nProcessing failed. Please try again.",
            "confidence": 0
        })

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

