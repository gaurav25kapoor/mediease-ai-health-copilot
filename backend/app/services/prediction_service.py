import os
import joblib
import pandas as pd

# -----------------------------
# Paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "ml", "models")

# -----------------------------
# Load models
# -----------------------------

heart_model = joblib.load(os.path.join(MODEL_DIR, "heart_model.pkl"))
heart_scaler = joblib.load(os.path.join(MODEL_DIR, "heart_scaler.pkl"))
heart_columns = joblib.load(os.path.join(MODEL_DIR, "heart_columns.pkl"))

diabetes_model = joblib.load(os.path.join(MODEL_DIR, "diabetes_model.pkl"))
diabetes_scaler = joblib.load(os.path.join(MODEL_DIR, "diabetes_scaler.pkl"))
diabetes_columns = joblib.load(os.path.join(MODEL_DIR, "diabetes_columns.pkl"))

kidney_model = joblib.load(os.path.join(MODEL_DIR, "kidney_model.pkl"))
kidney_scaler = joblib.load(os.path.join(MODEL_DIR, "kidney_scaler.pkl"))
kidney_columns = joblib.load(os.path.join(MODEL_DIR, "kidney_columns.pkl"))

anemia_model = joblib.load(os.path.join(MODEL_DIR, "anemia_model.pkl"))
anemia_scaler = joblib.load(os.path.join(MODEL_DIR, "anemia_scaler.pkl"))
anemia_columns = joblib.load(os.path.join(MODEL_DIR, "anemia_columns.pkl"))

# -----------------------------
# Prepare input features
# -----------------------------

def prepare_features(features: dict, columns):

    df = pd.DataFrame([features])

    # add missing columns with 0
    for col in columns:
        if col not in df.columns:
            df[col] = 0

    # keep correct order
    df = df[columns]

    return df


# -----------------------------
# Feature coverage validation
# -----------------------------

def check_feature_coverage(features, columns):

    provided = [f for f in features if f in columns]

    coverage = len(provided) / len(columns)

    return coverage


# -----------------------------
# Generic prediction
# -----------------------------

def predict(model, scaler, columns, features: dict):

    coverage = check_feature_coverage(features, columns)

    

    df = prepare_features(features, columns)

    scaled = scaler.transform(df)

    prediction = int(model.predict(scaled)[0])

    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(scaled)[0][1] * 100)
    else:
        probability = 0.0

    return {
        "prediction": prediction,
        "probability": probability,
        "status": "success",
        "feature_coverage": round(coverage, 2)
    }


# -----------------------------
# Heart Prediction
# -----------------------------

def predict_heart(features: dict):

    return predict(
        heart_model,
        heart_scaler,
        heart_columns,
        features
    )


# -----------------------------
# Diabetes Prediction
# -----------------------------

def predict_diabetes(features: dict):

    return predict(
        diabetes_model,
        diabetes_scaler,
        diabetes_columns,
        features
    )


# -----------------------------
# Kidney Prediction
# -----------------------------

def predict_kidney(features: dict):

    # Map simple frontend fields to model features
    mapped = {}

    for col in kidney_columns:

        if col in features:
            mapped[col] = features[col]

    return predict(
        kidney_model,
        kidney_scaler,
        kidney_columns,
        mapped
    )


# -----------------------------
# Anemia Prediction
# -----------------------------

def predict_anemia(features: dict):

    return predict(
        anemia_model,
        anemia_scaler,
        anemia_columns,
        features
    )