from fastapi import HTTPException
from models.vote_model import Vote
from models.candidate_model import Candidate
from models.result_model import Result


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