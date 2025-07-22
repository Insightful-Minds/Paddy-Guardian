from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

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

# Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "✅ Paddy Disease Text Prediction API Running"

@app.route('/text-predict', methods=['POST'])
def predict_text():
    data = request.get_json()
    input_text = data.get("input_text", "")
    
    if not is_valid_symptom(input_text):
        return jsonify({"result": "❌ Input does not appear to describe symptoms. Please enter valid paddy leaf symptoms."})
    
    vec = vectorizer.transform([input_text])
    pred = clf.predict(vec)[0]
    sinhala = disease_map.get(pred, "නොදන්නා රෝගයකි")
    
    return jsonify({"result": f"✅ Predicted Disease: {pred}\n✅ අනාවැකි රෝගය: {sinhala}"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
