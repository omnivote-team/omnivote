from pydantic import BaseModel
from typing import Optional


class CandidateApplicationCreate(BaseModel):
    election_id: int
    manifesto: Optional[str] = None


class CandidateApplicationResponse(BaseModel):
    id: int
    election_id: int
    user_id: int
    manifesto: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class CandidateApplicationDecision(BaseModel):
    status: str