# Finance Tracker

Aplicação **fullstack** para análise de extratos financeiros a partir de arquivos CSV.

O projeto permite que o usuário envie um CSV pelo frontend e receba um **resumo financeiro automático**, contendo:

- receitas
- despesas
- saldo final

Arquitetura pensada para **extensão futura**, mantendo separação clara entre frontend e backend.

---

## 🧱 Estrutura do Projeto

```text
finance-tracker/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── README.md
│
└── README.md
```

- **backend/** → API FastAPI (processamento e análise)
- **frontend/** → Interface React (upload e visualização)
- **README.md** → visão geral do projeto (este arquivo)

---

## ⚙️ Tecnologias

### Backend

- Python 3.13
- FastAPI
- Pandas
- Pydantic
- Pytest

### Frontend

- React + TypeScript
- Vite
- Fetch API
- HTML / CSS

---

## 🔁 Fluxo da Aplicação

1. Usuário seleciona um arquivo CSV no frontend
2. Frontend envia o arquivo para a API (`POST /upload`)
3. Backend valida e processa os dados
4. Backend retorna:
   - resumo financeiro
   - saldo final

5. Frontend exibe os resultados

---

## 📡 API (Resumo)

### `POST /upload`

Recebe um CSV e retorna o resumo financeiro.

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

Documentação completa disponível via Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## ▶️ Como Executar

### 1️⃣ Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.api.app:app --reload
```

Backend disponível em:

```text
http://127.0.0.1:8000
```

---

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

## 🧪 Testes

### Backend - Pytest

```bash
cd backend
pytest
```

---

## 🧩 Decisões de Arquitetura

- Monorepo para facilitar desenvolvimento local
- Backend desacoplado do frontend
- Pipelines de processamento independentes da API
- Validações separadas por responsabilidade
- API preparada para futuras extensões:
  - autenticação
  - persistência em banco
  - novas análises financeiras
  - visualização completa do DataFrame processado

---

## 🚧 Roadmap (Futuro)

- Autenticação de usuário
- Histórico de uploads
- Visualização detalhada das transações
- Suporte a múltiplos modelos de CSV
- Deploy (Docker / Cloud)

---

## 📄 Licença

Projeto educacional / portfólio.

---

### ⭐ Observação Final

Este projeto foi desenvolvido com foco em:

- boas práticas
- organização de código
- clareza arquitetural
- escalabilidade
