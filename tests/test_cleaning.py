import pandas as pd

from src.cleaning import convert_to_datetime, limpar_amount


def test_convert_to_datetime_remove_datas_invalidas():
    df = pd.DataFrame({
        "date": ["2024-01-01", "invalid-date"],
        "amount": [100, 200]
    })

    result = convert_to_datetime(df, "date")

    assert len(result) == 1
    assert result.iloc[0]["date"].year == 2024


def test_limpar_amount():
    df = pd.DataFrame({
        "date": ["2009-11-11", "2012-11-11", "2013-11-11"],
        "amount": [120, -120, "abc"]
    })

    result = limpar_amount(df, "amount")

    # a linha com "abc" deve ser removida
    assert len(result) == 2

    # todos os valores restantes devem ser numéricos
    assert result["amount"].dtype.kind in "fi"
