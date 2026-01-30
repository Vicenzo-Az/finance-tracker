import pandas as pd

from src.summary import resumo_financeiro, saldo_final


def test_resumo_financeiro():
    df = pd.DataFrame({
        "amount": [100.0, -50.0, 200.0, -30.0],
        "transaction_type": ["income", "expense", "income", "expense"]
    })

    resumo = resumo_financeiro(df)

    # transforma em alfo fácil de comparar
    resumo_dict = dict(zip(resumo["transaction_type"], resumo["amount"]))

    assert resumo_dict["income"] == 300
    assert resumo_dict["expense"] == -80


def test_saldo_final():
    df = pd.DataFrame({
        "amount": [100.0, -50.0, 200.0, -30.0]
    })

    saldo = saldo_final(df)

    assert saldo == 220
