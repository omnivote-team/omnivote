from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.election_schema import PublicElectionResponse
from services.public_election_service import get_public_elections_service



router = APIRouter(
    prefix="/public/elections",
    tags=["Public Elections"]
)


@router.get("/", response_model=list[PublicElectionResponse])
def get_public_elections(db: Session = Depends(get_db)):
    return get_public_elections_service(db=db)