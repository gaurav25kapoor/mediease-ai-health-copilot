import pandas as pd
import os

# get project root directory safely
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATASET_PATH = os.path.join(BASE_DIR, "datasets")
OUTPUT_PATH = os.path.join(DATASET_PATH, "cleaned")

os.makedirs(OUTPUT_PATH, exist_ok=True)

# dataset files
heart_path = os.path.join(DATASET_PATH, "heart_disease_uci.csv")
diabetes_path = os.path.join(DATASET_PATH, "diabetes.csv")
kidney_path = os.path.join(DATASET_PATH, "Chronic_Kidney_Dsease_data.csv")
anemia_path = os.path.join(DATASET_PATH, "anemia.csv")


# -----------------------------------
# HEART DISEASE DATASET
# -----------------------------------
def clean_heart():

    df = pd.read_csv(heart_path)

    # drop unnecessary columns if they exist
    drop_cols = ["id", "origin"]
    for col in drop_cols:
        if col in df.columns:
            df.drop(columns=[col], inplace=True)

    # convert target to binary
    if "num" in df.columns:
        df["num"] = df["num"].apply(lambda x: 1 if x > 0 else 0)

    # fill missing values
    df.fillna(df.median(numeric_only=True), inplace=True)

    # encode categorical columns
    categorical_cols = ["cp", "restecg", "slope", "thal"]

    for col in categorical_cols:
        if col in df.columns:
            df = pd.get_dummies(df, columns=[col])

    df.to_csv(os.path.join(OUTPUT_PATH, "heart_cleaned.csv"), index=False)

    print("Heart dataset cleaned")


# -----------------------------------
# DIABETES DATASET
# -----------------------------------
def clean_diabetes():

    df = pd.read_csv(diabetes_path)

    # replace impossible zero values
    cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

    for col in cols:
        if col in df.columns:
            df[col] = df[col].replace(0, df[col].median())

    df.fillna(df.median(numeric_only=True), inplace=True)

    df.to_csv(os.path.join(OUTPUT_PATH, "diabetes_cleaned.csv"), index=False)

    print("Diabetes dataset cleaned")


# -----------------------------------
# KIDNEY DISEASE DATASET
# -----------------------------------
def clean_kidney():

    df = pd.read_csv(kidney_path)

    # remove useless columns if present
    drop_cols = ["PatientID", "DoctorInCharge"]

    for col in drop_cols:
        if col in df.columns:
            df.drop(columns=[col], inplace=True)

    df.fillna(df.median(numeric_only=True), inplace=True)

    df.to_csv(os.path.join(OUTPUT_PATH, "kidney_cleaned.csv"), index=False)

    print("Kidney dataset cleaned")


# -----------------------------------
# ANEMIA DATASET
# -----------------------------------
def clean_anemia():

    df = pd.read_csv(anemia_path)

    df.fillna(df.median(numeric_only=True), inplace=True)

    df.to_csv(os.path.join(OUTPUT_PATH, "anemia_cleaned.csv"), index=False)

    print("Anemia dataset cleaned")


# -----------------------------------
# RUN ALL CLEANING
# -----------------------------------
def run_all():

    clean_heart()
    clean_diabetes()
    clean_kidney()
    clean_anemia()

    print("\nAll datasets cleaned successfully!")


if __name__ == "__main__":
    run_all()