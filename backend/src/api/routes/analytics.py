from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import pandas as pd

from src.core.database import get_db
from src.core.dependencies import get_current_user
from src.models.transaction import Transaction as TransactionModel
from src.models.category import Category as CategoryModel
from src.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _transactions_to_df(transactions: list) -> pd.DataFrame:
    """Converte lista de transações ORM para DataFrame."""
    if not transactions:
        return pd.DataFrame(columns=["id", "description", "amount", "type", "date", "category_id", "account_id"])

    data = [
        {
            "id": t.id,
            "description": t.description,
            "amount": t.amount,
            "type": t.type,
            "date": pd.to_datetime(t.date),
            "category_id": t.category_id,
            "account_id": t.account_id,
        }
        for t in transactions
    ]
    df = pd.DataFrame(data)
    df["signed_amount"] = df.apply(
        lambda r: r["amount"] if r["type"] == "income" else -r["amount"], axis=1
    )
    return df


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Resumo geral: total de receitas, despesas, saldo e patrimônio."""
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == current_user.id)
        .all()
    )
    df = _transactions_to_df(transactions)

    if df.empty:
        return {"income": 0, "expense": 0, "balance": 0, "transaction_count": 0}

    income = round(float(df[df["type"] == "income"]["amount"].sum()), 2)
    expense = round(float(df[df["type"] == "expense"]["amount"].sum()), 2)

    return {
        "income": income,
        "expense": expense,
        "balance": round(income - expense, 2),
        "transaction_count": len(df),
    }


@router.get("/monthly")
def get_monthly(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    year: Optional[int] = Query(default=None, description="Filtrar por ano"),
):
    """Receitas e despesas agrupadas por mês."""
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == current_user.id)
        .all()
    )
    df = _transactions_to_df(transactions)

    if df.empty:
        return []

    if year:
        df = df[df["date"].dt.year == year]

    df["month"] = df["date"].dt.to_period("M").astype(str)

    monthly = (
        df.groupby(["month", "type"])["amount"]
        .sum()
        .reset_index()
    )

    result: dict = {}
    for _, row in monthly.iterrows():
        month = row["month"]
        if month not in result:
            result[month] = {"month": month, "income": 0.0, "expense": 0.0}
        result[month][row["type"]] = round(float(row["amount"]), 2)

    for month in result:
        result[month]["balance"] = round(
            result[month]["income"] - result[month]["expense"], 2
        )

    return sorted(result.values(), key=lambda x: x["month"])


@router.get("/by-category")
def get_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    type: Optional[str] = Query(
        default=None, description="'income' ou 'expense'"),
):
    """Total por categoria."""
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == current_user.id)
        .all()
    )
    df = _transactions_to_df(transactions)

    if df.empty:
        return []

    if type:
        df = df[df["type"] == type]

    # Busca nomes das categorias
    category_ids = df["category_id"].dropna().unique().tolist()
    categories = (
        db.query(CategoryModel)
        .filter(CategoryModel.id.in_(category_ids))
        .all()
    ) if category_ids else []
    cat_map = {c.id: {"name": c.name, "color": c.color, "icon": c.icon}
               for c in categories}

    by_cat = (
        df.groupby("category_id")["amount"]
        .sum()
        .reset_index()
    )

    result = []
    for _, row in by_cat.iterrows():
        cat_id = row["category_id"]
        cat_info = cat_map.get(
            cat_id, {"name": "Sem categoria", "color": "#94a3b8", "icon": "tag"})
        result.append({
            "category_id": cat_id,
            "category_name": cat_info["name"],
            "category_color": cat_info["color"],
            "category_icon": cat_info["icon"],
            "total": round(float(row["amount"]), 2),
        })

    return sorted(result, key=lambda x: x["total"], reverse=True)


@router.get("/trends")
def get_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Comparativo mês atual vs mês anterior."""
    transactions = (
        db.query(TransactionModel)
        .filter(TransactionModel.user_id == current_user.id)
        .all()
    )
    df = _transactions_to_df(transactions)

    if df.empty:
        return {"current_month": {}, "previous_month": {}, "variation": {}}

    now = pd.Timestamp.now()
    current_month = df[
        (df["date"].dt.year == now.year) & (df["date"].dt.month == now.month)
    ]
    prev = now - pd.DateOffset(months=1)
    previous_month = df[
        (df["date"].dt.year == prev.year) & (df["date"].dt.month == prev.month)
    ]

    def summarize(frame: pd.DataFrame) -> dict:
        if frame.empty:
            return {"income": 0.0, "expense": 0.0, "balance": 0.0}
        income = round(
            float(frame[frame["type"] == "income"]["amount"].sum()), 2)
        expense = round(
            float(frame[frame["type"] == "expense"]["amount"].sum()), 2)
        return {"income": income, "expense": expense, "balance": round(income - expense, 2)}

    current = summarize(current_month)
    previous = summarize(previous_month)

    def variation(curr: float, prev: float) -> float | None:
        if prev == 0:
            return None
        return round(((curr - prev) / prev) * 100, 1)

    return {
        "current_month": current,
        "previous_month": previous,
        "variation": {
            "income": variation(current["income"], previous["income"]),
            "expense": variation(current["expense"], previous["expense"]),
            "balance": variation(current["balance"], previous["balance"]),
        },
    }
