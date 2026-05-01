from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.batch_model import Batch

router = APIRouter(
    prefix="/batches",
    tags=["Batches"]
)


@router.get("/")
def get_batches(institution_id: int, db: Session = Depends(get_db)):

    batches = db.query(Batch).filter(
        Batch.institution_id == institution_id
    ).all()

    return batches