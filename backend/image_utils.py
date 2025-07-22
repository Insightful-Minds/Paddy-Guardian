# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image
# import numpy as np
# import os

# # Load model
# model = load_model("model/mobilenet_finetuned.h5")

# # Load class names
# with open("model/class_names.txt", "r") as f:
#     class_names = [line.strip() for line in f.readlines()]

# def predict_from_image(file):
#     img = image.load_img(file, target_size=(224, 224))  # Use same size as during training
#     img_array = image.img_to_array(img) / 255.0
#     img_array = np.expand_dims(img_array, axis=0)

#     preds = model.predict(img_array)
#     class_idx = np.argmax(preds)
#     confidence = round(float(np.max(preds)) * 100, 2)

#     return f"✅ Predicted Disease (Image): {class_names[class_idx]} ({confidence}%)"
# def predict_from_image(file_storage):
#     # 👇 FIX: Use file_storage.stream instead of raw file
#     img = image.load_img(file_storage.stream, target_size=(224, 224))
#     img_array = image.img_to_array(img) / 255.0
#     img_array = np.expand_dims(img_array, axis=0)

#     preds = model.predict(img_array)
#     class_idx = np.argmax(preds)
#     confidence = round(float(np.max(preds)) * 100, 2)

#     return f"✅ Predicted Disease (Image): {class_names[class_idx]} ({confidence}%)"

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import io
import ast

# Load model
model = load_model("model/mobilenet_finetuned.h5")

# Load class names - handle the Python list format in the file
try:
    with open("model/class_names.txt", "r") as f:
        content = f.read().strip()
        # Extract the list from the string "classes = [...]"
        if "classes = " in content:
            list_part = content.split("classes = ")[1]
            class_names = ast.literal_eval(list_part)
        else:
            # Fallback: try to evaluate the entire content
            class_names = ast.literal_eval(content)
except Exception as e:
    print(f"Error loading class names: {e}")
    # Fallback class names
    class_names = ["Bacterial Blight", "Blast", "Brown Spot", "Tungro", "Healthy"]

def predict_from_image(file_storage):
    try:
        # ✅ Read raw bytes from Flask file
        img_bytes = file_storage.read()
        
        # ✅ Wrap in BytesIO
        img_io = io.BytesIO(img_bytes)
        
        # ✅ Load the image
        img = image.load_img(img_io, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        preds = model.predict(img_array)
        class_idx = np.argmax(preds)
        confidence = round(float(np.max(preds)) * 100, 2)
        
        # Check if class_idx is within bounds
        if class_idx >= len(class_names):
            return f"❌ Error: Predicted class index {class_idx} is out of range. Available classes: {len(class_names)}"
        
        if len(class_names) == 0:
            return "❌ Error: No class names loaded"

        return f"✅ Predicted Disease (Image): {class_names[class_idx]} ({confidence}%)"
    
    except Exception as e:
        return f"❌ Prediction failed: {str(e)}"

