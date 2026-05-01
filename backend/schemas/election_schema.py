from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ElectionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    election_type: str
    start_datetime: datetime
    end_datetime: datetime
    institution_id: int
    department_id: Optional[int] = None
    batch_id: Optional[int] = None
    section_id: Optional[int] = None


class PublicElectionResponse(BaseModel):
    id: int
    title: str
    status: str
    start_datetime: datetime
    end_datetime: datetime
    institution_id: int

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
    department_id: Optional[int] = None
    batch_id: Optional[int] = None
    section_id: Optional[int] = None
    created_by: int

    class Config:
        from_attributes = True