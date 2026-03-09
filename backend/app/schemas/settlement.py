import uuid
from datetime import datetime

from pydantic import BaseModel


class SettlementCreateSchema(BaseModel):
    group_id: uuid.UUID
    to_user_id: uuid.UUID
    amount_cents: int  # Always cents — never floats
    currency: str
    notes: str | None = None


class SettlementSchema(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    from_user_id: uuid.UUID
    to_user_id: uuid.UUID
    amount_cents: int
    currency: str
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
