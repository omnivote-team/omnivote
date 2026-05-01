from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.election_model import Election
from models.institution_model import Institution
from models.department_model import Department
from models.batch_model import Batch
from models.section_model import Section

from schemas.election_schema import ElectionCreate

from services.auth_dependency import require_admin
from services.election_status_service import open_election, close_election

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
    institution = db.query(Institution).filter(Institution.id == election.institution_id).first()

    if institution is None:
        return {"error": "Invalid institution selected"}


    if election.department_id is not None:
        department = db.query(Department).filter(
            Department.id == election.department_id,
            Department.institution_id == election.institution_id
        ).first()

        if department is None:
            return {"error": "Invalid department selected"}


    if election.batch_id is not None:
        batch = db.query(Batch).filter(
            Batch.id == election.batch_id,
            Batch.institution_id == election.institution_id
        ).first()

        if batch is None:
            return {"error": "Invalid batch selected"}


    if election.section_id is not None:
        section = db.query(Section).filter(
            Section.id == election.section_id,
            Section.institution_id == election.institution_id,
            Section.department_id == election.department_id,
            Section.batch_id == election.batch_id
        ).first()

        if section is None:
            return {"error": "Invalid section selected"}

    new_election = Election(
        title=election.title,
        description=election.description,
        election_type=election.election_type,
        start_datetime=election.start_datetime,
        end_datetime=election.end_datetime,
        institution_id=election.institution_id,
        department_id=election.department_id,
        batch_id=election.batch_id,
        section_id=election.section_id,
        created_by=current_admin["user_id"]
    )

    db.add(new_election)
    db.commit()
    db.refresh(new_election)

    return{
        "message": "Election created successfully",
        "election": new_election
    }


@router.put("/{election_id}/open")
def open_election_route(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    election = db.query(Election).filter(Election.id == election_id).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    open_election(election)

    db.commit()
    db.refresh(election)

    return {
        "message": "Election opened successfully",
        "election_id": election.id,
        "status": election.status
    }


@router.put("/{election_id}/close")
def close_election_route(
    election_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(require_admin)
):
    election = db.query(Election).filter(Election.id == election_id).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    close_election(election)

    db.commit()
    db.refresh(election)

    return {
        "message": "Election closed successfully",
        "election_id": election.id,
        "status": election.status
    }