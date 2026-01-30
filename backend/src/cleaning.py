import pandas as pd

# Função para converter coluna de datas


def convert_to_datetime(df: pd.DataFrame, column: str) -> pd.DataFrame:
    df[column] = pd.to_datetime(df[column], errors="coerce")
    df = df.dropna(subset=[column])
    return df

# Função para limpar coluna de valores monetários


def limpar_amount(df: pd.DataFrame, column: str) -> pd.DataFrame:
    df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna(subset=[column])
    return df
