from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    success: bool = True
    reply: str
    sources: List[str] = []
    context_used: Dict[str, Any] = {}

