from pydantic import BaseModel
from typing import Optional


class ResultResponse(BaseModel):
    id: int
    election_id: int
    candidate_id: int
    candidate_name: Optional[str] = None
    vote_count: int
    is_winner: bool

    class Config:
        from_attributes = True