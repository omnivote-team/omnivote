from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import get_current_user_data, require_admin
from models.candidate_application_model import CandidateApplication
from models.user_model import User
from models.election_model import Election
from models.candidate_model import Candidate
from services.eligibility_service import check_user_election_eligibility
from schemas.candidate_application_schema import (
    CandidateApplicationCreate,
    CandidateApplicationResponse,
    CandidateApplicationDecision
)
from sqlalchemy.exc import IntegrityError
from services.authorization_service import can_apply_as_candidate

router = APIRouter(
    prefix="/candidate-applications",
    tags=["Candidate Applications"]
)


@router.post("/", response_model=CandidateApplicationResponse)
def apply_as_candidate(
    application_data: CandidateApplicationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    existing_application = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == application_data.election_id,
        CandidateApplication.user_id == current_user["user_id"]
    ).first()

    if existing_application:
        raise HTTPException( status_code=400,detail="You have already applied for this election")

    election = db.query(Election).filter(Election.id == application_data.election_id).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    can_apply_as_candidate(user, election)

    check_user_election_eligibility(user, election)

    new_application = CandidateApplication(
        election_id=application_data.election_id,
        user_id= current_user["user_id"],
        manifesto=application_data.manifesto,
        status="pending"
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


@router.get("/my-applications", response_model=list[CandidateApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    applications = db.query(CandidateApplication).filter(
        CandidateApplication.user_id == current_user["user_id"]
    ).all()

    return applications


@router.get("/", response_model=list[CandidateApplicationResponse])
def get_all_applications(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    applications = db.query(CandidateApplication).all()
    return applications


@router.put("/{application_id}/decision", response_model=CandidateApplicationResponse)
def decide_candidate_application(
    application_id: int,
    decision: CandidateApplicationDecision,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    application = db.query(CandidateApplication).filter(
        CandidateApplication.id == application_id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate application not found"
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application has already been processed"
        )

    if decision.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be approved or rejected"
        )

    application.status = decision.status

    if decision.status == "approved":
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

@router.get("/admin/status/{status}", response_model=list[CandidateApplicationResponse])
def get_applications_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, approved, or rejected"
        )

    applications = db.query(CandidateApplication).filter(
        CandidateApplication.status == status
    ).all()

    return applications

@router.get("/admin/election/{election_id}", response_model=list[CandidateApplicationResponse])
def get_applications_by_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).all()

    return applications