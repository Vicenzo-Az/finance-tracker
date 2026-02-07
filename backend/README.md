# Finance Tracker — Backend

Backend do **Finance Tracker**, uma API construída com **FastAPI** para processamento e análise de extratos financeiros enviados via CSV.

O sistema recebe um arquivo CSV, valida e processa os dados e retorna um **resumo financeiro** contendo receitas, despesas e saldo final.

---

## 🚀 Tecnologias

- Python 3.13
- FastAPI
- Pandas
- Pydantic
- Pytest
- Uvicorn

---

## 📂 Estrutura do Projeto

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   └── upload.py
│   │   └── app.py
│   │
│   ├── pipelines/
│   │   ├── cleaning.py
│   │   ├── processing.py
│   │   ├── summary.py
│   │   └── validation.py
│   │
│   ├── schemas/
│   │   ├── finance.py
│   │   └── error.py
│   │
│   ├── services/
│   │   └── processing.py
│   │
│   └── main.py
│
├── tests/
│   ├── test_services.py
│   └── test_pipelines.py
│
├── requirements.txt
└── README.md
```

### Organização

- **api/**: camada HTTP (rotas, middlewares, app)
- **pipelines/**: regras de negócio e processamento de dados
- **services/**: orquestração dos pipelines
- **schemas/**: contratos da API (Pydantic)
- **tests/**: testes unitários e de integração

---

## 🔁 Fluxo de Processamento

1. Upload do CSV via endpoint `/upload`
2. Validação das colunas obrigatórias
3. Limpeza e conversão de dados
4. Classificação das transações (income / expense)
5. Geração do resumo financeiro
6. Retorno do resultado para o frontend

---

## 📡 Endpoint

### `POST /upload`

Recebe um arquivo CSV e retorna o resumo financeiro.

#### Request

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: arquivo `.csv`

#### Response — 200 OK

```json
{
  "summary": {
    "income": 6900.75,
    "expense": -480.8
  },
  "balance": 6419.95
}
```

#### Response — 400 Bad Request

```json
{
  "detail": "CSV inválido. Colunas obrigatórias ausentes: {'Valor'}"
}
```

---

## 🧾 Validações

- CSV deve conter colunas obrigatórias (modelo atual: NuBank)
- Valores são convertidos para numérico
- Transações são classificadas automaticamente
- Erros de domínio retornam **HTTP 400**
- Erros de schema são tratados automaticamente pelo FastAPI (**422**)

---

## 🧪 Testes

Execute todos os testes com:

```bash
pytest
```

Cobertura inclui:

- validação de dados
- pipelines de processamento
- cálculo de resumo e saldo

---

## ▶️ Executando o Projeto

### Criar ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Rodar o servidor

```bash
uvicorn src.api.app:app --reload
```

Acesse:

- API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📌 Observações

- O backend foi estruturado seguindo boas práticas de mercado
- Pipelines são independentes da camada HTTP
- Pronto para futuras extensões:
  - autenticação
  - persistência em banco
  - novos tipos de análise
  - visualização completa do DataFrame processado

---

## 📄 Licença

Projeto educacional / portfólio.
