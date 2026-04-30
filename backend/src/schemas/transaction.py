from pydantic import BaseModel
from typing import Literal
from uuid import UUID


TransactionType = Literal["income", "expense"]


class TransactionBase(BaseModel):
    description: str
    amount: float
    type: TransactionType
    category: str
    date: str  # ISO 8601: "2025-01-02"


class CreateTransactionInput(TransactionBase):
    pass


class UpdateTransactionInput(BaseModel):
    description: str | None = None
    amount: float | None = None
    type: TransactionType | None = None
    category: str | None = None
    date: str | None = None


class Transaction(TransactionBase):
    id: str
