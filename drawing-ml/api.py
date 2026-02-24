from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io

# Load trained model
model = tf.keras.models.load_model("drawing_model.h5")

CLASSES = ["apple", "banana"]

app = FastAPI()

class ImageRequest(BaseModel):
    image: str  # base64 string

@app.post("/predict")
def predict(req: ImageRequest):
    # 1️⃣ Decode Base64
    image_bytes = base64.b64decode(req.image)
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((28, 28))

    # 2️⃣ Preprocess
    img_array = np.array(image) / 255.0
    img_array = img_array.reshape(1, 28, 28, 1)

    # 3️⃣ Predict
    prediction = model.predict(img_array)
    index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    return {
        "label": CLASSES[index],
        "confidence": confidence
    }