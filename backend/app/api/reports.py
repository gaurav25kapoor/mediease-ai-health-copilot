from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.services.report_service import analyze_report

from app.db.database import get_db
from app.db.models import Report


router = APIRouter(
    tags=["Medical Report Analyzer"]
)


@router.post("/analyze")
async def analyze_medical_report(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Run report analysis
    result = analyze_report(file)

    # Extract risk summary safely
    risk_summary = result.get("explanation", {}).get("risk_summary", {})

    risk_level = risk_summary.get("risk_level")
    risk_score = risk_summary.get("overall_risk_score")

    labs = result.get("lab_values")
    predictions = result.get("predictions")

    # Save report record in database
    report_record = Report(
        risk_level=risk_level,
        risk_score=risk_score,
        labs=labs,
        predictions=predictions
    )

    db.add(report_record)
    db.commit()
    db.refresh(report_record)

    return result