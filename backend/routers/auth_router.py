from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from schemas.user_schema import UserSignup, UserLogin
from models.user_model import User
from services.password_service import hash_password, verify_password
from models.institution_model import Institution
from models.department_model import Department
from models.batch_model import Batch
from models.section_model import Section
from services.token_service import create_access_token
from services.auth_dependency import get_current_user_data
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):

    if user.password != user.confirm_password:
        return {"error": "Passwords do not match"}
    
    institution = db.query(Institution).filter( Institution.id == user.institution_id).first()
    
    if institution is None:
        return {"error": "Invalid institution selected"}
    
    department = db.query(Department).filter(Department.id == user.department_id,Department.institution_id == user.institution_id).first()
    if department is None:
        return {"error": "Invalid department selected"}
    
    batch = db.query(Batch).filter(Batch.id == user.batch_id,Batch.institution_id == user.institution_id).first()
    if batch is None:
        return {"error": "Invalid batch selected"}
    
    section = db.query(Section).filter(Section.id == user.section_id,Section.institution_id == user.institution_id,Section.department_id == user.department_id,Section.batch_id == user.batch_id).first()
    if section is None:
        return {"error": "Invalid section selected"}
    
    existing_email = db.query(User).filter( User.email == user.email).first()
    if existing_email is not None:
        return {"error": "Email already exists"}

    existing_student = db.query(User).filter(User.student_id == user.student_id).first()
    if existing_student is not None:
        return {"error": "Student ID already exists"}

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        student_id=user.student_id,
        institution_id=user.institution_id,
        password=hash_password(user.password),
        department_id=user.department_id,
        batch_id=user.batch_id,
        section_id=user.section_id,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "student_id": new_user.student_id,
            "institution_id": new_user.institution_id,
            "department_id": new_user.department_id,
            "batch_id": new_user.batch_id,
            "section_id": new_user.section_id,
            "role": new_user.role
        }
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        or_(
            User.email == user.identifier,
            User.student_id == user.identifier
        )
    ).first()

    if existing_user is None:
        return {"error": "Invalid email/student ID or password"}

    if not verify_password(user.password, existing_user.password):
        return {"error": "Invalid email/student ID or password"}
    access_token = create_access_token(data={"user_id": existing_user.id,"role": existing_user.role})
    
    return {
    "message": "Login successful",
    "user": {
        "id": existing_user.id,
        "full_name": existing_user.full_name,
        "email": existing_user.email,
        "student_id": existing_user.student_id,
        "institution_id": existing_user.institution_id,
        "department_id": existing_user.department_id,
        "batch_id": existing_user.batch_id,
        "section_id": existing_user.section_id,
        "access_token": access_token,
        "token_type": "bearer",
        "role": existing_user.role
    }
    }

@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        or_(
            User.email == form_data.username,
            User.student_id == form_data.username
        )
    ).first()

    if existing_user is None:
        return {"error": "Invalid email/student ID or password"}

    if not verify_password(form_data.password, existing_user.password):
        return {"error": "Invalid email/student ID or password"}

    access_token = create_access_token(
        data={
            "user_id": existing_user.id,
            "role": existing_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user=Depends(get_current_user_data)):
    return {"message": "Token is valid", "current_user": current_user}