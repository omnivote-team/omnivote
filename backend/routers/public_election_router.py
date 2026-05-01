from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.election_model import Election
from schemas.election_schema import PublicElectionResponse


router = APIRouter(
    prefix="/public/elections",
    tags=["Public Elections"]
)


@router.get("/", response_model=list[PublicElectionResponse])
def get_public_elections(db: Session = Depends(get_db)):
    elections = db.query(Election).all()
    return elections