from sqlalchemy import Column, Integer, String
from database import Base


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)