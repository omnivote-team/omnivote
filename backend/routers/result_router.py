from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import require_admin
from services.result_service import (
    generate_results_for_election,
    publish_results_for_election,
    check_results_visible
)
from models.election_model import Election
from models.result_model import Result
from services.authorization_service import can_view_results

from schemas.result_schema import ResultResponse


router = APIRouter(
    prefix="/results",
    tags=["Results"]
)


@router.post("/generate/{election_id}", response_model=list[ResultResponse])
def generate_results(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    generate_results_for_election(db, election)

    db.commit()

    results = db.query(Result).filter(
        Result.election_id == election_id
    ).all()

    return results

@router.put("/publish/{election_id}")
def publish_results(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    publish_results_for_election(election)

    db.commit()
    db.refresh(election)

    return {
        "message": "Results published successfully",
        "election_id": election.id,
        "results_published": election.results_published
    }


@router.get("/election/{election_id}", response_model=list[ResultResponse])
def view_published_results(
    election_id: int,
    db: Session = Depends(get_db)
):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    can_view_results(election)

    results = db.query(Result).filter(
        Result.election_id == election_id
    ).all()

    return results