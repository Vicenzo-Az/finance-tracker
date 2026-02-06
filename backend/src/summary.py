import pandas as pd


def resumo_financeiro(df: pd.DataFrame) -> dict:
    resumo = (
        df.groupby("transaction_type")["Valor"]
        .sum()
        .to_dict()
    )
    return resumo


def saldo_final(df: pd.DataFrame) -> float:
    return df["Valor"].sum()
