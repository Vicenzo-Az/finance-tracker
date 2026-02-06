import pandas as pd

from src.pipelines.cleaning import convert_to_datetime, limpar_amount


def test_convert_to_datetime_remove_datas_invalidas():
    df = pd.DataFrame({
        "Data": ["2024-01-01", "invalid-date"],
        "Valor": [100, 200]
    })

    result = convert_to_datetime(df, "Data")

    assert len(result) == 1
    assert result.iloc[0]["Data"].year == 2024


def test_limpar_amount():
    df = pd.DataFrame({
        "Data": ["2009-11-11", "2012-11-11", "2013-11-11"],
        "Valor": [120, -120, "abc"]
    })

    result = limpar_amount(df, "Valor")

    # a linha com "abc" deve ser removida
    assert len(result) == 2

    # todos os valores restantes devem ser numéricos
    assert result["Valor"].dtype.kind in "fi"
