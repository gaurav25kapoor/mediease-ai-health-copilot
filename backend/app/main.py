from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.db import models
from app.api import dashboard

# --------------------------------------------------
# Import API Routers
# --------------------------------------------------

from app.api import copilot
from app.api import triage
from app.api import prediction
from app.api import reports


# --------------------------------------------------
# Create FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="MediEase AI Health Copilot API",
    description="""
AI-powered healthcare platform providing:

• Symptom triage using LLM  
• Disease risk prediction using ML models  
• Medical report analysis (OCR + NLP + ML)  
• AI health copilot for contextual assistance
""",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# CORS Middleware (Required for Next.js frontend)
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Register API Routers
# --------------------------------------------------


# Symptom Triage (LLM based symptom checker)
app.include_router(triage.router, prefix="/triage", tags=["Symptom Triage"])

# Disease Risk Prediction (ML models)
app.include_router(prediction.router, prefix="/prediction", tags=["Disease Prediction"])

# Medical Report Analyzer (OCR + ML + AI explanation)
app.include_router(reports.router, prefix="/reports", tags=["Report Analyzer"])

# AI Health Copilot (context-aware assistant)
app.include_router(copilot.router, prefix="/api", tags=["AI Copilot"])

app.include_router(dashboard.router, prefix="/dashboard")


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get("/", tags=["System"])
def root():
    return {
        "message": "MediEase AI backend running",
        "version": "1.0.0",
        "services": [
            "AI Health Chat",
            "Symptom Triage",
            "Disease Risk Prediction",
            "Medical Report Analyzer",
            "AI Health Copilot",
            "Dashboard API"
        ]
    }


# --------------------------------------------------
# Health Check Endpoint
# --------------------------------------------------

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": "MediEase API",
        "version": "1.0.0"
    }
