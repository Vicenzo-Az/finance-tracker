# Finance Tracker

Aplicação **fullstack** para gestão financeira com um backend FastAPI e uma interface React.

O projeto combina dois fluxos principais:

- gerenciamento manual de transações no frontend
- processamento de extratos CSV e cálculo de resumo financeiro no backend

---

## Estrutura

```text
finance-tracker/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── alembic/
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   └── README.md
└── README.md
```

---

## Tecnologias

### Backend

- Python 3.13
- FastAPI
- SQLAlchemy
- Pandas
- Pydantic
- Alembic
- Pytest

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- React Router
- Recharts
- Tailwind CSS

---

## Como Funciona

1. O backend expõe uma API para CRUD de transações e importação de CSV
2. O frontend carrega as transações da API e apresenta o dashboard
3. O usuário pode criar, editar e excluir transações pela interface
4. O endpoint de upload processa extratos CSV e devolve resumo e saldo

---

## Como Executar

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Crie o arquivo `.env` com a variável `DATABASE_URL`, aplique as migrações se necessário e inicie a API com:

```bash
uvicorn src.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Se quiser apontar para outra API, configure `VITE_API_URL` no frontend.

---

## APIs Principais

### Backend

- `POST /upload` - processa um CSV e retorna resumo financeiro
- `GET /transactions` - lista transações
- `GET /transactions/{transaction_id}` - busca uma transação
- `POST /transactions` - cria uma transação
- `PUT /transactions/{transaction_id}` - atualiza uma transação
- `DELETE /transactions/{transaction_id}` - remove uma transação

### Frontend

- `/` - dashboard
- `/transactions` - gerenciamento de transações
- `/profile` - perfil
- `/settings` - configurações

---

## Testes

```bash
cd backend
pytest
```

---

## Observações

- O monorepo mantém frontend e backend desacoplados, mas prontos para integração local
- A documentação detalhada de cada app está nos READMEs internos
