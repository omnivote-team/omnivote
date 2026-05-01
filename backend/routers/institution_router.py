from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.institution_model import Institution

router = APIRouter(
    prefix="/institutions",
    tags=["Institutions"]
)


@router.get("/")
def get_institutions(db: Session = Depends(get_db)):
    institutions = db.query(Institution).all()

    return institutions