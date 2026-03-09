from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class UserModel(Base, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    display_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_guest: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    supabase_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)

    # Relationships
    group_memberships: Mapped[list["GroupMemberModel"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="user", cascade="all, delete-orphan"
    )
    expenses_paid: Mapped[list["ExpenseModel"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="paid_by", foreign_keys="ExpenseModel.paid_by_id"
    )
