import uuid
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.group import GroupCreateSchema, GroupUpdateSchema, GroupSchema
from app.services.group_service import GroupService

router = APIRouter()


def _ok(data: Any, message: str = "success") -> dict[str, Any]:
    return {"data": data, "message": message, "error": None}


@router.post("", response_model=dict)
async def create_group(
    payload: GroupCreateSchema,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    result = service.create(payload, current_user)
    return _ok(result)


@router.get("", response_model=dict)
async def list_groups(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    result = service.list_for_user(current_user)
    return _ok(result)


@router.get("/{group_id}", response_model=dict)
async def get_group(
    group_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    result = service.get(group_id, current_user)
    return _ok(result)


@router.patch("/{group_id}", response_model=dict)
async def update_group(
    group_id: uuid.UUID,
    payload: GroupUpdateSchema,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    result = service.update(group_id, payload, current_user)
    return _ok(result)


@router.delete("/{group_id}", response_model=dict)
async def delete_group(
    group_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    service.delete(group_id, current_user)
    return _ok(None, "deleted")


@router.post("/{group_id}/members/{user_id}", response_model=dict)
async def add_member(
    group_id: uuid.UUID,
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = GroupService(db)
    result = service.add_member(group_id, user_id, current_user)
    return _ok(result)
