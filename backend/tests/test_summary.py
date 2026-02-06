import pandas as pd

from src.services.processing import resumo_financeiro, saldo_final


def test_resumo_financeiro():
    df = pd.DataFrame({
        "Valor": [100.0, -50.0, 200.0, -30.0],
        "transaction_type": ["income", "expense", "income", "expense"]
    })

    resumo = resumo_financeiro(df)

    assert resumo["income"] == 300
    assert resumo["expense"] == -80


def test_saldo_final():
    df = pd.DataFrame({
        "Valor": [100.0, -50.0, 200.0, -30.0]
    })

    saldo = saldo_final(df)

    assert saldo == 220
