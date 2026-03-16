from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

from app.services.copilot_service import run_copilot


# --------------------------------------------------
# ROUTER
# --------------------------------------------------

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class CopilotRequest(BaseModel):
    question: str
    page: Optional[str] = None
    labs: Optional[Dict[str, Any]] = None
    predictions: Optional[Dict[str, Any]] = None
    explanation: Optional[Dict[str, Any]] = None
    symptoms: Optional[List[str]] = None
    symptom_analysis: Optional[Dict[str, Any]] = None


# --------------------------------------------------
# RESPONSE MODEL
# --------------------------------------------------

class CopilotResponse(BaseModel):
    answer: str


# --------------------------------------------------
# COPILOT ENDPOINT
# --------------------------------------------------

@router.post("/", response_model=CopilotResponse)
async def copilot(req: CopilotRequest):

    try:

        answer = run_copilot(
            question=req.question,
            page=req.page,
            labs=req.labs,
            predictions=req.predictions,
            explanation=req.explanation,
            symptoms=req.symptoms,
            symptom_analysis=req.symptom_analysis
        )

        return CopilotResponse(answer=answer)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Copilot processing failed: {str(e)}"
        )
