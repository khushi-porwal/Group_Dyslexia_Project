# from fastapi import FastAPI
# from pydantic import BaseModel
# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import base64
# import io

# # Load trained model
# model = tf.keras.models.load_model("drawing_model.h5")

# CLASSES = ["apple", "banana"]

# app = FastAPI()

# class ImageRequest(BaseModel):
#     image: str  # base64 string

# @app.post("/predict")
# def predict(req: ImageRequest):
#     # 1️⃣ Decode Base64
#     image_bytes = base64.b64decode(req.image)
#     image = Image.open(io.BytesIO(image_bytes)).convert("L")
#     image = image.resize((28, 28))

#     # 2️⃣ Preprocess
#     img_array = np.array(image) / 255.0
#     img_array = img_array.reshape(1, 28, 28, 1)

#     # 3️⃣ Predict
#     prediction = model.predict(img_array)
#     index = int(np.argmax(prediction))
#     confidence = float(np.max(prediction))

#     return {
#         "label": CLASSES[index],
#         "confidence": confidence
#     }










from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image, ImageOps
import base64
import io
import binascii

model = tf.keras.models.load_model("drawing_model.h5")

CLASSES = ["apple", "banana"]
CONFIDENCE_THRESHOLD = 0.7

app = FastAPI()

class ImageRequest(BaseModel):
    image: str

@app.post("/predict")
def predict(req: ImageRequest):
    try:
        image_base64 = req.image
        missing_padding = len(image_base64) % 4
        if missing_padding:
            image_base64 += "=" * (4 - missing_padding)

        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes)).convert("L")

    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="Invalid image data")

    # Invert colors
    image = ImageOps.invert(image)

    # Crop background
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)

    if image.size[0] < 10 or image.size[1] < 10:
        return {"label": "unknown", "confidence": 0.0}

    # Resize & center
    image = image.resize((20, 20))
    canvas = Image.new("L", (28, 28), 0)
    canvas.paste(image, (4, 4))

    img_array = np.array(canvas) / 255.0
    img_array = img_array.reshape(1, 28, 28, 1)

    # Ink check
    if np.sum(img_array > 0.1) < 30:
        return {"label": "unknown", "confidence": 0.0}

    prediction = model.predict(img_array, verbose=0)
    index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    if confidence < CONFIDENCE_THRESHOLD:
        return {"label": "unknown", "confidence": round(confidence, 3)}

    return {
        "label": CLASSES[index],
        "confidence": round(confidence, 3)
    }