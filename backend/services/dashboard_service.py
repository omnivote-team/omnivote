from models.election_model import Election
from models.vote_model import Vote
from models.candidate_model import Candidate
from models.candidate_application_model import CandidateApplication
from fastapi import HTTPException

def get_admin_dashboard_summary(db):
    total_elections = db.query(Election).count()
    total_votes = db.query(Vote).count()
    total_candidates = db.query(Candidate).count()

    pending_applications = db.query(CandidateApplication).filter(
        CandidateApplication.status == "pending"
    ).count()

    approved_applications = db.query(CandidateApplication).filter(
        CandidateApplication.status == "approved"
    ).count()

    rejected_applications = db.query(CandidateApplication).filter(
        CandidateApplication.status == "rejected"
    ).count()

    return {
        "total_elections": total_elections,
        "total_votes": total_votes,
        "total_candidates": total_candidates,
        "pending_applications": pending_applications,
        "approved_applications": approved_applications,
        "rejected_applications": rejected_applications
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