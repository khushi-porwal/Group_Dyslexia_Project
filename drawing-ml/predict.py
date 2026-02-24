import tensorflow as tf
from PIL import Image
import numpy as np

model = tf.keras.models.load_model("drawing_model.h5")

img = Image.open("test.png").convert("L").resize((28,28))
img = np.array(img) / 255.0
img = img.reshape(1,28,28,1)

prediction = model.predict(img)
classes = ["apple", "banana"]

print("Prediction:", classes[np.argmax(prediction)])