from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.candidate_model import Candidate
from models.election_model import Election
from models.user_model import User


def get_candidates_by_election_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    return db.query(Candidate).filter(
        Candidate.election_id == election_id
    ).all()


def get_admin_candidates_by_election_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    rows = (
        db.query(Candidate, User)
        .join(User, Candidate.user_id == User.id)
        .filter(Candidate.election_id == election_id)
        .all()
    )

    result = []

    for candidate, user in rows:
        result.append({
            "id": candidate.id,
            "election_id": election.id,
            "election_title": election.title,
            "user_id": user.id,
            "candidate_name": user.full_name,
            "candidate_email": user.email,
            "application_id": candidate.application_id
        })

    return result