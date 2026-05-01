from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.election_schema import FullElectionWithCandidatesResponse
from services.auth_dependency import get_current_user_data
from services.user_election_service import get_full_election_details_service


router = APIRouter(
    prefix="/user/elections",
    tags=["User Elections"]
)


@router.get("/{election_id}", response_model=FullElectionWithCandidatesResponse)
def get_full_election_details(
    election_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return get_full_election_details_service(
        db=db,
        election_id=election_id,
        current_user=current_user
    )