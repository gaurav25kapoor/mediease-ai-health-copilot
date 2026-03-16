import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ---------------------------------------------------
# Project Paths
# ---------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_PATH = os.path.join(BASE_DIR, "datasets", "cleaned", "kidney_cleaned.csv")

MODEL_DIR = os.path.join(BASE_DIR, "app", "ml", "models")

MODEL_PATH = os.path.join(MODEL_DIR, "kidney_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "kidney_scaler.pkl")
COLUMNS_PATH = os.path.join(MODEL_DIR, "kidney_columns.pkl")


# ---------------------------------------------------
# Load Dataset
# ---------------------------------------------------

print("Loading Kidney dataset...")

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# ---------------------------------------------------
# Select Clinically Relevant Features
# ---------------------------------------------------

FEATURES = [
    "Age",
    "BMI",
    "SystolicBP",
    "DiastolicBP",
    "FastingBloodSugar",
    "SerumCreatinine",
    "BUNLevels",
    "GFR",
    "ProteinInUrine",
    "HemoglobinLevels"
]

TARGET = "Diagnosis"


# keep only features that exist in dataset
available_features = [f for f in FEATURES if f in df.columns]

print("\nUsing Features:")
for f in available_features:
    print("-", f)

if TARGET not in df.columns:
    raise Exception("Diagnosis column not found in dataset")


# ---------------------------------------------------
# Prepare Data
# ---------------------------------------------------

X = df[available_features]
y = df[TARGET]

X = X.apply(pd.to_numeric, errors="coerce")


# ---------------------------------------------------
# Handle Missing Values
# ---------------------------------------------------

X = X.fillna(X.median())


# ---------------------------------------------------
# Train Test Split
# ---------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ---------------------------------------------------
# Scaling
# ---------------------------------------------------

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# ---------------------------------------------------
# Model Training
# ---------------------------------------------------

print("\nTraining RandomForest model...")

model = RandomForestClassifier(random_state=42)

param_grid = {
    "n_estimators": [200, 300],
    "max_depth": [5, 10, 15],
    "min_samples_split": [2, 5]
}

grid = GridSearchCV(
    model,
    param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1
)

grid.fit(X_train_scaled, y_train)

best_model = grid.best_estimator_

print("\nBest Parameters:", grid.best_params_)


# ---------------------------------------------------
# Evaluation
# ---------------------------------------------------

y_pred = best_model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# ---------------------------------------------------
# Save Model (OVERWRITE OLD FILES)
# ---------------------------------------------------

joblib.dump(best_model, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)
joblib.dump(available_features, COLUMNS_PATH)

print("\nKidney model updated successfully.")
print("Model path:", MODEL_PATH)
print("Scaler path:", SCALER_PATH)
print("Columns path:", COLUMNS_PATH)