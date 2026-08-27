from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    reply: str
    sources: List[str] = []
    context_used: Dict[str, Any] = {}
