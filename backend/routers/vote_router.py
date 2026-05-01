from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import get_current_user_data
from services.eligibility_service import check_user_election_eligibility
from services.vote_service import check_vote_rules

from models.vote_model import Vote
from models.user_model import User
from models.election_model import Election
from services.authorization_service import can_vote

from schemas.vote_schema import VoteCreate, VoteResponse
from sqlalchemy.exc import IntegrityError

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
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    election = db.query(Election).filter(
        Election.id == vote_data.election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    can_vote(user, election)

    check_user_election_eligibility(user, election)

    check_vote_rules(db, user, election, vote_data.candidate_id)

    new_vote = Vote(
        election_id=vote_data.election_id,
        candidate_id=vote_data.candidate_id,
        user_id=user.id
    )

    try:
        db.add(new_vote)
        db.commit()
        db.refresh(new_vote)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="You have already voted in this election"
        )
    return new_vote

@router.get("/my-history", response_model=list[VoteResponse])
def get_my_voting_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    votes = db.query(Vote).filter(
        Vote.user_id == current_user["user_id"]
    ).all()

    return votes