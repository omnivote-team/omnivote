from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CandidateApplicationCreate(BaseModel):
    election_id: int
    manifesto: Optional[str] = None


class CandidateApplicationResponse(BaseModel):
    id: int
    election_id: int
    election_title: Optional[str] = None
    institution_id: Optional[int] = None
    institution_name: Optional[str] = None
    user_id: int
    manifesto: Optional[str] = None
    status: str
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None


class CandidateApplicationDecision(BaseModel):
    status: str
    remarks: Optional[str] = None

class AdminCandidateApplicationResponse(BaseModel):
    id: int

    election_id: int
    election_title: str

    user_id: int
    applicant_name: str
    applicant_email: str

    manifesto: Optional[str] = None

    status: str
    remarks: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None