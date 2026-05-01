from sqlalchemy import Column, Integer, ForeignKey, Boolean
from database import Base


class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    vote_count = Column(Integer, default=0)
    is_winner = Column(Boolean, default=False)