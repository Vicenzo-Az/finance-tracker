import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.core.database import Base, get_db
from src.core.config import settings
from src.main import app

# URL do banco de testes
TEST_DATABASE_URL = settings.database_url.replace(
    "/finance_tracker", "/valore_test"
).replace(
    "postgres://", "postgresql://"
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Cria todas as tabelas antes dos testes e remove depois."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def clean_tables():
    """Limpa todas as tabelas entre cada teste para garantir isolamento."""
    yield
    db = TestingSessionLocal()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="module")
def client():
    return TestClient(app, raise_server_exceptions=True)


@pytest.fixture
def auth_client(client):
    """Client já autenticado com um usuário de teste."""
    client.post("/auth/register", json={
        "name": "Teste",
        "email": "teste@valore.com",
        "password": "senha123456",
    })
    client.post("/auth/login", json={
        "email": "teste@valore.com",
        "password": "senha123456",
    })
    return client


@pytest.fixture
def auth_client2(client):
    """Segundo usuário autenticado para testes de isolamento."""
    client.post("/auth/register", json={
        "name": "Outro",
        "email": "outro@valore.com",
        "password": "senha123456",
    })
    client.post("/auth/login", json={
        "email": "outro@valore.com",
        "password": "senha123456",
    })
    return client
