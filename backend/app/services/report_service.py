import re
import tempfile
import shutil

from app.services.ocr_service import extract_text_from_pdf
from app.services.prediction_service import (
    predict_heart,
    predict_diabetes,
    predict_kidney,
    predict_anemia
)

from app.services.llm_service import generate_medical_explanation


# --------------------------------------------------
# VALUE REGEX
# --------------------------------------------------

VALUE_PATTERN = r"(\d+(?:\.\d+)?)"


# --------------------------------------------------
# LAB DETECTION PATTERNS
# --------------------------------------------------

LAB_PATTERNS = {

    "Glucose": [
        rf"(?:glucose|fasting\s*glucose|blood\s*glucose|fbs|rbs)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "BMI": [
        rf"(?:\bbmi\b|body\s*mass\s*index)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "BloodPressure": [
        r"(?:blood\s*pressure|bp)[^\d]{0,10}(\d{2,3})\/(\d{2,3})"
    ],

    "Creatinine": [
        rf"(?:serum\s*creatinine|creatinine)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Urea": [
        rf"(?:blood\s*urea|urea|bun)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Sodium": [
        rf"(?:sodium|na\+?)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Potassium": [
        rf"(?:potassium|k\+?)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Hemoglobin": [
        rf"(?:hemoglobin|haemoglobin|hb|hgb)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "MCV": [
        rf"(?:mean\s*corpuscular\s*volume|mcv)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "MCH": [
        rf"(?:mean\s*corpuscular\s*hemoglobin|mch)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "MCHC": [
        rf"(?:mean\s*corpuscular\s*hemoglobin\s*concentration|mchc)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "PackedCellVolume": [
        rf"(?:packed\s*cell\s*volume|pcv|hematocrit|hct)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "WBC": [
        rf"(?:white\s*blood\s*cells|wbc)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "RBC": [
        rf"(?:red\s*blood\s*cells|rbc)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Platelets": [
        rf"(?:platelet\s*count|platelets)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "RDW": [
        rf"(?:rdw|red\s*cell\s*distribution\s*width)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Cholesterol": [
        rf"(?:cholesterol|total\s*cholesterol)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Insulin": [
        rf"(?:insulin|fasting\s*insulin)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "HbA1c": [
        rf"(?:hba1c|glycated\s*hemoglobin|a1c)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "GFR": [
        rf"(?:gfr|egfr|glomerular\s*filtration\s*rate)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "ProteinInUrine": [
        rf"(?:protein\s*in\s*urine|urine\s*protein|proteinuria)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Albumin": [
        rf"(?:albumin)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "LDL": [
        rf"(?:ldl|ldl\s*cholesterol)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "HDL": [
        rf"(?:hdl|hdl\s*cholesterol)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Triglycerides": [
        rf"(?:triglycerides|tg)[^\d]{{0,20}}{VALUE_PATTERN}"
    ],

    "Gender": [
        r"(?:sex|gender)[^\w]{0,10}(male|female)"
    ]
}


COMPILED_PATTERNS = {
    lab: [re.compile(p, re.IGNORECASE) for p in patterns]
    for lab, patterns in LAB_PATTERNS.items()
}


# --------------------------------------------------
# VALID MEDICAL RANGES
# --------------------------------------------------

VALID_RANGES = {

    "Hemoglobin": (3, 25),
    "MCV": (50, 150),
    "MCH": (10, 40),
    "MCHC": (20, 40),
    "PackedCellVolume": (20, 70),
    "WBC": (1000, 20000),
    "RBC": (1, 10),
    "Platelets": (10000, 1000000),
    "RDW": (10, 25),

    "Glucose": (40, 600),
    "BMI": (10, 80),

    "Creatinine": (0.1, 20),
    "Urea": (1, 300),
    "Sodium": (100, 200),
    "Potassium": (1, 10),

    "Insulin": (2, 300),
    "HbA1c": (3, 20),

    "GFR": (5, 200),
    "ProteinInUrine": (0, 1000),
    "Albumin": (1, 10),

    "LDL": (10, 400),
    "HDL": (10, 150),
    "Triglycerides": (20, 1000)
}
REFERENCE_RANGES = {
    "Hemoglobin": "13–17 g/dL",
    "MCV": "80–100 fL",
    "MCH": "27–33 pg",
    "MCHC": "32–36 g/dL",
    "PackedCellVolume": "36–50 %",
    "WBC": "4000–11000 /µL",
    "RBC": "4.2–5.9 million/µL",
    "Platelets": "150000–450000 /µL",
    "RDW": "11–15 %",
    "Glucose": "70–99 mg/dL",
    "BMI": "18.5–24.9",
    "Creatinine": "0.6–1.3 mg/dL",
    "Urea": "7–20 mg/dL",
    "Sodium": "135–145 mmol/L",
    "Potassium": "3.5–5.0 mmol/L",
    "Cholesterol": "<200 mg/dL",
    "LDL": "<100 mg/dL",
    "HDL": ">40 mg/dL",
    "Triglycerides": "<150 mg/dL",
    "HbA1c": "4–5.6 %",
    "Insulin": "2–25 µIU/mL"
}
CLINICAL_RANGES = {

    # ---------------- CBC ----------------

    "Hemoglobin": (13.0, 17.0),        # g/dL (male)
    "MCV": (80, 100),                  # fL
    "MCH": (27, 33),                   # pg
    "MCHC": (32, 36),                  # g/dL
    "PackedCellVolume": (36, 50),      # %
    "WBC": (4000, 11000),              # cells/µL
    "RBC": (4.2, 5.9),                 # million/µL
    "Platelets": (150000, 450000),     # /µL
    "RDW": (11.5, 14.5),               # %

    # ---------------- DIABETES ----------------

    "Glucose": (70, 99),               # mg/dL fasting
    "HbA1c": (4.0, 5.6),               # %
    "Insulin": (2, 25),                # µIU/mL
    "BMI": (18.5, 24.9),

    # ---------------- KIDNEY ----------------

    "Creatinine": (0.6, 1.3),          # mg/dL
    "Urea": (7, 20),                   # mg/dL
    "GFR": (90, 120),                  # mL/min/1.73m²
    "ProteinInUrine": (0, 150),        # mg/day
    "Albumin": (3.4, 5.4),             # g/dL

    # ---------------- ELECTROLYTES ----------------

    "Sodium": (135, 145),              # mmol/L
    "Potassium": (3.5, 5.0),           # mmol/L

    # ---------------- HEART / LIPIDS ----------------

    "Cholesterol": (125, 200),         # mg/dL
    "LDL": (0, 100),                   # mg/dL
    "HDL": (40, 60),                   # mg/dL
    "Triglycerides": (0, 150)          # mg/dL
}

def validate_value(lab, value):

    if lab not in VALID_RANGES:
        return True

    low, high = VALID_RANGES[lab]

    return low <= value <= high


# --------------------------------------------------
# TEXT CLEANING
# --------------------------------------------------

def clean_text(text):

    text = text.lower()
    text = re.sub(r"\s+", " ", text)

    text = text.replace("—", "-")
    text = text.replace("–", "-")

    return text


# --------------------------------------------------
# LAB VALUE EXTRACTION
# --------------------------------------------------

def extract_lab_values(text):

    text = clean_text(text)

    labs = {}

    for lab, patterns in COMPILED_PATTERNS.items():

        for pattern in patterns:

            matches = pattern.findall(text)

            if not matches:
                continue

            for match in matches:

                try:

                    if lab == "BloodPressure":

                        systolic = float(match[0])
                        labs["BloodPressure"] = systolic
                        break

                    elif lab == "Gender":

                        labs["Gender"] = match.lower()
                        break

                    else:

                        value = float(match)

                        if not validate_value(lab, value):
                            continue

                        labs[lab] = value
                        break

                except:
                    continue

    return labs


# --------------------------------------------------
# MAIN ANALYSIS FUNCTION
# --------------------------------------------------

def analyze_report(upload_file):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:

        shutil.copyfileobj(upload_file.file, tmp)
        temp_path = tmp.name

    text = extract_text_from_pdf(temp_path)

    labs = extract_lab_values(text)

    predictions = {}


    # ---------------- ANEMIA ----------------

    if "Hemoglobin" in labs:

        gender = 1

        if labs.get("Gender") == "female":
            gender = 0

        features = {
            "Hemoglobin": labs["Hemoglobin"],
            "MCH": labs.get("MCH"),
            "MCHC": labs.get("MCHC"),
            "MCV": labs.get("MCV"),
            "Gender": gender
        }

        predictions["anemia"] = predict_anemia(features)

    else:

        predictions["anemia"] = {
            "status": "skipped",
            "reason": "hemoglobin_not_found"
        }


    # ---------------- DIABETES ----------------

    if "Glucose" in labs:

        features = {
            "Pregnancies": 2,
            "Glucose": labs["Glucose"],
            "BloodPressure": labs.get("BloodPressure"),
            "SkinThickness": None,
            "Insulin": None,
            "BMI": labs.get("BMI"),
            "DiabetesPedigreeFunction": 0.5,
            "Age": 40
        }

        predictions["diabetes"] = predict_diabetes(features)

    else:

        predictions["diabetes"] = {
            "status": "skipped",
            "reason": "glucose_not_found"
        }


    # ---------------- KIDNEY ----------------

    if "Creatinine" in labs:

        features = {
            "Age": 45,
            "BMI": labs.get("BMI"),
            "SystolicBP": labs.get("BloodPressure"),
            "DiastolicBP": None,
            "FastingBloodSugar": labs.get("Glucose"),
            "SerumCreatinine": labs["Creatinine"],
            "BUNLevels": labs.get("Urea"),
            "GFR": None,
            "ProteinInUrine": None,
            "HemoglobinLevels": labs.get("Hemoglobin")
        }

        predictions["kidney"] = predict_kidney(features)

    else:

        predictions["kidney"] = {
            "status": "skipped",
            "reason": "creatinine_not_found"
        }


    # ---------------- HEART ----------------

    if "Cholesterol" in labs and "BloodPressure" in labs:

        features = {
            "age": 50,
            "sex": 1,
            "trestbps": labs["BloodPressure"],
            "chol": labs["Cholesterol"],
            "fbs": 0,
            "thalch": 150,
            "exang": 0,
            "oldpeak": 1,
            "ca": 0
        }

        predictions["heart"] = predict_heart(features)

    else:

        predictions["heart"] = {
            "status": "skipped",
            "reason": "missing_cholesterol_or_bp"
        }


    # ---------------- AI EXPLANATION ----------------

    explanation = generate_medical_explanation(labs, predictions)


    # ---------------- STRUCTURED LAB RESPONSE ----------------

    structured_labs = {}

    for lab, value in labs.items():
        
        reference = REFERENCE_RANGES.get(lab, "N/A")

        status = "Normal"

        if lab in CLINICAL_RANGES:
            low, high = CLINICAL_RANGES[lab]

            if value < low:
                status = "Low"
            elif value > high:
                status = "High"

        structured_labs[lab] = {
            "value": value,
            "reference_range": reference,
            "status": status
        }

    return {

        "lab_values": structured_labs,
        "predictions": predictions,
        "explanation": explanation

    }