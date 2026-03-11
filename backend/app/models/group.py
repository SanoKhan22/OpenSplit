import uuid
from sqlalchemy import String, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class GroupModel(Base, TimestampMixin):
    __tablename__ = "groups"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    invite_code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    created_by_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    members: Mapped[list["GroupMemberModel"]] = relationship(
        back_populates="group", cascade="all, delete-orphan"
    )
    expenses: Mapped[list["ExpenseModel"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="group"
    )


class GroupMemberModel(Base, TimestampMixin):
    __tablename__ = "group_members"

    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    nickname: Mapped[str | None] = mapped_column(String(100), nullable=True)

    group: Mapped[GroupModel] = relationship(back_populates="members")
    user: Mapped["UserModel"] = relationship(back_populates="group_memberships")  # type: ignore[name-defined]  # noqa: F821
