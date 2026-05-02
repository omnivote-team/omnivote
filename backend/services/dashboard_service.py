from models.election_model import Election
from models.vote_model import Vote
from models.candidate_model import Candidate
from models.candidate_application_model import CandidateApplication
from fastapi import HTTPException
from services.election_service import compute_status

def get_admin_dashboard_summary(db):
    elections = db.query(Election).all()

    total_elections = len(elections)

    ongoing_elections = 0

    for election in elections:
        status = compute_status(
            election.start_datetime,
            election.end_datetime
        )

        if status == "open":
            ongoing_elections += 1

    pending_applications = db.query(CandidateApplication).filter(
        CandidateApplication.status == "pending"
    ).count()

    return {
        "total_elections": total_elections,
        "ongoing_elections": ongoing_elections,
        "pending_applications": pending_applications
    }


def get_election_dashboard_summary(db, election_id):
    election = db.query(Election).filter(Election.id == election_id).first()

    if election is None:
        raise HTTPException(
            status_code=404,
            detail="Election not found"
        )
    
    total_votes = db.query(Vote).filter(
        Vote.election_id == election_id
    ).count()

    total_candidates = db.query(Candidate).filter(
        Candidate.election_id == election_id
    ).count()

    pending_applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id,
        CandidateApplication.status == "pending"
    ).count()

    approved_applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id,
        CandidateApplication.status == "approved"
    ).count()

    rejected_applications = db.query(CandidateApplication).filter(
        CandidateApplication.election_id == election_id,
        CandidateApplication.status == "rejected"
    ).count()

    return {
        "election_id": election_id,
        "total_votes": total_votes,
        "total_candidates": total_candidates,
        "pending_applications": pending_applications,
        "approved_applications": approved_applications,
        "rejected_applications": rejected_applications
    }