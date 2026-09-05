# Valore — Domine suas finanças

Aplicação **fullstack** de gestão financeira pessoal desenvolvida como Trabalho de Conclusão de Curso (TCC) no Curso Superior de Tecnologia em Sistemas para Internet — IFSul.

O sistema permite registrar receitas, despesas e transferências entre contas, categorizar gastos, acompanhar parcelas de compras no crédito, visualizar análises detalhadas do histórico financeiro e exportar dados para CSV.

---

## Produção

- **Frontend:** <https://valore-finance.vercel.app>
- **Backend:** <https://valore-api-279d7c3cc379.herokuapp.com>

---

## Estrutura

```text
valore/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   └── README.md
├── Procfile
├── requirements.txt
└── README.md
```

---

## Tecnologias

### Backend

- Python 3.13
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL
- Pandas
- Pydantic v2
- python-jose (JWT)
- bcrypt
- Uvicorn

### Frontend

- React 19 + TypeScript
- Vite
- React Router v6
- Axios
- Recharts
- Tailwind CSS + shadcn/ui
- Framer Motion
- next-themes

---

## Funcionalidades

- **Autenticação** — registro, login e logout com JWT em cookie `httpOnly`; recuperação de senha via e-mail com token seguro (SHA-256, uso único, validade de 1 hora)
- **Contas financeiras** — contas de débito e crédito com saldo calculado automaticamente; exclusão com opções de manter ou deletar transações vinculadas
- **Transações** — CRUD completo com categorias, filtros por período, conta e categoria, agrupamento mensal e exportação em CSV
- **Transferências** — movimentação entre contas do mesmo usuário
- **Parcelamento** — compras parceladas em contas de crédito, com cálculo automático de valores e datas, controle de parcelas pagas/pendentes e edição individual ou em lote das parcelas restantes
- **Categorias** — categorias do sistema (somente leitura) e personalizadas pelo usuário (CRUD completo); página dedicada de gerenciamento
- **Autocomplete de categorias** — sugestão automática de categoria com base no histórico de descrições do usuário
- **Análises** — duas abas: Visão Geral (resumo anual, evolução mensal, ranking de categorias, recorrentes, compromissos futuros) e Por Mês (detalhamento mensal com comparativo vs mês anterior)
- **Exportar CSV** — exportação de transações com filtro de período, compatível com Excel
- **Perfil** — edição de nome, e-mail, senha, avatar e exclusão de conta com cascade completo
- **Responsividade** — layout adaptado para desktop, tablet e mobile

---

## Como Executar Localmente

### Pré-requisitos

- Python 3.13+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/valore
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
SMTP_USER=seu@gmail.com
SMTP_PASSWORD=senha_de_app_gmail
SMTP_FROM=Valore <seu@gmail.com>
```

Aplique as migrações e inicie a API:

```bash
alembic upgrade head
uvicorn src.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Deploy

- **Backend:** Heroku (`git push heroku main`)
- **Frontend:** Vercel (`vercel --prod` dentro de `frontend/`)
- **Banco:** Heroku Postgres (addon)

Após o deploy do backend, rode as migrações:

```bash
heroku run "cd backend && alembic upgrade head" --app valore-api
```

Variáveis de ambiente no Heroku:

```bash
heroku config:set SMTP_USER=seu@gmail.com --app valore-api
heroku config:set SMTP_PASSWORD="senha_de_app" --app valore-api
heroku config:set SMTP_FROM="Valore <seu@gmail.com>" --app valore-api
heroku config:set FRONTEND_URL=https://valore-finance.vercel.app --app valore-api
```

---

## Documentação da API

Com o backend rodando localmente:

- Swagger UI: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>

---

## Testes

### Backend (Pytest)

```bash
cd backend
pytest
```

68 testes cobrindo autenticação, isolamento entre usuários, contas (débito/crédito), transações, parcelamento, transferências e analytics. Executados em banco PostgreSQL de teste (`valore_test`), criado e limpo a cada execução.

### Frontend (Vitest)

```bash
cd frontend
npm run test:run
```

25 testes cobrindo funções utilitárias de formatação, camada de serviços (API mockada) e o contexto de transações.

**Total: 93 testes automatizados, 100% de aprovação.**
