from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.user import UserCreateSchema, GuestCreateSchema, UserLoginSchema, TokenSchema, UserSchema
from app.services.auth_service import AuthService

router = APIRouter()


def _ok(data: Any, message: str = "success") -> dict[str, Any]:
    return {"data": data, "message": message, "error": None}


@router.post("/register", response_model=dict)
async def register(payload: UserCreateSchema, db: Session = Depends(get_db)) -> dict[str, Any]:
    service = AuthService(db)
    result = service.register(payload)
    return _ok(result)


@router.post("/guest", response_model=dict)
async def create_guest(payload: GuestCreateSchema, db: Session = Depends(get_db)) -> dict[str, Any]:
    service = AuthService(db)
    result = service.create_guest(payload)
    return _ok(result)


@router.post("/login", response_model=dict)
async def login(payload: UserLoginSchema, db: Session = Depends(get_db)) -> dict[str, Any]:
    service = AuthService(db)
    result = service.login(payload)
    return _ok(result)


@router.get("/me", response_model=dict)
async def me(current_user: UserModel = Depends(get_current_user)) -> dict[str, Any]:
    return _ok(UserSchema.model_validate(current_user))
