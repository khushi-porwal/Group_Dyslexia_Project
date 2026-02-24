import numpy as np
from PIL import Image
import os
from sklearn.model_selection import train_test_split

CLASSES = ["apple", "banana"]
DATASET_DIR = "dataset"
RAW_DIR = DATASET_DIR
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
TEST_DIR = os.path.join(DATASET_DIR, "test")

os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

for cls in CLASSES:
    data = np.load(os.path.join(RAW_DIR, f"{cls}.npy"))
    
    # Normalize & reshape
    data = data.reshape(-1, 28, 28).astype("uint8")

    train_data, test_data = train_test_split(
        data, test_size=0.2, random_state=42
    )

    os.makedirs(os.path.join(TRAIN_DIR, cls), exist_ok=True)
    os.makedirs(os.path.join(TEST_DIR, cls), exist_ok=True)

    for i, img in enumerate(train_data[:2000]):
        Image.fromarray(img).save(
            f"{TRAIN_DIR}/{cls}/{i}.png"
        )

    for i, img in enumerate(test_data[:400]):
        Image.fromarray(img).save(
            f"{TEST_DIR}/{cls}/{i}.png"
        )

print("✅ Dataset prepared")