from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.advisor import ChatRequest, ChatResponse
from backend.app.services.advisor_service import advisor_service

router = APIRouter(prefix="/advisor", tags=["AI Advisor"])

@router.post("/chat", response_model=ChatResponse)
def advisor_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Conversational property and investment assistant aware of RealVest dataset, ML models, and comparison context.
    """
    res = advisor_service.generate_reply(db=db, message=req.message, context=req.context)
    return ChatResponse(**res)
