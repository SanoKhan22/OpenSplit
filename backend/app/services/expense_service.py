import uuid
from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.expense import ExpenseModel, SplitModel
from app.models.group import GroupMemberModel
from app.models.user import UserModel
from app.schemas.expense import ExpenseCreateSchema, ExpenseSchema


class ExpenseService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _assert_member(self, group_id: uuid.UUID, user: UserModel) -> None:
        member = self.db.query(GroupMemberModel).filter(
            GroupMemberModel.group_id == group_id,
            GroupMemberModel.user_id == user.id,
            GroupMemberModel.deleted_at.is_(None),
        ).first()
        if not member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a group member")

    def create(self, payload: ExpenseCreateSchema, user: UserModel) -> ExpenseSchema:
        self._assert_member(payload.group_id, user)

        total_splits = sum(s.share_cents for s in payload.splits)
        if total_splits != payload.amount_cents:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Split amounts ({total_splits}) must equal expense amount ({payload.amount_cents})",
            )

        expense = ExpenseModel(
            group_id=payload.group_id,
            paid_by_id=user.id,
            title=payload.title,
            amount_cents=payload.amount_cents,
            currency=payload.currency,
            category=payload.category,
            notes=payload.notes,
        )
        self.db.add(expense)
        self.db.flush()

        for split_in in payload.splits:
            split = SplitModel(
                expense_id=expense.id,
                user_id=split_in.user_id,
                share_cents=split_in.share_cents,
            )
            self.db.add(split)

        self.db.commit()
        self.db.refresh(expense)
        return ExpenseSchema.model_validate(expense)

    def list_for_group(self, group_id: uuid.UUID, user: UserModel) -> list[ExpenseSchema]:
        self._assert_member(group_id, user)
        expenses = self.db.query(ExpenseModel).filter(
            ExpenseModel.group_id == group_id,
            ExpenseModel.deleted_at.is_(None),
        ).all()
        return [ExpenseSchema.model_validate(e) for e in expenses]

    def get(self, expense_id: uuid.UUID, user: UserModel) -> ExpenseSchema:
        expense = self.db.query(ExpenseModel).filter(
            ExpenseModel.id == expense_id,
            ExpenseModel.deleted_at.is_(None),
        ).first()
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        self._assert_member(expense.group_id, user)
        return ExpenseSchema.model_validate(expense)

    def delete(self, expense_id: uuid.UUID, user: UserModel) -> None:
        expense = self.db.query(ExpenseModel).filter(
            ExpenseModel.id == expense_id,
            ExpenseModel.deleted_at.is_(None),
        ).first()
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        self._assert_member(expense.group_id, user)
        expense.deleted_at = datetime.now(UTC)
        self.db.commit()
