from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from database import Base


class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("candidate_applications.id"), nullable=True)
    __table_args__ = (UniqueConstraint("election_id", "user_id", name="unique_candidate_per_election"),)