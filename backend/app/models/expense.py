import uuid
from sqlalchemy import String, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class ExpenseModel(Base, TimestampMixin):
    __tablename__ = "expenses"

    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id"), nullable=False
    )
    paid_by_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    # Amount stored in cents (smallest currency unit) — never floats
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    receipt_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    group: Mapped["GroupModel"] = relationship(back_populates="expenses")  # type: ignore[name-defined]  # noqa: F821
    paid_by: Mapped["UserModel"] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="expenses_paid", foreign_keys=[paid_by_id]
    )
    splits: Mapped[list["SplitModel"]] = relationship(
        back_populates="expense", cascade="all, delete-orphan"
    )


class SplitModel(Base, TimestampMixin):
    __tablename__ = "splits"

    expense_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("expenses.id"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    # Share stored in cents — never floats
    share_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    is_settled: Mapped[bool] = mapped_column(default=False, nullable=False)

    expense: Mapped[ExpenseModel] = relationship(back_populates="splits")
