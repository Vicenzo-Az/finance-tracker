import pandas as pd
import numpy as np

# Função para classificar transações


def transaction_type(df: pd.DataFrame, column: str) -> pd.DataFrame:
    df["transaction_type"] = np.where(
        df[column] >= 0, "income", "expense")
    return df
