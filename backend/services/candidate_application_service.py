from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.candidate_application_model import CandidateApplication
from models.candidate_model import Candidate
from models.user_model import User
from models.election_model import Election

from services.authorization_service import can_apply_as_candidate
from services.eligibility_service import check_user_election_eligibility
VALID_APPLICATION_STATUSES = ["approved", "rejected"]

from models.institution_model import Institution

def get_application_by_id(db: Session, application_id: int):
    application = db.query(CandidateApplication).filter(
        CandidateApplication.id == application_id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate application not found"
        )

    return application


def decide_application(db: Session, application_id: int, status: str, remarks: str | None = None):
    application = get_application_by_id(db, application_id)

    election = db.query(Election).filter(Election.id == application.election_id).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    if election.status != "upcoming":
        raise HTTPException(
            status_code=400,
            detail="Candidate applications can only be approved or rejected before the election opens"
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application has already been processed"
        )

    if status not in VALID_APPLICATION_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Status must be approved or rejected"
        )

    application.status = status
    application.reviewed_at = datetime.utcnow()

    if status == "rejected":
        application.remarks = remarks

    if status == "approved":
        application.remarks = None

    if status == "approved":
        new_candidate = Candidate(
            election_id=application.election_id,
            user_id=application.user_id,
            application_id=application.id
        )

        db.add(new_candidate)

    try:
        db.commit()
        db.refresh(application)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Candidate already exists for this election"
        )

    return application

def cancel_own_application(db: Session, application_id: int, user_id: int):
    application = get_application_by_id(db, application_id)

    if application.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You can only cancel your own application"
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending applications can be cancelled"
        )

    application.status = "cancelled"
    application.remarks = "Cancelled by applicant"

    db.commit()
    db.refresh(application)

    return application


def get_admin_application_list(db: Session):
    rows = (
        db.query(CandidateApplication, User, Election)
        .join(User, CandidateApplication.user_id == User.id)
        .join(Election, CandidateApplication.election_id == Election.id)
        .all()
    )
    result = []
    for application, user, election in rows:
        result.append({
            "id": application.id,
            "election_id": election.id,
            "election_title": election.title,
            "user_id": user.id,
            "applicant_name": user.full_name,
            "applicant_email": user.email,
            "manifesto": application.manifesto,
            "status": application.status,
            "remarks": application.remarks,
            "created_at": application.created_at,
            "updated_at": application.updated_at,
            "reviewed_at": application.reviewed_at
        })

    return result

def validate_user_can_create_application(
    db: Session,
    election_id: int,
    user_id: int
):
    existing_application = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id,
        CandidateApplication.user_id == user_id
    ).first()

    if existing_application is None:
        return

    if existing_application.status in ["pending", "approved"]:
        raise HTTPException(
            status_code=400,
            detail="You already have an active application for this election"
        )

    if existing_application.status in ["rejected", "cancelled"]:
        db.delete(existing_application)
        db.commit()

def get_admin_filtered_applications(
    db: Session,
    election_id: int | None = None,
    status: str | None = None
):
    if status is not None and status not in ["pending", "approved", "rejected", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, approved, rejected, or cancelled"
        )

    query = (
        db.query(CandidateApplication, User, Election)
        .join(User, CandidateApplication.user_id == User.id)
        .join(Election, CandidateApplication.election_id == Election.id)
    )

    if election_id is not None:
        query = query.filter(CandidateApplication.election_id == election_id)

    if status is not None:
        query = query.filter(CandidateApplication.status == status)

    rows = query.all()

    result = []

    for application, user, election in rows:
        result.append({
            "id": application.id,
            "election_id": election.id,
            "election_title": election.title,
            "user_id": user.id,
            "applicant_name": user.full_name,
            "applicant_email": user.email,
            "manifesto": application.manifesto,
            "status": application.status,
            "remarks": application.remarks,
            "created_at": application.created_at,
            "updated_at": application.updated_at,
            "reviewed_at": application.reviewed_at
        })

    return result


def create_candidate_application(
    db: Session,
    election_id: int,
    user_id: int,
    manifesto: str | None = None
):
    validate_user_can_create_application(
        db=db,
        election_id=election_id,
        user_id=user_id
    )

    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    can_apply_as_candidate(user, election)
    check_user_election_eligibility(user, election)

    new_application = CandidateApplication(
        election_id=election_id,
        user_id=user_id,
        manifesto=manifesto,
        status="pending",
        remarks=None
    )

    try:
        db.add(new_application)
        db.commit()
        db.refresh(new_application)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this election"
        )

    return new_application


def get_applications_by_status_service(db: Session, status: str):
    if status not in ["pending", "approved", "rejected", "cancelled"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, approved, rejected, or cancelled"
        )

    return db.query(CandidateApplication).filter(
        CandidateApplication.status == status
    ).all()


def get_applications_by_election_service(db: Session, election_id: int):
    return db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).all()


def get_user_applications_service(db: Session, user_id: int):
    rows = (
        db.query(CandidateApplication, Election, Institution)
        .join(Election, CandidateApplication.election_id == Election.id)
        .join(Institution, Election.institution_id == Institution.id)
        .filter(CandidateApplication.user_id == user_id)
        .all()
    )

    result = []

    for application, election, institution in rows:
        result.append({
            "id": application.id,
            "election_id": application.election_id,
            "election_title": election.title,
            "institution_id": election.institution_id,
            "institution_name": institution.name,
            "user_id": application.user_id,
            "manifesto": application.manifesto,
            "status": application.status,
            "remarks": application.remarks,
            "created_at": application.created_at,
            "updated_at": application.updated_at,
            "reviewed_at": application.reviewed_at
        })

    return result