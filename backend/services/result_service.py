from fastapi import HTTPException

from models.vote_model import Vote
from models.candidate_model import Candidate
from models.result_model import Result
from models.election_model import Election

def generate_results_for_election(db, election):
    if election.status != "closed":
        raise HTTPException(
            status_code=400,
            detail="Election must be closed before generating results"
        )

    candidates = db.query(Candidate).filter(
        Candidate.election_id == election.id
    ).all()

    if not candidates:
        raise HTTPException(
            status_code=400,
            detail="No candidates found for this election"
        )

    db.query(Result).filter(
        Result.election_id == election.id
    ).delete()

    vote_counts = {}

    for candidate in candidates:
        count = db.query(Vote).filter(
            Vote.election_id == election.id,
            Vote.candidate_id == candidate.id
        ).count()

        vote_counts[candidate.id] = count

    max_votes = max(vote_counts.values())

    for candidate in candidates:
        result = Result(
            election_id=election.id,
            candidate_id=candidate.id,
            vote_count=vote_counts[candidate.id],
            is_winner=vote_counts[candidate.id] == max_votes
        )
        db.add(result)

    return True

def publish_results_for_election(election):
    if election.status != "closed":
        raise HTTPException(
            status_code=400,
            detail="Election must be closed before publishing results"
        )

    election.results_published = True

    return True


def check_results_visible(election):
    if not election.results_published:
        raise HTTPException(
            status_code=403,
            detail="Results have not been published yet"
        )

    return True

from models.election_model import Election


def generate_results_service(db, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    generate_results_for_election(db, election)

    db.commit()

    return db.query(Result).filter(
        Result.election_id == election_id
    ).all()


def publish_results_service(db, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    publish_results_for_election(election)

    db.commit()
    db.refresh(election)

    return {
        "message": "Results published successfully",
        "election_id": election.id,
        "results_published": election.results_published
    }


def view_published_results_service(db, election_id: int):
    election = db.query(Election).filter(
        Election.id == election_id
    ).first()

    if election is None:
        raise HTTPException(status_code=404, detail="Election not found")

    check_results_visible(election)

    return db.query(Result).filter(
        Result.election_id == election_id
    ).all()