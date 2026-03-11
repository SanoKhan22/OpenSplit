import uuid
from datetime import datetime

from pydantic import BaseModel


class GroupCreateSchema(BaseModel):
    name: str
    description: str | None = None
    currency: str = "USD"


class GroupUpdateSchema(BaseModel):
    name: str | None = None
    description: str | None = None


class GroupJoinSchema(BaseModel):
    invite_code: str


class GroupSchema(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    currency: str
    invite_code: str
    created_by_id: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class GroupMemberSchema(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    user_id: uuid.UUID
    is_admin: bool
    nickname: str | None

    model_config = {"from_attributes": True}
