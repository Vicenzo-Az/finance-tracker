from pydantic import BaseModel


class Summary(BaseModel):
    income: float
    expense: float


class UploadResponse(BaseModel):
    summary: Summary
    balance: float
