from pydantic import BaseModel

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