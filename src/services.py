import pandas as pd

from src.validation import validate_columns
from src.cleaning import convert_to_datetime, limpar_amount
from src.processing import transaction_type


def load_and_process_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)

    validate_columns(df)
    df = convert_to_datetime(df, "date")
    df = limpar_amount(df, "amount")
    df = transaction_type(df, "amount")

    return df
