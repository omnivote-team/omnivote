# user_election_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from services.election_status_service import compute_status,sync_election_status

from models.election_model import Election
from models.candidate_model import Candidate
from models.institution_model import Institution
from models.user_model import User
from models.candidate_application_model import CandidateApplication
from services.authorization_service import can_view_full_election
from services.eligibility_service import check_user_election_eligibility


def get_full_election_details_service(db: Session, election_id: int, current_user):
    can_view_full_election(current_user)

    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )
    sync_election_status(db, election)

    user = db.query(User).filter(
    User.id == current_user["user_id"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    check_user_election_eligibility(user, election)
    
    institution = db.query(Institution).filter(
            Institution.id == election.institution_id
        ).first()

    candidates = (
        db.query(Candidate, User, CandidateApplication)
        .join(User, Candidate.user_id == User.id)
        .outerjoin(
            CandidateApplication,
            Candidate.application_id == CandidateApplication.id
        )
        .filter(Candidate.election_id == election_id)
        .all()
    )

    candidate_list = []

    for candidate, user, application in candidates:
        candidate_list.append({
            "id": candidate.id,
            "election_id": candidate.election_id,
            "user_id": candidate.user_id,
            "application_id": candidate.application_id,
            "candidate_name": user.full_name,
            "manifesto": application.manifesto if application else None
        })

    return {
        "id": election.id,
        "title": election.title,
        "description": election.description,
        "election_type": election.election_type,
        "status": election.status,
        "start_datetime": election.start_datetime,
        "end_datetime": election.end_datetime,
        "institution_id": election.institution_id,
        "institution_name": institution.name if institution else None,
        "department_id": election.department_id,
        "batch_id": election.batch_id,
        "section_id": election.section_id,
        "created_by": election.created_by,
        "candidates": candidate_list
    }