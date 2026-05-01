from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from database import Base


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)

    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("election_id", "user_id", name="unique_user_vote_per_election"),
    )