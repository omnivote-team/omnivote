from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from services.auth_dependency import get_current_user_data, require_admin
from services.candidate_application_service import (
    create_candidate_application,
    decide_application,
    cancel_own_application,
    get_admin_application_list,
    get_admin_filtered_applications,
    get_applications_by_status_service,
    get_applications_by_election_service,
    get_user_applications_service
)

from schemas.candidate_application_schema import (
    CandidateApplicationCreate,
    CandidateApplicationResponse,
    CandidateApplicationDecision,
    AdminCandidateApplicationResponse
)


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
    return create_candidate_application(
        db=db,
        election_id=application_data.election_id,
        user_id=current_user["user_id"],
        manifesto=application_data.manifesto
    )

@router.get("/my-applications", response_model=list[CandidateApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return get_user_applications_service(
        db=db,
        user_id=current_user["user_id"]
    )


@router.get("/", response_model=list[AdminCandidateApplicationResponse])
def get_all_applications(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    return get_admin_application_list(db)


@router.get("/admin/filter", response_model=list[AdminCandidateApplicationResponse])
def filter_admin_applications(
    election_id: int | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_admin_filtered_applications(
        db=db,
        election_id=election_id,
        status=status
    )

@router.put("/{application_id}/decision", response_model=CandidateApplicationResponse)
def decide_candidate_application(
    application_id: int,
    decision: CandidateApplicationDecision,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    return decide_application(
        db=db,
        application_id=application_id,
        status=decision.status,
        remarks=decision.remarks
    )


@router.put("/{application_id}/cancel", response_model=CandidateApplicationResponse)
def cancel_candidate_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_data)
):
    return cancel_own_application(
        db=db,
        application_id=application_id,
        user_id=current_user["user_id"]
    )


@router.get("/admin/status/{status}", response_model=list[CandidateApplicationResponse])
def get_applications_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_applications_by_status_service(db=db, status=status)

@router.get("/admin/election/{election_id}", response_model=list[CandidateApplicationResponse])
def get_applications_by_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_applications_by_election_service(db=db, election_id=election_id)