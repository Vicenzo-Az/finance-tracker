from fastapi import FastAPI
import pandas as pd

from src.services import load_and_process_data
from src.summary import resumo_financeiro, saldo_final

app = FastAPI(title="Finance Tracker API")


@app.get("/summary")
def get_summary():
    df = load_and_process_data("data/data.csv")
    resumo = resumo_financeiro(df)
    return resumo.to_dict(orient="records")


@app.get("/balance")
def get_balance():
    df = load_and_process_data("data/data.csv")
    return {"balance": round(saldo_final(df), 2)}
