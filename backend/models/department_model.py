from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)