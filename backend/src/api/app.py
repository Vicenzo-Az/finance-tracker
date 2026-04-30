from fastapi import FastAPI
from src.api.routes.upload import router as upload_router
from src.api.routes.transactions import router as transactions_router
from src.core.cors import setup_cors


def create_app() -> FastAPI:
    app = FastAPI()

    setup_cors(app)

    app.include_router(upload_router)
    app.include_router(transactions_router)

    return app
