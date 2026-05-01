from pydantic import BaseModel


class CandidateResponse(BaseModel):
    id: int
    election_id: int
    user_id: int
    application_id: int | None = None

    class Config:
        from_attributes = True