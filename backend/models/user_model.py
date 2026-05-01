from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    student_id = Column(String, unique=True, nullable=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, default="user")