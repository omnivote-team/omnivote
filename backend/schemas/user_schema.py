from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    student_id: str
    institution_id: int
    department_id: int
    batch_id: int
    section_id: int
    password: str
    confirm_password: str
    


class UserLogin(BaseModel):
    identifier: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    student_id: str
    institution_id: int
    department_id: int
    batch_id: int
    section_id: int

    class Config:
        from_attributes = True