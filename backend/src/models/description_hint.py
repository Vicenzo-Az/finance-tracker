from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import Mapped, relationship

from src.core.database import Base


class DescriptionHint(Base):
    __tablename__ = "description_hints"

    id: Mapped[str] = Column(String, primary_key=True)
    description: Mapped[str] = Column(String, nullable=False)
    category_id: Mapped[str] = Column(
        String, ForeignKey("categories.id"), nullable=False)
    user_id: Mapped[str] = Column(
        String, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="description_hints")
    category = relationship("Category")
