from sqlalchemy.orm import Session
from src.models.transaction import Transaction as TransactionModel


def get_account_balance(account, db: Session) -> float:
    """
    Saldo atual = initial_balance
                + income
                - expense
                + transfer in
                - transfer out
    """
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.account_id == account.id)
        .all()
    )
    movement = 0.0
    for t in transactions:
        if t.type == "income":
            movement += t.amount
        elif t.type == "expense":
            movement -= t.amount
        elif t.type == "transfer":
            if t.transfer_direction == "in":
                movement += t.amount
            elif t.transfer_direction == "out":
                movement -= t.amount
    return round(account.initial_balance + movement, 2)
