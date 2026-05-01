from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.candidate_model import Candidate
from models.election_model import Election
from schemas.candidate_schema import CandidateResponse
from services.auth_dependency import get_current_user_data

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
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    candidates = db.query(Candidate).filter(
        Candidate.election_id == election_id
    ).all()

    return candidates