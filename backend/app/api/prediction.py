from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict
from sqlalchemy.orm import Session

from app.services.prediction_service import (
    predict_heart,
    predict_diabetes,
    predict_kidney,
    predict_anemia
)

from app.db.database import get_db
from app.db.models import Prediction


router = APIRouter(
    tags=["Risk Prediction"]
)


class PredictionRequest(BaseModel):
    features: Dict[str, float]


@router.get("/")
def prediction_test():
    return {"message": "Prediction API working"}


# ---------------- HEART ---------------- #

@router.post("/heart")
def heart_prediction(request: PredictionRequest, db: Session = Depends(get_db)):

    result = predict_heart(request.features)

    probability = result.get("probability", 0)
    prediction = result.get("prediction", 0)

    prediction_record = Prediction(
        model="heart",
        probability=probability,
        prediction=prediction
    )

    db.add(prediction_record)
    db.commit()

    return {
        "disease": "heart_disease",
        "result": result
    }


# ---------------- DIABETES ---------------- #

@router.post("/diabetes")
def diabetes_prediction(request: PredictionRequest, db: Session = Depends(get_db)):

    result = predict_diabetes(request.features)

    probability = result.get("probability", 0)
    prediction = result.get("prediction", 0)

    prediction_record = Prediction(
        model="diabetes",
        probability=probability,
        prediction=prediction
    )

    db.add(prediction_record)
    db.commit()

    return {
        "disease": "diabetes",
        "result": result
    }


# ---------------- KIDNEY ---------------- #

@router.post("/kidney")
def kidney_prediction(request: PredictionRequest, db: Session = Depends(get_db)):

    result = predict_kidney(request.features)

    probability = result.get("probability", 0)
    prediction = result.get("prediction", 0)

    prediction_record = Prediction(
        model="kidney",
        probability=probability,
        prediction=prediction
    )

    db.add(prediction_record)
    db.commit()

    return {
        "disease": "kidney_disease",
        "result": result
    }


# ---------------- ANEMIA ---------------- #

@router.post("/anemia")
def anemia_prediction(request: PredictionRequest, db: Session = Depends(get_db)):

    result = predict_anemia(request.features)

    probability = result.get("probability", 0)
    prediction = result.get("prediction", 0)

    prediction_record = Prediction(
        model="anemia",
        probability=probability,
        prediction=prediction
    )

    db.add(prediction_record)
    db.commit()

    return {
        "disease": "anemia",
        "result": result
    }