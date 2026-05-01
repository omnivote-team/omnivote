from pydantic import BaseModel


class CandidateResponse(BaseModel):
    id: int
    election_id: int
    user_id: int
    application_id: int | None = None

    class Config:
        from_attributes = True


class AdminCandidateResponse(BaseModel):
    id: int
    election_id: int
    election_title: str
    user_id: int
    candidate_name: str
    candidate_email: str
    application_id: int | None = None