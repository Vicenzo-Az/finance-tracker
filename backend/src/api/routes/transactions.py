from fastapi import APIRouter, HTTPException
from uuid import uuid4

from src.schemas.transaction import (
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])

# Armazenamento em memória (temporário — será substituído pelo banco na Fase 2)
_db: dict[str, Transaction] = {}


@router.get("/", response_model=list[Transaction])
def list_transactions():
    return list(_db.values())


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(transaction_id: str):
    transaction = _db.get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return transaction


@router.post("/", response_model=Transaction, status_code=201)
def create_transaction(input: CreateTransactionInput):
    transaction = Transaction(id=str(uuid4()), **input.model_dump())
    _db[transaction.id] = transaction
    return transaction


@router.put("/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: str, input: UpdateTransactionInput):
    transaction = _db.get(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    updated_data = transaction.model_dump()
    updated_data.update(
        {k: v for k, v in input.model_dump().items() if v is not None})

    _db[transaction_id] = Transaction(**updated_data)
    return _db[transaction_id]


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: str):
    if transaction_id not in _db:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    del _db[transaction_id]
