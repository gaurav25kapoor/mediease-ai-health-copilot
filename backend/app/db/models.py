from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.types import JSON

from .database import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    risk_level = Column(String)
    risk_score = Column(Float)

    labs = Column(JSON)
    predictions = Column(JSON)


class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    model = Column(String)
    probability = Column(Float)
    prediction = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Symptom(Base):

    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)

    symptoms = Column(JSON)
    risk_level = Column(String)
    urgency = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())