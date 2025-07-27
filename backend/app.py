from flask import Flask, request, jsonify
from flask_cors import CORS
from image_utils import predict_from_image
import joblib
import os
# Translation-related imports
from transformers import MBart50TokenizerFast, MBartForConditionalGeneration
from peft import PeftModel

# Load model and vectorizer
# clf = joblib.load("./model/symptom_model.pkl")
# vectorizer = joblib.load("./model/vectorizer.pkl")
clf = joblib.load("./model/best_symptom_model_logreg.pkl")
vectorizer = joblib.load("./model/best_vectorizer_tfidf.pkl")
# Sinhala label mapping
disease_map = {
    "Rice Blast": "කොල පාලුව",
    "Tungro": "ටුංග්රෝ රෝගය",
    "Bacterial Leaf Blight": "බැක්ටීරියානු පත්‍ර දාහය",
    "Brown Spot": "කළු ලප රෝගය"
}

# Keyword-based validation
def is_valid_symptom(text):
    keywords = [
        # Color indicators
        "yellow", "orange", "brown", "gray", "green", "straw", "rust", "pale", "white", "mottled", "chlorotic",

        # Leaf terms
        "leaf", "leaves", "tip", "blade", "margin", "sheath", "midrib", "vein", "streak", "spot", "lesion", "blotch", "stripe",

        # Plant conditions
        "wilt", "dry", "roll", "curl", "necrosis", "ooze", "milky", "dewdrop", "withering", "shrink", "droop", "die",

        # Growth symptoms
        "stunt", "delayed", "flowering", "maturity", "tillering", "panicle", "sterile", "unfilled", "grain", "small", "exsert",

        # Infections or stages
        "seedling", "transplant", "young", "older", "tillering", "vegetative", "kresek", "infected", "saprophytic", "early",

        # Other signs
        "irregular", "wavy", "coalesce", "discoloration", "chlorosis", "interveinal", "beads", "dots", "deformed", "streak",

        # Vector/disease-specific
        "hopper", "tungro", "bacterial", "fungi", "RTBV", "RTSV", "virus", "infestation"
    ]
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
    generated_ids = translator.generate(**inputs, forced_bos_token_id=tokenizer.lang_code_to_id["en_XX"], num_beams=4,
        max_length=128,
        early_stopping=True)
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
    
    # Get prediction probabilities for confidence
    pred_proba = clf.predict_proba(vec)[0]
    confidence = max(pred_proba) * 100  # Convert to percentage
    
    sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

    result = (
        f"🈁 Sinhala Input: {sinhala_text}\n"
        f"🌐 Translated: {english_text}\n"
        f"✅ Predicted Disease: {pred}\n"
        f"✅ අනාවැකි රෝගය: {sinhala_pred}\n"
        f"📊 Confidence: {confidence:.2f}%"
    )

    return jsonify({
        "result": result,
        "confidence": round(confidence, 2),
        "disease": pred,
        "sinhala_disease": sinhala_pred,
        "translated_text": english_text
    })

@app.route('/text-predict', methods=['POST'])
def english_text_predict():
    data = request.get_json()
    input_text = data.get("input_text", "")

    if not is_valid_symptom(input_text):
        return jsonify({"result": "❌ Input does not appear to describe symptoms. Please enter valid paddy leaf symptoms."})

    vec = vectorizer.transform([input_text])
    pred = clf.predict(vec)[0]
    
    # Get prediction probabilities for confidence
    pred_proba = clf.predict_proba(vec)[0]
    confidence = max(pred_proba) * 100  # Convert to percentage
    
    sinhala_pred = disease_map.get(pred, "නොදන්නා රෝගයකි")

    result = f"✅ Predicted Disease: {pred}\n✅ අනාවැකි රෝගය: {sinhala_pred}\n📊 Confidence: {confidence:.2f}%"

    return jsonify({
        "result": result,
        "confidence": round(confidence, 2),
        "disease": pred,
        "sinhala_disease": sinhala_pred
    })

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

