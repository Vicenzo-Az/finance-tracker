from fastapi import APIRouter, UploadFile, File, HTTPException
from io import BytesIO
import pandas as pd

from src.services.processing import load_and_process_data
from src.pipelines.summary import resumo_financeiro, saldo_final
from src.pipelines.validation import ValidationError
from src.schemas.finance import UploadResponse
from src.schemas.error import ErrorResponse

router = APIRouter()


@router.post(
    "/upload",
    response_model=UploadResponse,
    responses={
        400: {"model": ErrorResponse, "description": "CSV inválido"},
        422: {"model": ErrorResponse, "description": "Erro de validação"},
    },
)
def upload_csv(file: UploadFile = File(...)):
    try:
        with file.file as f:
            df = pd.read_csv(BytesIO(f.read()))

        df = load_and_process_data(df)

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=400, detail="Arquivo CSV inválido")

    summary = resumo_financeiro(df)
    balance = round(saldo_final(df), 2)

    return {
        "summary": summary,
        "balance": balance
    }
