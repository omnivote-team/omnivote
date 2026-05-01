from fastapi import HTTPException
from models.vote_model import Vote
from models.candidate_model import Candidate


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