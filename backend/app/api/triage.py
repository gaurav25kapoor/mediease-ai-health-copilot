from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.schemas import SymptomRequest
from app.services.triage_service import analyze_symptoms

from app.db.database import get_db
from app.db.models import Symptom

router = APIRouter(tags=["Triage"])


@router.post("/analyze")
def triage_analyze(request: SymptomRequest, db: Session = Depends(get_db)):
    text = request.symptoms

    # Convert sentence → symptom list
    symptoms_list = []

    if isinstance(text, str):
        symptoms_list = [
            s.strip()
            for s in text.replace("and", ",").split(",")
            if s.strip()
        ]
    else:
        symptoms_list = text

    result = analyze_symptoms(text)
    # Save result to database
    symptom_record = Symptom(
        symptoms=request.symptoms,
        risk_level=result["risk_level"],
        urgency=result["urgency"]
    )

    db.add(symptom_record)
    db.commit()
    db.refresh(symptom_record)

    return result