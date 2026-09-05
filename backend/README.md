# Valore — Backend

API REST desenvolvida com **FastAPI** e **PostgreSQL**, responsável por toda a lógica de negócio, autenticação e análise financeira do Valore.

---

## Stack

| Tecnologia  | Versão | Uso                 |
| ----------- | ------ | ------------------- |
| Python      | 3.13   | Linguagem principal |
| FastAPI     | latest | Framework HTTP      |
| SQLAlchemy  | 2.0+   | ORM                 |
| Alembic     | latest | Migrações de banco  |
| PostgreSQL  | 15     | Banco de dados      |
| Pydantic v2 | latest | Validação de dados  |
| python-jose | latest | JWT                 |
| bcrypt      | latest | Hash de senhas      |
| Pandas      | latest | Analytics           |
| Uvicorn     | latest | Servidor ASGI       |

---

## Estrutura

```text
backend/
├── src/
│   ├── api/
│   │   ├── app.py               # Fábrica da aplicação FastAPI
│   │   └── routes/
│   │       ├── auth.py          # Registro, login, logout, perfil, deleção de conta
│   │       ├── accounts.py      # CRUD de contas financeiras
│   │       ├── transactions.py  # CRUD, parcelamento, transferências, CSV
│   │       ├── categories.py    # CRUD de categorias
│   │       ├── analytics.py     # Resumo, mensal, por categoria, tendências, mensal-detalhe
│   │       ├── hints.py         # Autocomplete de categorias por descrição
│   │       └── password_reset.py # Recuperação de senha via Gmail SMTP
│   ├── core/
│   │   ├── config.py            # Configurações via pydantic-settings
│   │   ├── database.py          # Engine e sessão SQLAlchemy
│   │   ├── dependencies.py      # get_current_user
│   │   ├── security.py          # Hash, JWT, tokens de reset
│   │   └── cors.py              # Configuração CORS
│   ├── models/
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── category.py
│   │   ├── description_hint.py
│   │   └── password_reset_token.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   └── category.py
│   └── services/
│       └── balance.py           # Cálculo de saldo de conta
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_accounts.py
│   ├── test_transactions.py
│   └── test_analytics.py
├── alembic/
├── alembic.ini
├── requirements.txt
└── Procfile
```

---

## Como Executar

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --reload
```

Documentação interativa disponível em:

- Swagger: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>

---

## Endpoints

### Autenticação (`/auth`)

| Método | Rota                    | Descrição                                |
| ------ | ----------------------- | ---------------------------------------- |
| POST   | `/auth/register`        | Cria conta de usuário                    |
| POST   | `/auth/login`           | Autentica e retorna cookie JWT           |
| POST   | `/auth/logout`          | Invalida sessão e limpa cookie           |
| GET    | `/auth/me`              | Retorna dados do usuário autenticado     |
| PUT    | `/auth/me`              | Atualiza nome, e-mail, senha ou avatar   |
| DELETE | `/auth/me`              | Deleta conta e todos os dados em cascata |
| POST   | `/auth/forgot-password` | Envia e-mail de recuperação de senha     |
| POST   | `/auth/reset-password`  | Redefine senha com token válido          |

### Contas (`/accounts`)

| Método | Rota             | Descrição                          |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/accounts/`     | Lista contas do usuário            |
| POST   | `/accounts/`     | Cria conta (débito ou crédito)     |
| PUT    | `/accounts/{id}` | Atualiza conta                     |
| DELETE | `/accounts/{id}` | Deleta conta com opções de cascade |

### Transações (`/transactions`)

| Método | Rota                        | Descrição                                           |
| ------ | --------------------------- | --------------------------------------------------- |
| GET    | `/transactions/`            | Lista com filtros (tipo, conta, categoria, período) |
| POST   | `/transactions/`            | Cria transação simples ou parcelada                 |
| POST   | `/transactions/transfer`    | Cria transferência entre contas                     |
| PUT    | `/transactions/{id}`        | Atualiza transação (ou grupo de parcelas)           |
| DELETE | `/transactions/{id}`        | Deleta transação, grupo ou transferência            |
| DELETE | `/transactions/{id}/single` | Deleta somente esta parcela                         |
| GET    | `/transactions/export/csv`  | Exporta CSV com filtro de período opcional          |

### Categorias (`/categories`)

| Método | Rota               | Descrição                                |
| ------ | ------------------ | ---------------------------------------- |
| GET    | `/categories/`     | Lista categorias do sistema + do usuário |
| POST   | `/categories/`     | Cria categoria personalizada             |
| PUT    | `/categories/{id}` | Atualiza categoria do usuário            |
| DELETE | `/categories/{id}` | Deleta categoria do usuário              |

### Analytics (`/analytics`)

| Método | Rota                                          | Descrição                                       |
| ------ | --------------------------------------------- | ----------------------------------------------- |
| GET    | `/analytics/summary`                          | Patrimônio, receitas, despesas e saldo totais   |
| GET    | `/analytics/monthly?year=`                    | Evolução mensal (filtrável por ano)             |
| GET    | `/analytics/by-category?type=&year=`          | Gastos por categoria (filtrável por tipo e ano) |
| GET    | `/analytics/trends`                           | Comparativo mês atual vs anterior               |
| GET    | `/analytics/recurring-average?year=`          | Média mensal de despesas recorrentes            |
| GET    | `/analytics/compare-months?month_a=&month_b=` | Comparativo entre dois meses                    |
| GET    | `/analytics/future-commitments`               | Parcelas pendentes agrupadas                    |
| GET    | `/analytics/monthly-detail?month=`            | Detalhamento completo de um mês (YYYY-MM)       |

---

## Autenticação

O sistema usa **JWT em cookie `httpOnly`**, sem exposição de token no frontend. Em produção, o cookie é `secure` e `samesite=none` para funcionar com o proxy da Vercel.

### Segurança na recuperação de senha

- Token gerado com `secrets.token_urlsafe(32)`
- Armazenado como hash SHA-256 no banco (nunca em texto claro)
- Validade de 1 hora
- Uso único — invalidado após a primeira utilização
- Tokens anteriores invalidados ao solicitar novo reset
- Resposta genérica em todos os casos (previne enumeração de usuários)

---

## Banco de Dados

### Migrações

```bash
alembic upgrade head                    # aplica todas as migrações
alembic revision --autogenerate -m ""   # gera nova migração
alembic downgrade -1                    # reverte a última migração
```

### Modelos

- `users` — dados do usuário e avatar
- `accounts` — contas financeiras (débito/crédito)
- `transactions` — movimentações com suporte a parcelamento e transferências
- `categories` — categorias do sistema (`user_id = null`) e do usuário
- `description_hints` — histórico de categorias por descrição (autocomplete)
- `password_reset_tokens` — tokens de recuperação de senha com expiração

---

## Configuração

Crie `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/valore
SECRET_KEY=chave_secreta_longa
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
SMTP_USER=seu@gmail.com
SMTP_PASSWORD=senha_de_app_gmail
SMTP_FROM=Valore <seu@gmail.com>
```

---

## Testes

```bash
cd backend
pytest                    # todos os testes
pytest tests/test_auth.py # somente autenticação
pytest -v                 # verbose
```

68 testes automatizados — banco `valore_test` criado e destruído a cada execução.

---

## Execução Local

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn src.main:app --reload
```

API disponível em `http://127.0.0.1:8000`.
Swagger em `http://127.0.0.1:8000/docs`.
