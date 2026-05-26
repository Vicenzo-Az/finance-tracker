from sqlalchemy import Boolean, Column, Float, ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, relationship

from src.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = Column(String, primary_key=True)
    description: Mapped[str] = Column(String, nullable=False)
    amount: Mapped[float] = Column(Float, nullable=False)
    type: Mapped[str] = Column(String, nullable=False)
    date: Mapped[str] = Column(String, nullable=False)
    is_recurring: Mapped[bool] = Column(Boolean, nullable=False, default=False)
    user_id: Mapped[str] = Column(
        String, ForeignKey("users.id"), nullable=False)
    category_id: Mapped[str | None] = Column(
        String, ForeignKey("categories.id"), nullable=True)
    account_id: Mapped[str | None] = Column(
        String, ForeignKey("accounts.id"), nullable=True)
    transfer_id: Mapped[str | None] = Column(String, nullable=True)
    transfer_direction: Mapped[str | None] = Column(String, nullable=True)

    # Parcelamento
    installment_group_id: Mapped[str | None] = Column(String, nullable=True)
    installment_number: Mapped[int | None] = Column(Integer, nullable=True)
    installment_total: Mapped[int | None] = Column(Integer, nullable=True)
    is_paid: Mapped[bool] = Column(Boolean, nullable=False, default=True)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    account = relationship("Account", back_populates="transactions")
