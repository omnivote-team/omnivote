from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.vote_model import Vote
from models.user_model import User
from models.election_model import Election
from models.candidate_model import Candidate

from services.authorization_service import can_vote
from services.eligibility_service import check_user_election_eligibility

def check_vote_rules(db, user, election, candidate_id):
    if election.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Election is not open for voting"
        )

    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id,
        Candidate.election_id == election.id
    ).first()

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate does not belong to this election"
        )

    existing_vote = db.query(Vote).filter(
        Vote.election_id == election.id,
        Vote.user_id == user.id
    ).first()

    if existing_vote:
        raise HTTPException(
            status_code=400,
            detail="You have already voted in this election"
        )

    return True


from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.vote_model import Vote
from models.user_model import User
from models.election_model import Election

from services.authorization_service import can_vote
from services.eligibility_service import check_user_election_eligibility


def cast_vote_service(
    db: Session,
    election_id: int,
    candidate_id: int,
    user_id: int
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    can_vote(user, election)
    check_user_election_eligibility(user, election)
    check_vote_rules(db, user, election, candidate_id)

    new_vote = Vote(
        election_id=election_id,
        candidate_id=candidate_id,
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

def get_user_voting_history_service(db: Session, user_id: int):
    return db.query(Vote).filter(
        Vote.user_id == user_id
    ).all()