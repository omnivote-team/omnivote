from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from schemas.election_schema import (
    ElectionCreate,
    AdminElectionDetailsResponse
)

from services.auth_dependency import require_admin

from services.election_service import (
    create_election_service,
    get_admin_election_details_service,
    get_admin_election_list_service,
    delete_election_service,
    update_election_service
)


router = APIRouter(
    prefix="/admin/elections",
    tags=["Admin Elections"]
)


@router.post("/")
def create_election(
    election: ElectionCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return create_election_service(
        db=db,
        election=election,
        admin_id=current_admin["user_id"]
    )

@router.get("/")
def get_admin_election_list(
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_admin_election_list_service(db=db)

@router.get("/{election_id}", response_model=AdminElectionDetailsResponse)
def get_admin_election_details(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_admin_election_details_service(
        db=db,
        election_id=election_id
    )

@router.put("/{election_id}")
def update_election(
    election_id: int,
    election: ElectionCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return update_election_service(
        db=db,
        election_id=election_id,
        election_data=election
    )

@router.delete("/{election_id}")
def delete_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return delete_election_service(db=db, election_id=election_id)