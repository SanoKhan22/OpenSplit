import uuid
from collections import defaultdict
from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.expense import ExpenseModel, SplitModel
from app.models.group import GroupMemberModel
from app.models.settlement import SettlementModel
from app.models.user import UserModel
from app.schemas.settlement import SettlementCreateSchema, SettlementSchema


class SettlementService:
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

    def create(self, payload: SettlementCreateSchema, user: UserModel) -> SettlementSchema:
        self._assert_member(payload.group_id, user)
        settlement = SettlementModel(
            group_id=payload.group_id,
            from_user_id=user.id,
            to_user_id=payload.to_user_id,
            amount_cents=payload.amount_cents,
            currency=payload.currency,
            notes=payload.notes,
        )
        self.db.add(settlement)
        self.db.commit()
        self.db.refresh(settlement)
        return SettlementSchema.model_validate(settlement)

    def list_for_group(self, group_id: uuid.UUID, user: UserModel) -> list[SettlementSchema]:
        self._assert_member(group_id, user)
        settlements = self.db.query(SettlementModel).filter(
            SettlementModel.group_id == group_id,
            SettlementModel.deleted_at.is_(None),
        ).all()
        return [SettlementSchema.model_validate(s) for s in settlements]

    def calculate_balances(self, group_id: uuid.UUID, user: UserModel) -> list[dict]:
        """
        Minimum transfers algorithm:
        1. Compute net balance per user (positive = owed money, negative = owes money)
        2. Greedily match creditors with debtors to minimize transactions
        All amounts in cents.
        """
        self._assert_member(group_id, user)

        # Collect all unsettled splits
        expenses = self.db.query(ExpenseModel).filter(
            ExpenseModel.group_id == group_id,
            ExpenseModel.deleted_at.is_(None),
        ).all()

        net: dict[uuid.UUID, int] = defaultdict(int)  # cents

        for expense in expenses:
            net[expense.paid_by_id] += expense.amount_cents
            for split in expense.splits:
                if not split.is_settled:
                    net[split.user_id] -= split.share_cents

        # Subtract settled payments
        settlements = self.db.query(SettlementModel).filter(
            SettlementModel.group_id == group_id,
            SettlementModel.deleted_at.is_(None),
        ).all()
        for s in settlements:
            net[s.from_user_id] += s.amount_cents
            net[s.to_user_id] -= s.amount_cents

        creditors = sorted(
            [(uid, bal) for uid, bal in net.items() if bal > 0],
            key=lambda x: -x[1],
        )
        debtors = sorted(
            [(uid, -bal) for uid, bal in net.items() if bal < 0],
            key=lambda x: -x[1],
        )

        transfers = []
        i, j = 0, 0
        while i < len(creditors) and j < len(debtors):
            cred_id, cred_amt = creditors[i]
            debt_id, debt_amt = debtors[j]
            amount = min(cred_amt, debt_amt)
            transfers.append({"from_user_id": str(debt_id), "to_user_id": str(cred_id), "amount_cents": amount})
            creditors[i] = (cred_id, cred_amt - amount)
            debtors[j] = (debt_id, debt_amt - amount)
            if creditors[i][1] == 0:
                i += 1
            if debtors[j][1] == 0:
                j += 1

        return transfers
