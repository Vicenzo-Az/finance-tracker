import pandas as pd
import pytest

from src.pipelines.validation import validate_columns


def test_validate_columns_missing():
    # cria um DataFrame SEM a coluna 'description'
    df = pd.DataFrame({
        "Data": ["2024-01-01"],
        "Valor": [100]
    })

    # esperamos que a função levante um erro
    with pytest.raises(ValueError):
        validate_columns(df)
