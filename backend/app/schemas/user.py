import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str
    display_name: str | None = None


class GuestCreateSchema(BaseModel):
    display_name: str | None = None


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserSchema(BaseModel):
    id: uuid.UUID
    email: str | None
    display_name: str | None
    avatar_url: str | None
    is_guest: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"
