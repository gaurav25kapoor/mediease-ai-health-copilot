import subprocess
import os

print("\n🚀 Starting MediEase Model Training Pipeline\n")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

scripts = [
    "train_heart_model.py",
    "train_diabetes_model.py",
    "train_kidney_model.py",
    "train_anemia_model.py"
]

for script in scripts:

    script_path = os.path.join(BASE_DIR, script)

    print("\n==============================")
    print(f"Training {script}")
    print("==============================\n")

    result = subprocess.run(["python", script_path])

    if result.returncode != 0:
        print(f"\n❌ Error while running {script}")
        break

print("\n✅ All models training completed\n")