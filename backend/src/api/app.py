from fastapi import FastAPI, UploadFile, File
from src.api.middlewares.cors import setup_cors
import pandas as pd
from io import BytesIO
from src.services.processing import (
    load_and_process_data,
    resumo_financeiro,
    saldo_final
)


app = FastAPI(title="Finance Tracker API")

setup_cors(app)


@app.get("/summary")
def get_summary():
    df = load_and_process_data("data/data.csv")
    resumo = resumo_financeiro(df)
    return resumo.to_dict(orient="records")


@app.get("/balance")
def get_balance():
    df = load_and_process_data("data/data.csv")
    return {"balance": round(saldo_final(df), 2)}


@app.post("/upload")
def upload_csv(file: UploadFile = File(...)):
    conteudo = file.file.read()
    df = pd.read_csv(BytesIO(conteudo))

    df = load_and_process_data(df)

    summary = resumo_financeiro(df)
    balance = round(saldo_final(df), 2)

    return {
        "summary": summary,
        "balance": balance
    }
