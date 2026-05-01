from fastapi import HTTPException

def require_authenticated_user(user):
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    return True
def can_view_full_election(user):
    require_authenticated_user(user)
    return True

def can_apply_as_candidate(user, election):
    require_authenticated_user(user)

    if election.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="Cannot apply to a closed election"
        )

    return True

def can_vote(user, election):
    require_authenticated_user(user)

    if election.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Election is not open for voting"
        )

    return True

def can_view_results(election):
    if not election.results_published:
        raise HTTPException(
            status_code=403,
            deta8il="Results are not published yet"
        )

    return True