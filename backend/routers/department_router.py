from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.department_model import Department

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)


@router.get("/")
def get_departments(institution_id: int, db: Session = Depends(get_db)):
    departments = db.query(Department).filter( Department.institution_id == institution_id).all()

    return departments