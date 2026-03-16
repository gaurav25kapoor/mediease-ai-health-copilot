from pdf2image import convert_from_path
import pytesseract
from PIL import Image

# Path to Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Path to Poppler
POPPLER_PATH = r"C:\Users\Gaurav Kapoor\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin"


def extract_text_from_pdf(file_path):

    images = convert_from_path(
        file_path,
        poppler_path=POPPLER_PATH
    )

    text = ""

    for img in images:
        text += pytesseract.image_to_string(img)

    return text


def extract_text_from_image(file_path):

    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return text