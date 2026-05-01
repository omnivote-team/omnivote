from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.election_model import Election
from models.institution_model import Institution
from models.department_model import Department
from models.batch_model import Batch
from models.section_model import Section
from models.candidate_model import Candidate
from models.candidate_application_model import CandidateApplication
from models.vote_model import Vote
from models.result_model import Result

from services.election_status_service import open_election, close_election


def validate_election_references(db: Session, election):
    institution = db.query(Institution).filter(
        Institution.id == election.institution_id
    ).first()

    if institution is None:
        raise HTTPException(status_code=400, detail="Invalid institution selected")

    if election.department_id is not None:
        department = db.query(Department).filter(
            Department.id == election.department_id,
            Department.institution_id == election.institution_id
        ).first()

        if department is None:
            raise HTTPException(status_code=400, detail="Invalid department selected")

    if election.batch_id is not None:
        batch = db.query(Batch).filter(
            Batch.id == election.batch_id,
            Batch.institution_id == election.institution_id
        ).first()

        if batch is None:
            raise HTTPException(status_code=400, detail="Invalid batch selected")

    if election.section_id is not None:
        section = db.query(Section).filter(
            Section.id == election.section_id,
            Section.institution_id == election.institution_id,
            Section.department_id == election.department_id,
            Section.batch_id == election.batch_id
        ).first()

        if section is None:
            raise HTTPException(status_code=400, detail="Invalid section selected")


def create_election_service(db: Session, election, admin_id: int):
    validate_election_references(db, election)

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
        created_by=admin_id
    )

    db.add(new_election)
    db.commit()
    db.refresh(new_election)

    return {
        "message": "Election created successfully",
        "election": new_election
    }

def get_admin_election_details_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    candidates = db.query(Candidate).filter(
        Candidate.election_id == election_id
    ).all()

    applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).all()

    results = db.query(Result).filter(
        Result.election_id == election_id
    ).all()

    total_votes = db.query(Vote).filter(
        Vote.election_id == election_id
    ).count()

    return {
        "id": election.id,
        "title": election.title,
        "description": election.description,
        "election_type": election.election_type,
        "status": election.status,
        "results_published": election.results_published,
        "start_datetime": election.start_datetime,
        "end_datetime": election.end_datetime,
        "institution_id": election.institution_id,
        "department_id": election.department_id,
        "batch_id": election.batch_id,
        "section_id": election.section_id,
        "created_by": election.created_by,
        "candidates": candidates,
        "applications": applications,
        "results": results,
        "total_votes": total_votes,
        "total_candidates": len(candidates),
        "total_applications": len(applications)
    }


from services.election_status_service import open_election, close_election


def open_election_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

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


def close_election_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

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