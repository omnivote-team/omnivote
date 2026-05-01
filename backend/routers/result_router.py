from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.auth_dependency import require_admin
from services.result_service import (
    generate_results_service,
    publish_results_service,
    view_published_results_service
)

from schemas.result_schema import ResultResponse


router = APIRouter(
    prefix="/results",
    tags=["Results"]
)


@router.post("/generate/{election_id}", response_model=list[ResultResponse])
def generate_results(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return generate_results_service(db=db, election_id=election_id)


@router.put("/publish/{election_id}")
def publish_results(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    return publish_results_service(db=db, election_id=election_id)


@router.get("/election/{election_id}", response_model=list[ResultResponse])
def view_published_results(
    election_id: int,
    db: Session = Depends(get_db)
):
    return view_published_results_service(db=db, election_id=election_id)