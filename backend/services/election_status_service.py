from fastapi import HTTPException


def open_election(election):
    if election.status == "open":
        raise HTTPException(
            status_code=400,
            detail="Election is already open"
        )

    if election.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="Closed election cannot be opened again"
        )

    election.status = "open"

    return True


def close_election(election):
    if election.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="Election is already closed"
        )

    if election.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Only an open election can be closed"
        )

    election.status = "closed"

    return True