from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from models.election_model import Election
from models.institution_model import Institution
from models.department_model import Department
from models.batch_model import Batch
from models.section_model import Section
from models.candidate_model import Candidate
from models.candidate_application_model import CandidateApplication
from models.vote_model import Vote
from models.result_model import Result
from models.user_model import User
from sqlalchemy import or_, and_
from services.election_status_service import (
    compute_status,
    sync_election_status
)
from services.result_service import generate_results_for_election

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

def get_or_create_institution(
    db: Session,
    institution_id,
    new_name
):
    if institution_id is not None:
        institution = db.query(Institution).filter(
            Institution.id == institution_id
        ).first()

        if institution is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid institution selected"
            )

        return institution.id

    if not new_name:
        raise HTTPException(
            status_code=400,
            detail="Institution is required"
        )

    institution = db.query(Institution).filter(
        Institution.name == new_name
    ).first()

    if institution:
        return institution.id

    institution = Institution(name=new_name)

    db.add(institution)

    db.flush()

    return institution.id

def get_or_create_department(
    db: Session,
    department_id,
    new_name,
    institution_id
):
    if department_id is not None:
        department = db.query(Department).filter(
            Department.id == department_id,
            Department.institution_id == institution_id
        ).first()

        if department is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid department selected"
            )

        return department.id

    if not new_name:
        return None

    department = db.query(Department).filter(
        Department.name == new_name,
        Department.institution_id == institution_id
    ).first()

    if department:
        return department.id

    department = Department(
        name=new_name,
        institution_id=institution_id
    )

    db.add(department)
    db.flush()

    return department.id

def create_election_service(db: Session, election, admin_id: int):
    institution_id = get_or_create_institution(
        db=db,
        institution_id=election.institution_id,
        new_name=election.new_institution_name
    )

    department_id = get_or_create_department(
        db=db,
        department_id=election.department_id,
        new_name=election.new_department_name,
        institution_id=institution_id
    )

    batch_id = get_or_create_batch(
        db=db,
        batch_id=election.batch_id,
        new_name=election.new_batch_name,
        institution_id=institution_id
    )

    section_id = get_or_create_section(
        db=db,
        section_id=election.section_id,
        new_name=election.new_section_name,
        institution_id=institution_id,
        department_id=department_id,
        batch_id=batch_id
    )

    new_election = Election(
        title=election.title,
        description=election.description,
        election_type=election.election_type,
        status=compute_status(election.start_datetime, election.end_datetime),
        start_datetime=election.start_datetime,
        end_datetime=election.end_datetime,
        institution_id=institution_id,
        department_id=department_id,
        batch_id=batch_id,
        section_id=section_id,
        created_by=admin_id
    )

    db.add(new_election)
    db.commit()
    db.refresh(new_election)

    return {
        "message": "Election created successfully",
        "election": new_election
    }

def get_or_create_batch(
    db: Session,
    batch_id,
    new_name,
    institution_id
):
    if batch_id is not None:
        batch = db.query(Batch).filter(
            Batch.id == batch_id,
            Batch.institution_id == institution_id
        ).first()

        if batch is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid batch selected"
            )

        return batch.id

    if not new_name:
        return None

    batch = db.query(Batch).filter(
        Batch.name == new_name,
        Batch.institution_id == institution_id
    ).first()

    if batch:
        return batch.id

    batch = Batch(
        name=new_name,
        institution_id=institution_id
    )

    db.add(batch)
    db.flush()

    return batch.id

def get_or_create_section(
    db: Session,
    section_id,
    new_name,
    institution_id,
    department_id,
    batch_id
):
    if section_id is not None:
        section = db.query(Section).filter(
            Section.id == section_id,
            Section.institution_id == institution_id,
            Section.department_id == department_id,
            Section.batch_id == batch_id
        ).first()

        if section is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid section selected"
            )

        return section.id

    if not new_name:
        return None

    if department_id is None or batch_id is None:
        raise HTTPException(
            status_code=400,
            detail="Department and batch are required before adding a section"
        )

    section = db.query(Section).filter(
        Section.name == new_name,
        Section.institution_id == institution_id,
        Section.department_id == department_id,
        Section.batch_id == batch_id
    ).first()

    if section:
        return section.id

    section = Section(
        name=new_name,
        institution_id=institution_id,
        department_id=department_id,
        batch_id=batch_id
    )

    db.add(section)
    db.flush()

    return section.id

def get_admin_election_details_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )
    sync_election_status(db, election)
    if election.status == "closed":
        existing_results = db.query(Result).filter(
            Result.election_id == election.id
        ).first()

        if existing_results is None:
            generate_results_for_election(db, election)

        election.results_published = True

    db.commit()
    db.refresh(election)
    institution = None
    department = None
    batch = None
    section = None

    if election.institution_id:
        institution = db.query(Institution).filter(
            Institution.id == election.institution_id
        ).first()

    if election.department_id:
        department = db.query(Department).filter(
            Department.id == election.department_id
        ).first()

    if election.batch_id:
        batch = db.query(Batch).filter(
            Batch.id == election.batch_id
        ).first()

    if election.section_id:
        section = db.query(Section).filter(
            Section.id == election.section_id
        ).first()

    candidate_rows = (
    db.query(Candidate, User)
    .join(User, Candidate.user_id == User.id)
    .filter(Candidate.election_id == election_id)
    .all()
)

    candidates = []

    for candidate, user in candidate_rows:
        candidates.append({
            "id": candidate.id,
            "election_id": candidate.election_id,
            "user_id": candidate.user_id,
            "application_id": candidate.application_id,
            "candidate_name": user.full_name
        })

        applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).all()

    result_rows = (
    db.query(Result, Candidate, User)
    .join(Candidate, Result.candidate_id == Candidate.id)
    .join(User, Candidate.user_id == User.id)
    .filter(Result.election_id == election_id)
    .all()
)

    results = []

    for election_result, candidate, user in result_rows:
        results.append({
            "id": election_result.id,
            "election_id": election_result.election_id,
            "candidate_id": election_result.candidate_id,
            "candidate_name": user.full_name,
            "vote_count": election_result.vote_count,
            "is_winner": election_result.is_winner
        })

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
        "total_applications": len(applications),
        "institution_name": institution.name if institution else None,
        "department_name": department.name if department else None,
        "batch_name": batch.name if batch else None,
        "section_name": section.name if section else None,
    }

def get_admin_election_list_service(db: Session):
    elections = db.query(Election).all()

    result = []

    for election in elections:
        election.status = compute_status(
            election.start_datetime,
            election.end_datetime
        )

        result.append({
            "id": election.id,
            "title": election.title,
            "status": election.status
        })

    db.commit()

    return result

def delete_election_service(db: Session, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    sync_election_status(db, election)

    if election.status != "upcoming":
            raise HTTPException(
                status_code=400,
                detail="Only upcoming elections can be deleted"
            )

    # delete related records first

    db.query(Vote).filter(
        Vote.election_id == election_id
    ).delete()

    db.query(Result).filter(
        Result.election_id == election_id
    ).delete()

    db.query(Candidate).filter(
        Candidate.election_id == election_id
    ).delete()

    db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).delete()

    db.delete(election)

    db.commit()

    return {
        "message": "Election deleted successfully"
    }

def update_election_service(db: Session, election_id: int, election_data):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )

    sync_election_status(db, election)

    if election.status != "upcoming":
        raise HTTPException(
            status_code=400,
            detail="Only upcoming elections can be edited"
        )

    institution_id = get_or_create_institution(
        db=db,
        institution_id=election_data.institution_id,
        new_name=election_data.new_institution_name
    )

    department_id = get_or_create_department(
        db=db,
        department_id=election_data.department_id,
        new_name=election_data.new_department_name,
        institution_id=institution_id
    )

    batch_id = get_or_create_batch(
        db=db,
        batch_id=election_data.batch_id,
        new_name=election_data.new_batch_name,
        institution_id=institution_id
    )

    section_id = get_or_create_section(
        db=db,
        section_id=election_data.section_id,
        new_name=election_data.new_section_name,
        institution_id=institution_id,
        department_id=department_id,
        batch_id=batch_id
    )

    election.title = election_data.title
    election.description = election_data.description
    election.election_type = election_data.election_type
    election.start_datetime = election_data.start_datetime
    election.end_datetime = election_data.end_datetime
    election.institution_id = institution_id
    election.department_id = department_id
    election.batch_id = batch_id
    election.section_id = section_id

    applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id
    ).all()

    deleted_applications_count = 0
    deleted_candidates_count = 0

    for application in applications:

        user = db.query(User).filter(
            User.id == application.user_id
        ).first()

        if user is None or not user_matches_election_eligibility(user, election):

            candidates = db.query(Candidate).filter(
                or_(
                    Candidate.application_id == application.id,
                    and_(
                        Candidate.election_id == election_id,
                        Candidate.user_id == application.user_id
                    )
                )
            ).all()

            for candidate in candidates:
                db.delete(candidate)
                deleted_candidates_count += 1

            db.flush()

            db.delete(application)
            deleted_applications_count += 1

    db.commit()
    db.refresh(election)

    return {
        "message": "Election updated successfully",
        "election_id": election.id,
        "deleted_applications_count": deleted_applications_count,
        "deleted_candidates_count": deleted_candidates_count
    }
def user_matches_election_eligibility(user, election):
    if election.institution_id is not None:
        if user.institution_id != election.institution_id:
            return False

    if election.department_id is not None:
        if user.department_id != election.department_id:
            return False

    if election.batch_id is not None:
        if user.batch_id != election.batch_id:
            return False

    if election.section_id is not None:
        if user.section_id != election.section_id:
            return False

    return True