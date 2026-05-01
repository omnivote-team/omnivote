from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import require_admin
from services.dashboard_service import (
    get_admin_dashboard_summary,
    get_election_dashboard_summary
)


router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"]
)

@router.get("/summary")
def admin_dashboard_summary(
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_admin_dashboard_summary(db)

@router.get("/election/{election_id}")
def election_dashboard_summary(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return get_election_dashboard_summary(db, election_id)