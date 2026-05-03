from datetime import datetime
from zoneinfo import ZoneInfo


def compute_status(start_datetime, end_datetime) -> str:
    now = datetime.now(ZoneInfo("Asia/Karachi")).replace(tzinfo=None)

    if now < start_datetime:
        return "upcoming"

    if now >= start_datetime and now <= end_datetime:
        return "open"

    return "closed"


def sync_election_status(db, election):
    election.status = compute_status(
        election.start_datetime,
        election.end_datetime
    )

    db.commit()
    db.refresh(election)

    return election