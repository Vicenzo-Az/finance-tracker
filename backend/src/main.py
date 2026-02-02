import pandas as pd

from validation import validate_columns
from cleaning import convert_to_datetime, limpar_amount
from processing import transaction_type
from summary import resumo_financeiro, saldo_final


def main():
    df = pd.read_csv("backend/data/data.csv")

    validate_columns(df)
    df = convert_to_datetime(df, "date")
    df = limpar_amount(df, "amount")
    df = transaction_type(df, "amount")

    resumo = resumo_financeiro(df)
    saldo = saldo_final(df)

    # print df head
    print(df.head(10))

    # print financial summary
    print("\nResumo Financeiro:")
    print(resumo)

    # print final balance with 2 decimal places
    print(f"\nSaldo final: {saldo:.2f}")


if __name__ == "__main__":
    main()
