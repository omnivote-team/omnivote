from sqlalchemy.orm import Session
from models.election_model import Election
from models.institution_model import Institution
from services.election_status_service import compute_status,sync_election_status


def get_public_elections_service(db: Session):
    elections = (
        db.query(Election, Institution.name.label("institution_name"))
        .join(Institution, Election.institution_id == Institution.id)
        .all()
    )

    result = []

    for election, institution_name in elections:
        result.append({
            "id": election.id,
            "title": election.title,
            "election_type": election.election_type,
            "status": sync_election_status(db, election).status,
            "start_datetime": election.start_datetime,
            "end_datetime": election.end_datetime,
            "institution_id": election.institution_id,
            "institution_name": institution_name,
        })

    return result