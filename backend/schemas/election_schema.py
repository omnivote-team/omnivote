from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from schemas.candidate_schema import CandidateResponse
from schemas.candidate_application_schema import CandidateApplicationResponse
from schemas.result_schema import ResultResponse


class ElectionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    election_type: str
    start_datetime: datetime
    end_datetime: datetime

    institution_id: Optional[int] = None
    new_institution_name: Optional[str] = None

    department_id: Optional[int] = None
    new_department_name: Optional[str] = None

    batch_id: Optional[int] = None
    new_batch_name: Optional[str] = None

    section_id: Optional[int] = None
    new_section_name: Optional[str] = None


class PublicElectionResponse(BaseModel):
    id: int
    title: str
    status: str
    start_datetime: datetime
    end_datetime: datetime
    institution_id: int
    institution_name: Optional[str] = None
    election_type: str

    class Config:
        from_attributes = True


class FullElectionResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    election_type: str
    status: str
    start_datetime: datetime
    end_datetime: datetime
    institution_id: int
    institution_name: Optional[str] = None
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    batch_id: Optional[int] = None
    batch_name: Optional[str] = None
    section_id: Optional[int] = None
    section_name: Optional[str] = None
    created_by: int

    class Config:
        from_attributes = True


class CandidateDetailResponse(BaseModel):
    id: int
    election_id: int
    user_id: int
    application_id: Optional[int] = None
    candidate_name: Optional[str] = None
    manifesto: Optional[str] = None

    class Config:
        from_attributes = True


class FullElectionWithCandidatesResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    election_type: str
    status: str
    start_datetime: datetime
    end_datetime: datetime
    institution_id: int
    institution_name: Optional[str] = None
    department_id: Optional[int] = None
    batch_id: Optional[int] = None
    section_id: Optional[int] = None
    created_by: int
    candidates: list[CandidateDetailResponse]
    department_name: Optional[str] = None
    batch_name: Optional[str] = None
    section_name: Optional[str] = None

    class Config:
        from_attributes = True


class AdminElectionDetailsResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    election_type: str
    status: str
    results_published: bool

    start_datetime: datetime
    end_datetime: datetime

    institution_id: int
    institution_name: Optional[str] = None
    department_id: Optional[int] = None
    batch_id: Optional[int] = None
    section_id: Optional[int] = None
    created_by: int

    candidates: list[CandidateResponse]
    applications: list[CandidateApplicationResponse]
    results: list[ResultResponse]

    total_votes: int
    total_candidates: int
    total_applications: int

    department_name: Optional[str] = None
    batch_name: Optional[str] = None
    section_name: Optional[str] = None

    class Config:
        from_attributes = True