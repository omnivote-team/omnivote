from pydantic import BaseModel

class ResultResponse(BaseModel):
    id: int
    election_id: int
    candidate_id: int
    vote_count: int
    is_winner: bool

    class Config:
        from_attributes = True