from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from database import Base


class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    election_type = Column(String, nullable=False)
    status = Column(String, default="upcoming")
    results_published = Column(Boolean, default=False)

    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)

    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)

    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)