# Finance Tracker - Backend

API do **Finance Tracker** construída com **FastAPI** para dois fluxos principais:

- importação e processamento de extratos CSV
- CRUD de transações persistidas em banco

O backend recebe arquivos CSV, valida e limpa os dados, classifica as transações como income ou expense e devolve um resumo financeiro com o saldo final.

---

## Tecnologias

- Python 3.13
- FastAPI
- SQLAlchemy
- Pandas
- Pydantic
- Alembic
- Pytest
- Uvicorn

---

## Estrutura

```text
backend/
├── src/
│   ├── api/
│   │   ├── app.py
│   │   └── routes/
│   │       ├── transactions.py
│   │       └── upload.py
│   ├── core/
│   ├── models/
│   ├── pipelines/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── alembic/
├── tests/
├── requirements.txt
└── README.md
```

---

## Fluxo de Dados CSV

1. Upload do arquivo via `POST /upload`
2. Validação das colunas obrigatórias
3. Conversão da coluna de data para formato datetime
4. Limpeza da coluna de valores
5. Classificação automática por sinal do valor
6. Geração do resumo e do saldo final

O modelo atual de CSV espera as colunas `Data`, `Descrição` e `Valor`.

Transações com valor maior ou igual a zero são classificadas como `income`; valores negativos são classificados como `expense`.

---

## Endpoints

### `POST /upload`

Recebe um arquivo CSV em `multipart/form-data` e retorna o resumo financeiro processado.

Exemplo de resposta:

```json
{
  "summary": {
    "income": 6900.75,
    "expense": -480.8
  },
  "balance": 6419.95
}
```

Se o arquivo for inválido ou não atender ao modelo esperado, o backend retorna erro `400`.

### `GET /transactions`

Lista todas as transações salvas no banco.

### `GET /transactions/{transaction_id}`

Busca uma transação específica pelo ID.

### `POST /transactions`

Cria uma nova transação.

### `PUT /transactions/{transaction_id}`

Atualiza uma transação existente.

### `DELETE /transactions/{transaction_id}`

Remove uma transação.

---

## Configuração

O backend lê a variável `DATABASE_URL` a partir de um arquivo `.env`.

Exemplo:

```env
DATABASE_URL=sqlite:///./finance.db
```

Se você usar migrações, aplique-as antes de iniciar a aplicação.

---

## Como Executar

### 1. Criar e ativar o ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar o banco

Crie o arquivo `.env` na pasta `backend/` com a variável `DATABASE_URL` apontando para o seu banco.

### 4. Rodar as migrações, se necessário

```bash
alembic upgrade head
```

### 5. Iniciar a API

```bash
uvicorn src.main:app --reload
```

A documentação interativa fica disponível em:

- Swagger: <http://127.0.0.1:8000/docs>
- OpenAPI: <http://127.0.0.1:8000/redoc>

---

## Testes

```bash
pytest
```

Os testes cobrem validação, limpeza, processamento e cálculo do resumo financeiro.

---

## Observações

- A camada HTTP está separada dos pipelines de negócio
- O CORS já está configurado para o consumo pelo frontend
- O backend pode evoluir para autenticação, histórico de uploads e novas análises
