from pydantic import BaseModel
from typing import Optional


class VoteCreate(BaseModel):
    election_id: int
    candidate_id: int


class VoteResponse(BaseModel):
    id: int
    election_id: int
    candidate_id: int
    user_id: int

    class Config:
        from_attributes = True


class VoteHistoryResponse(BaseModel):
    id: int
    election_id: int
    election_title: str
    candidate_id: int
    voted_at: Optional[str] = None