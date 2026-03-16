import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# ---------------------------------------------------
# Project Paths
# ---------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_PATH = os.path.join(BASE_DIR, "datasets", "cleaned", "diabetes_cleaned.csv")

MODEL_DIR = os.path.join(BASE_DIR, "app", "ml", "models")

MODEL_PATH = os.path.join(MODEL_DIR, "diabetes_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "diabetes_scaler.pkl")
COLUMNS_PATH = os.path.join(MODEL_DIR, "diabetes_columns.pkl")


# ---------------------------------------------------
# Load Dataset
# ---------------------------------------------------

print("Loading Diabetes dataset...")

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# ---------------------------------------------------
# Clinically Relevant Features
# ---------------------------------------------------

FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

TARGET = "Outcome"


# keep only available features
available_features = [f for f in FEATURES if f in df.columns]

print("\nUsing Features:")
for f in available_features:
    print("-", f)


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

print("\nTraining Logistic Regression model...")

model = LogisticRegression(
    class_weight="balanced",
    max_iter=1000
)

param_grid = {
    "C": [0.01, 0.1, 1, 10]
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

print("\nDiabetes model updated successfully.")
print("Model path:", MODEL_PATH)
print("Scaler path:", SCALER_PATH)
print("Columns path:", COLUMNS_PATH)