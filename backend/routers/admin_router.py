from fastapi import APIRouter, Depends
from services.auth_dependency import require_admin

router = APIRouter(prefix="/admin",tags=["Admin"])

@router.get("/test")
def admin_test(current_admin=Depends(require_admin)):
    return {
        "message": "Admin route working",
        "admin": current_admin
    }