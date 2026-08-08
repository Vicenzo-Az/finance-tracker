from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from src.api.routes.upload import router as upload_router
from src.api.routes.transactions import router as transactions_router
from src.api.routes.auth import router as auth_router
from src.api.routes.categories import router as categories_router
from src.api.routes.accounts import router as accounts_router
from src.api.routes.analytics import router as analytics_router
from src.api.routes.hints import router as hints_router
from src.api.routes.password_reset import router as password_reset_router
from src.core.cors import setup_cors


def create_app() -> FastAPI:
    app = FastAPI(title="Valore API", version="1.0.0")

    setup_cors(app)

    app.include_router(auth_router)
    app.include_router(transactions_router)
    app.include_router(hints_router)
    app.include_router(categories_router)
    app.include_router(accounts_router)
    app.include_router(analytics_router)
    app.include_router(upload_router)
    app.include_router(password_reset_router)

    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        schema = get_openapi(
            title=app.title,
            version=app.version,
            routes=app.routes,
        )
        schema["components"]["securitySchemes"] = {
            "cookieAuth": {
                "type": "apiKey",
                "in": "cookie",
                "name": "access_token",
            }
        }
        for path in schema["paths"].values():
            for operation in path.values():
                operation["security"] = [{"cookieAuth": []}]
        app.openapi_schema = schema
        return schema

    app.openapi = custom_openapi

    return app
