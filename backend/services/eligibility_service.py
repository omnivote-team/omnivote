from fastapi import HTTPException


def check_user_election_eligibility(user, election):
    if election.institution_id != user.institution_id:
        raise HTTPException(
            status_code=403,
            detail="You are not eligible for this election institution"
        )

    if election.department_id is not None and election.department_id != user.department_id:
        raise HTTPException(
            status_code=403,
            detail="You are not eligible for this election department"
        )

    if election.batch_id is not None and election.batch_id != user.batch_id:
        raise HTTPException(
            status_code=403,
            detail="You are not eligible for this election batch"
        )

    if election.section_id is not None and election.section_id != user.section_id:
        raise HTTPException(
            status_code=403,
            detail="You are not eligible for this election section"
        )

    return True