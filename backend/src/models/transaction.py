from sqlalchemy import Column, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, relationship

from src.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = Column(String, primary_key=True)
    description: Mapped[str] = Column(String, nullable=False)
    amount: Mapped[float] = Column(Float, nullable=False)
    type: Mapped[str] = Column(String, nullable=False)  # "income" | "expense"
    category: Mapped[str] = Column(String, nullable=False, default="")
    # ISO 8601: "2025-01-02"
    date: Mapped[str] = Column(String, nullable=False)
    user_id: Mapped[str] = Column(
        String, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="transactions")
