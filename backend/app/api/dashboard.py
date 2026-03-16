from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.database import get_db
from app.db.models import Report, Prediction, Symptom


router = APIRouter(tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):

    # -------------------------
    # Latest Reports
    # -------------------------
    reports = db.query(Report).order_by(desc(Report.created_at)).limit(5).all()

    report_history = []

    for r in reports:
        report_history.append({
            "id": r.id,
            "risk_level": r.risk_level,
            "risk_score": r.risk_score,
            "created_at": r.created_at,
            "labs": r.labs,
            "predictions": r.predictions
        })

    # -------------------------
    # Latest Predictions
    # -------------------------
    predictions = db.query(Prediction).order_by(desc(Prediction.created_at)).limit(10).all()

    prediction_history = []

    for p in predictions:
        prediction_history.append({
            "id": p.id,
            "model": p.model,
            "probability": p.probability,
            "prediction": p.prediction,
            "created_at": p.created_at
        })

    # -------------------------
    # Latest Symptom Analysis
    # -------------------------
    latest_symptom = db.query(Symptom).order_by(desc(Symptom.created_at)).first()

    symptom_data = None

    if latest_symptom:
        symptom_data = {
            "symptoms": latest_symptom.symptoms,
            "risk_level": latest_symptom.risk_level,
            "urgency": latest_symptom.urgency,
            "created_at": latest_symptom.created_at
        }

    # -------------------------
    # Simple Risk Score
    # -------------------------
    overall_risk = "Low"

    if reports:
        latest_report = reports[0]
        overall_risk = latest_report.risk_level

    return {
        "overview": {
            "total_reports": len(report_history),
            "total_predictions": len(prediction_history),
            "overall_risk": overall_risk
        },
        "reports": report_history,
        "predictions": prediction_history,
        "latest_symptom_analysis": symptom_data
    }