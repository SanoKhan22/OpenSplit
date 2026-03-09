import uuid
from typing import Any

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.expense import ExpenseCreateSchema, ExpenseSchema
from app.services.expense_service import ExpenseService

router = APIRouter()


def _ok(data: Any, message: str = "success") -> dict[str, Any]:
    return {"data": data, "message": message, "error": None}


@router.post("", response_model=dict)
async def create_expense(
    payload: ExpenseCreateSchema,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = ExpenseService(db)
    result = service.create(payload, current_user)
    return _ok(result)


@router.get("/group/{group_id}", response_model=dict)
async def list_expenses(
    group_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = ExpenseService(db)
    result = service.list_for_group(group_id, current_user)
    return _ok(result)


@router.get("/{expense_id}", response_model=dict)
async def get_expense(
    expense_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = ExpenseService(db)
    result = service.get(expense_id, current_user)
    return _ok(result)


@router.delete("/{expense_id}", response_model=dict)
async def delete_expense(
    expense_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    service = ExpenseService(db)
    service.delete(expense_id, current_user)
    return _ok(None, "deleted")


@router.post("/scan-receipt", response_model=dict)
async def scan_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    """Upload a receipt image — queues async OCR + LLM extraction job."""
    from app.tasks.receipt_tasks import process_receipt_task

    contents = await file.read()
    task = process_receipt_task.delay(contents, str(current_user.id))
    return _ok({"job_id": task.id}, "receipt queued for processing")


@router.get("/jobs/{job_id}", response_model=dict)
async def get_job_status(job_id: str) -> dict[str, Any]:
    from app.tasks.celery_app import celery_app

    task = celery_app.AsyncResult(job_id)
    return _ok({"job_id": job_id, "status": task.status, "result": task.result})
