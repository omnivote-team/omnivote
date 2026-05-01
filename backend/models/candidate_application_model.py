from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from database import Base


class CandidateApplication(Base):
    __tablename__ = "candidate_applications"
    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    manifesto = Column(Text, nullable=True)
    status = Column(String, default="pending")
    __table_args__ = (
        UniqueConstraint("election_id", "user_id", name="unique_user_application_per_election"),
    )