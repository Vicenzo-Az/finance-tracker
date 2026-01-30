import pandas as pd


# Função para validar colunas obrigatórias


def validate_columns(df: pd.DataFrame) -> None:
    REQUIRED_COLUMNS = {"date", "description", "amount"}

    missing = REQUIRED_COLUMNS - set(df.columns)

    if missing:
        raise ValueError(
            f"CSV inválido. Colunas obrigatórias ausentes: {missing}"
        )
