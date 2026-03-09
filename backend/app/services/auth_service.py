from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.dependencies import create_access_token, create_refresh_token
from app.models.user import UserModel
from app.schemas.user import UserCreateSchema, GuestCreateSchema, UserLoginSchema, TokenSchema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def register(self, payload: UserCreateSchema) -> TokenSchema:
        existing = self.db.query(UserModel).filter(UserModel.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = UserModel(
            email=payload.email,
            display_name=payload.display_name,
            hashed_password=pwd_context.hash(payload.password),
            is_guest=False,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return TokenSchema(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    def create_guest(self, payload: GuestCreateSchema) -> TokenSchema:
        user = UserModel(
            display_name=payload.display_name or "Guest",
            is_guest=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return TokenSchema(
            access_token=create_access_token(user.id, is_guest=True),
        )

    def login(self, payload: UserLoginSchema) -> TokenSchema:
        user = self.db.query(UserModel).filter(
            UserModel.email == payload.email,
            UserModel.deleted_at.is_(None),
        ).first()

        if not user or not user.hashed_password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not pwd_context.verify(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        return TokenSchema(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )
