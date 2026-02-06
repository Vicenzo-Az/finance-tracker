from fastapi import FastAPI
from src.api.routes.upload import router as upload_router
from src.core.cors import setup_cors


def create_app() -> FastAPI:
    app = FastAPI()

    setup_cors(app)

    app.include_router(upload_router)

    return app


# setup_cors(app)


# @app.get("/summary")
# def get_summary():
#     df = load_and_process_data("data/data.csv")
#     resumo = resumo_financeiro(df)
#     return resumo.to_dict(orient="records")


# @app.get("/balance")
# def get_balance():
#     df = load_and_process_data("data/data.csv")
#     return {"balance": round(saldo_final(df), 2)}
