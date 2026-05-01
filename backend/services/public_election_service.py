from sqlalchemy.orm import Session
from models.election_model import Election
from models.institution_model import Institution


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
            "status": election.status,
            "start_datetime": election.start_datetime,
            "end_datetime": election.end_datetime,
            "institution_id": election.institution_id,
            "institution_name": institution_name,
        })

    return result