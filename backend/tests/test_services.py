# tests/test_services.py
import pandas as pd
import pytest

from src.services import load_and_process_data


def test_load_and_process_data_receives_dataframe():
    df = pd.DataFrame({
        "Data": ["2024-01-01"],
        "Valor": [100.0],
        "Descrição": ["income"]
    })

    result = load_and_process_data(df)

    assert isinstance(result, pd.DataFrame)
    assert not result.empty
