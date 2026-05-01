from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)