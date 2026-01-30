import pandas as pd
import pytest

from src.validation import validate_columns


def test_validate_columns_missing():
    # cria um DataFrame SEM a coluna 'description'
    df = pd.DataFrame({
        "date": ["2024-01-01"],
        "amount": [100]
    })

    # esperamos que a função levante um erro
    with pytest.raises(ValueError):
        validate_columns(df)
