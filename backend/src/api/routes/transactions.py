from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.transaction import Transaction as TransactionModel
from src.models.user import User
from src.schemas.transaction import (
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[Transaction])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == current_user.id)
        .all()
    )


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = (
        db.query(TransactionModel)
        .filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id,
        )
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return transaction


@router.post("/", response_model=Transaction, status_code=201)
def create_transaction(
    input: CreateTransactionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = TransactionModel(
        id=str(uuid4()),
        user_id=current_user.id,
        **input.model_dump(),
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=Transaction)
def update_transaction(
    transaction_id: str,
    input: UpdateTransactionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = (
        db.query(TransactionModel)
        .filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id,
        )
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    for field, value in input.model_dump(exclude_none=True).items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = (
        db.query(TransactionModel)
        .filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id,
        )
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(transaction)
    db.commit()
