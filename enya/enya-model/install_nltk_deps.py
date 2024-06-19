import nltk
import os

if os.name == 'posix':  # Linux/Mac OS
    nltk_data_path = os.path.expanduser("~/nltk_data")
elif os.name == 'nt':  # Windows
    nltk_data_path = "C:\\Python312\\nltk_data"
else:
    nltk_data_path = ""

nltk.data.path.append(nltk_data_path)

nltk.download('punkt', download_dir=nltk_data_path)
nltk.download('wordnet', download_dir=nltk_data_path)
