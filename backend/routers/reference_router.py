from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from models.institution_model import Institution
from models.department_model import Department
from models.batch_model import Batch
from models.section_model import Section


router = APIRouter(
    prefix="/references",
    tags=["References"]
)


@router.get("/institutions")
def get_institutions(
    db: Session = Depends(get_db)
):
    institutions = db.query(Institution).all()

    return institutions


@router.get("/departments/{institution_id}")
def get_departments(
    institution_id: int,
    db: Session = Depends(get_db)
):
    departments = db.query(Department).filter(
        Department.institution_id == institution_id
    ).all()

    return departments


@router.get("/batches/{institution_id}")
def get_batches(
    institution_id: int,
    db: Session = Depends(get_db)
):
    batches = db.query(Batch).filter(
        Batch.institution_id == institution_id
    ).all()

    return batches


@router.get("/sections")
def get_sections(
    institution_id: int,
    department_id: int,
    batch_id: int,
    db: Session = Depends(get_db)
):
    sections = db.query(Section).filter(
        Section.institution_id == institution_id,
        Section.department_id == department_id,
        Section.batch_id == batch_id
    ).all()

    return sections