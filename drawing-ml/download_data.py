import urllib.request
import os

CLASSES = ['apple', 'banana']
BASE_URL = 'https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/'
DATA_DIR = os.path.join(os.path.dirname(__file__), 'dataset')

def download_data():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    for cls in CLASSES:
        url = BASE_URL + cls + '.npy'
        file_path = os.path.join(DATA_DIR, f'{cls}.npy')
        
        if not os.path.exists(file_path):
            print(f'Downloading {cls}...')
            try:
                urllib.request.urlretrieve(url, file_path)
                print(f'Downloaded {cls}.npy')
            except Exception as e:
                print(f"Failed to download {cls}: {e}")
        else:
            print(f'{cls}.npy already exists.')

if __name__ == '__main__':
    download_data()
