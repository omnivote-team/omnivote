from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.candidate_schema import CandidateResponse, AdminCandidateResponse
from services.auth_dependency import get_current_user_data, require_admin
from services.candidate_service import (
    get_candidates_by_election_service,
    get_admin_candidates_by_election_service
)


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


@router.get("/election/{election_id}", response_model=list[CandidateResponse])
def get_candidates_by_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return get_candidates_by_election_service(
        db=db,
        election_id=election_id
    )


@router.get("/admin/election/{election_id}", response_model=list[AdminCandidateResponse])
def get_admin_candidates_by_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_admin_candidates_by_election_service(
        db=db,
        election_id=election_id
    )