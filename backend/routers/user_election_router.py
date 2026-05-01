from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.election_model import Election

from schemas.election_schema import FullElectionResponse

from services.auth_dependency import get_current_user_data
from services.authorization_service import can_view_full_election


router = APIRouter(
    prefix="/user/elections",
    tags=["User Elections"]
)


@router.get("/{election_id}", response_model=FullElectionResponse)
def get_full_election_details(
    election_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    can_view_full_election(current_user)

    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    return election