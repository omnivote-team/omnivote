from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.section_model import Section

router = APIRouter(
    prefix="/sections",
    tags=["Sections"]
)


@router.get("/")
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