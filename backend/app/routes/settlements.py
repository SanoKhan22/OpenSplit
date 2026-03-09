import uuid
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.settlement import SettlementCreateSchema
from app.services.settlement_service import SettlementService

router = APIRouter()


def _ok(data: Any, message: str = "success") -> dict[str, Any]:
    return {"data": data, "message": message, "error": None}


@router.post("", response_model=dict)
async def create_settlement(
    payload: SettlementCreateSchema,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = SettlementService(db)
    result = service.create(payload, current_user)
    return _ok(result)


@router.get("/group/{group_id}", response_model=dict)
async def list_settlements(
    group_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = SettlementService(db)
    result = service.list_for_group(group_id, current_user)
    return _ok(result)


@router.get("/group/{group_id}/balances", response_model=dict)
async def get_balances(
    group_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    """Calculate minimum transfers needed to settle all debts in the group."""
    service = SettlementService(db)
    result = service.calculate_balances(group_id, current_user)
    return _ok(result)
