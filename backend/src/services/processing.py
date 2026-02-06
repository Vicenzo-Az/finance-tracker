import pandas as pd

from src.pipelines.validation import validate_columns
from src.pipelines.cleaning import convert_to_datetime, limpar_amount
from src.pipelines.processing import transaction_type


def load_and_process_data(df: pd.DataFrame) -> pd.DataFrame:
    validate_columns(df)
    df = convert_to_datetime(df, "Data")
    df = limpar_amount(df, "Valor")
    df = transaction_type(df, "Valor")

    return df
