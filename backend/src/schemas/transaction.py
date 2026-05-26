from pydantic import BaseModel
from typing import Literal


TransactionType = Literal["income", "expense", "transfer"]


class TransactionBase(BaseModel):
    description: str
    amount: float
    type: TransactionType
    date: str
    category_id: str | None = None
    account_id: str | None = None
    is_recurring: bool = False


class CreateTransactionInput(TransactionBase):
    pass


class UpdateTransactionInput(BaseModel):
    description: str | None = None
    amount: float | None = None
    type: TransactionType | None = None
    date: str | None = None
    category_id: str | None = None
    account_id: str | None = None
    is_recurring: bool | None = None


class TransferInput(BaseModel):
    from_account_id: str
    to_account_id: str
    amount: float
    date: str
    description: str = "Transferência entre contas"


class Transaction(TransactionBase):
    id: str
    user_id: str
    transfer_id: str | None = None
    transfer_direction: str | None = None  # "out" | "in"

    model_config = {"from_attributes": True}


class TransactionBase(BaseModel):
    description: str
    amount: float
    type: TransactionType
    date: str
    category_id: str | None = None
    account_id: str | None = None
    is_recurring: bool = False
    is_paid: bool = True


class CreateTransactionInput(TransactionBase):
    # Campos de parcelamento — só usados quando installments > 1
    installments: int = 1


class UpdateTransactionInput(BaseModel):
    description: str | None = None
    amount: float | None = None
    type: TransactionType | None = None
    date: str | None = None
    category_id: str | None = None
    account_id: str | None = None
    is_recurring: bool | None = None
    is_paid: bool | None = None


class Transaction(TransactionBase):
    id: str
    user_id: str
    transfer_id: str | None = None
    transfer_direction: str | None = None
    installment_group_id: str | None = None
    installment_number: int | None = None
    installment_total: int | None = None

    model_config = {"from_attributes": True}
