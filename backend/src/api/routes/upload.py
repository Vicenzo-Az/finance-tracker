from fastapi import APIRouter, UploadFile, File
from io import BytesIO
import pandas as pd

from src.services.processing import load_and_process_data
from src.pipelines.summary import resumo_financeiro, saldo_final

from src.schemas.finance import UploadResponse

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
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
