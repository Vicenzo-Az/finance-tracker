from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from uuid import uuid4

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.transaction import Transaction as TransactionModel
from src.models.account import Account as AccountModel
from src.models.user import User
from src.schemas.transaction import (
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
    TransferInput,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/", response_model=list[Transaction])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    account_id: Optional[str] = Query(default=None),
    category_id: Optional[str] = Query(default=None),
    type: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None),
):
    query = db.query(TransactionModel).filter(
        TransactionModel.user_id == current_user.id
    )
    if account_id:
        query = query.filter(TransactionModel.account_id == account_id)
    if category_id:
        query = query.filter(TransactionModel.category_id == category_id)
    if type:
        query = query.filter(TransactionModel.type == type)
    if date_from:
        query = query.filter(TransactionModel.date >= date_from)
    if date_to:
        query = query.filter(TransactionModel.date <= date_to)
    return query.order_by(TransactionModel.date.desc()).all()


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id,
    ).first()
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


@router.post("/transfer", response_model=list[Transaction], status_code=201)
def create_transfer(
    input: TransferInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from_account = db.query(AccountModel).filter(
        AccountModel.id == input.from_account_id,
        AccountModel.user_id == current_user.id,
    ).first()
    to_account = db.query(AccountModel).filter(
        AccountModel.id == input.to_account_id,
        AccountModel.user_id == current_user.id,
    ).first()

    if not from_account:
        raise HTTPException(
            status_code=404, detail="Conta de origem não encontrada")
    if not to_account:
        raise HTTPException(
            status_code=404, detail="Conta de destino não encontrada")
    if from_account.id == to_account.id:
        raise HTTPException(
            status_code=400, detail="Contas devem ser diferentes")

    transfer_id = str(uuid4())

    out = TransactionModel(
        id=str(uuid4()),
        user_id=current_user.id,
        description=input.description,
        amount=input.amount,
        type="transfer",
        date=input.date,
        account_id=input.from_account_id,
        transfer_id=transfer_id,
        transfer_direction="out",  # saída explícita
    )

    into = TransactionModel(
        id=str(uuid4()),
        user_id=current_user.id,
        description=input.description,
        amount=input.amount,
        type="transfer",
        date=input.date,
        account_id=input.to_account_id,
        transfer_id=transfer_id,
        transfer_direction="in",  # entrada explícita
    )

    db.add(out)
    db.add(into)
    db.commit()
    db.refresh(out)
    db.refresh(into)
    return [out, into]


@router.put("/{transaction_id}", response_model=Transaction)
def update_transaction(
    transaction_id: str,
    input: UpdateTransactionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id,
    ).first()
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
    transaction = db.query(TransactionModel).filter(
        TransactionModel.id == transaction_id,
        TransactionModel.user_id == current_user.id,
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    if transaction.transfer_id:
        db.query(TransactionModel).filter(
            TransactionModel.transfer_id == transaction.transfer_id
        ).delete()
    else:
        db.delete(transaction)

    db.commit()
