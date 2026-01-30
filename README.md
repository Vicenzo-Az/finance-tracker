# Backend – Finance Tracker

Backend do projeto **Finance Tracker**, responsável pelo processamento, validação e análise de dados financeiros a partir de arquivos CSV, expondo os resultados por meio de uma API REST.

---

## 🧠 Visão Geral

Este backend recebe dados financeiros estruturados (CSV), realiza uma **pipeline de tratamento de dados** e disponibiliza análises como:

- classificação de transações
- resumo financeiro
- saldo final

O foco do projeto é **qualidade de dados**, organização de código e boas práticas de backend.

---

## 🛠 Tecnologias Utilizadas

- **Python**
- **Pandas** – processamento e limpeza de dados
- **FastAPI** – API REST
- **Pytest** – testes automatizados
- **Uvicorn** – servidor ASGI

---

## 📁 Estrutura do Projeto

```text
backend/
│
├── src/
│   ├── api/            # Endpoints FastAPI
│   ├── validation/     # Validações de dados
│   ├── processing/     # Limpeza e transformação
│   ├── summary/        # Funções de análise
│   └── main.py
│
├── tests/              # Testes automatizados
├── data/               # CSV de exemplo
├── requirements.txt
└── README.md
```

---

## 🔄 Pipeline de Processamento

A pipeline de dados segue as seguintes etapas:

1. **Validação de colunas obrigatórias**
2. **Conversão e validação de datas**
3. **Limpeza da coluna de valores (`amount`)**
4. **Classificação das transações**
   - `income` → valores ≥ 0
   - `expense` → valores < 0
5. **Geração de resumos e saldo final**

Cada etapa é isolada em funções reutilizáveis.

---

## 🚀 Endpoints Disponíveis

### `GET /summary`

Retorna o resumo financeiro por tipo de transação.

**Resposta:**

```json
{
  "income": 3500.0,
  "expense": -1200.0
}
```

---

### `GET /balance`

Retorna o saldo final calculado a partir das transações.

**Resposta:**

```json
{
  "balance": 2300.0
}
```

---

## ▶️ Como Executar o Backend

### 1️⃣ Criar e ativar o ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 2️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

### 3️⃣ Rodar a API

```bash
uvicorn src.api.app:app --reload
```

A API estará disponível em:

```md
[http://127.0.0.1:8000](http://127.0.0.1:8000)
```

Swagger:

```md
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
```

---

## 🧪 Testes Automatizados

Para rodar os testes:

```bash
pytest
```

Os testes cobrem:

- validação de dados
- limpeza de colunas
- classificação de transações
- geração de resumos

---

## 🔮 Próximos Passos

- Upload de CSV via frontend
- Persistência de dados
- Autenticação de usuários
- Novas análises financeiras
- Integração com frontend em React + TypeScript

---

## 📌 Observações

Este backend foi desenvolvido com foco em **aprendizado**, **clareza de código** e **boas práticas**, sendo facilmente extensível para novas funcionalidades.
