import pandas as pd


def resumo_financeiro(df: pd.DataFrame) -> pd.DataFrame:
    resumo = (
        df.groupby("transaction_type", as_index=False)
        .agg({"amount": "sum"})
    )
    return resumo


def saldo_final(df: pd.DataFrame) -> float:
    return df["amount"].sum()
