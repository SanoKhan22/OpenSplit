import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator


class SplitInputSchema(BaseModel):
    user_id: uuid.UUID
    share_cents: int  # Always cents — never floats


class ExpenseCreateSchema(BaseModel):
    group_id: uuid.UUID
    paid_by_id: uuid.UUID | None = None  # Optional, defaults to current user
    title: str
    amount_cents: int  # Always cents — never floats
    currency: str = "USD"
    category: str | None = None
    notes: str | None = None
    splits: list[SplitInputSchema]

    @field_validator("amount_cents")
    @classmethod
    def amount_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("amount_cents must be positive")
        return v


class SplitSchema(BaseModel):
    id: uuid.UUID
    expense_id: uuid.UUID
    user_id: uuid.UUID
    share_cents: int
    is_settled: bool

    model_config = {"from_attributes": True}


class ExpenseSchema(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    paid_by_id: uuid.UUID
    title: str
    amount_cents: int
    currency: str
    category: str | None
    notes: str | None
    receipt_url: str | None
    splits: list[SplitSchema] = []
    created_at: datetime

    model_config = {"from_attributes": True}
