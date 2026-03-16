import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# ----------------------------
# Paths
# ----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_PATH = os.path.join(BASE_DIR, "datasets", "cleaned", "heart_cleaned.csv")

MODEL_DIR = os.path.join(BASE_DIR, "app", "ml", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "heart_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "heart_scaler.pkl")
COLUMNS_PATH = os.path.join(MODEL_DIR, "heart_columns.pkl")

# ----------------------------
# Load dataset
# ----------------------------

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)
print("Columns:", df.columns)

# ----------------------------
# Convert categorical values
# ----------------------------

df["sex"] = df["sex"].map({"Male": 1, "Female": 0})

# ----------------------------
# Convert target
# ----------------------------

df["target"] = df["num"].apply(lambda x: 1 if x > 0 else 0)

# ----------------------------
# Feature selection
# ----------------------------

features = [
    "age",
    "sex",
    "trestbps",
    "chol",
    "fbs",
    "thalch",
    "exang",
    "oldpeak",
    "ca",

    "cp_asymptomatic",
    "cp_atypical angina",
    "cp_non-anginal",
    "cp_typical angina",

    "restecg_lv hypertrophy",
    "restecg_normal",
    "restecg_st-t abnormality",

    "slope_downsloping",
    "slope_flat",
    "slope_upsloping",

    "thal_fixed defect",
    "thal_normal",
    "thal_reversable defect"
]

X = df[features]
y = df["target"]

feature_columns = X.columns.tolist()

# ----------------------------
# Train/Test Split
# ----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ----------------------------
# Scaling
# ----------------------------

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ----------------------------
# Model Training
# ----------------------------

print("Training model...")

model = RandomForestClassifier(random_state=42)

param_grid = {
    "n_estimators": [100, 200],
    "max_depth": [5, 10, None],
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

print("Best Parameters:", grid.best_params_)

# ----------------------------
# Evaluation
# ----------------------------

y_pred = best_model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# ----------------------------
# Save artifacts
# ----------------------------

joblib.dump(best_model, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)
joblib.dump(feature_columns, COLUMNS_PATH)

print("\nModel saved:", MODEL_PATH)
print("Scaler saved:", SCALER_PATH)
print("Columns saved:", COLUMNS_PATH)