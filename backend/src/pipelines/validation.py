import pandas as pd


# Função para validar colunas obrigatórias


class ValidationError(Exception):
    """Erro de validação de dados do CSV."""
    pass


def validate_columns(df: pd.DataFrame) -> None:
    REQUIRED_COLUMNS = {"Data", "Descrição", "Valor"}  # Modelo NuBank

    missing = REQUIRED_COLUMNS - set(df.columns)

    if missing:
        raise ValidationError(
            f"CSV inválido. Colunas obrigatórias ausentes: {missing}"
        )
