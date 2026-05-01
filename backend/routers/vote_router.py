from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import get_current_user_data
from services.vote_service import (
    cast_vote_service,
    get_user_voting_history_service
)

from schemas.vote_schema import VoteCreate, VoteResponse


router = APIRouter(
    prefix="/votes",
    tags=["Votes"]
)


@router.post("/", response_model=VoteResponse)
def cast_vote(
    vote_data: VoteCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return cast_vote_service(
        db=db,
        election_id=vote_data.election_id,
        candidate_id=vote_data.candidate_id,
        user_id=current_user["user_id"]
    )


@router.get("/my-history", response_model=list[VoteResponse])
def get_my_voting_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return get_user_voting_history_service(
        db=db,
        user_id=current_user["user_id"]
    )