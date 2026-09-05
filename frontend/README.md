# Valore — Frontend

Interface web desenvolvida com **React 19 + TypeScript**, com design system próprio (Warm Moss Finance) e suporte completo a dark/light mode.

---

## Stack

| Tecnologia               | Uso                       |
| ------------------------ | ------------------------- |
| React 19 + TypeScript    | UI e tipagem              |
| Vite                     | Build e dev server        |
| React Router v6          | Navegação SPA             |
| Axios                    | Requisições HTTP          |
| Recharts                 | Gráficos financeiros      |
| Tailwind CSS + shadcn/ui | Estilização e componentes |
| Framer Motion            | Animações                 |
| next-themes              | Dark/light mode           |
| lucide-react             | Ícones                    |
| Vitest                   | Testes unitários          |

---

## Estrutura

```text
frontend/src/
├── components/
│   ├── brand/
│   │   └── Logo.tsx            # ValoreMark e ValoreLogo (SVG oficial)
│   ├── dashboard/
│   │   ├── StatCard.tsx        # Cards de resumo financeiro
│   │   ├── TrendsCard.tsx      # Comparativo mensal
│   │   ├── MonthlyChart.tsx    # Evolução mensal (linha)
│   │   ├── IncomeExpenseChart.tsx  # Receita vs Despesas (barras)
│   │   ├── CategoryChart.tsx   # Distribuição por categoria (donut)
│   │   └── TransactionItem.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx         # Navegação lateral (sempre escura)
│   │   └── Topbar.tsx          # Barra superior com avatar e tema
│   └── ui/
│       ├── CategoryPicker.tsx  # Modal de seleção de categoria com grid
│       └── [componentes shadcn]
├── context/
│   ├── UserContext.tsx
│   └── transaction/
│       └── TransactionContext.tsx
├── pages/
│   ├── Landing.tsx             # Landing page pública
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx      # Solicitação de recuperação de senha
│   ├── ResetPassword.tsx       # Redefinição de senha via token
│   ├── Dashboard.tsx
│   ├── Accounts.tsx
│   ├── Transactions.tsx
│   ├── Analytics.tsx           # Duas abas: Visão Geral e Por Mês
│   ├── Categories.tsx          # Gerenciamento de categorias
│   ├── Profile.tsx             # Perfil e exclusão de conta
│   └── Settings.tsx            # Tema, exportar CSV, moeda
├── services/
│   ├── accountService.ts
│   ├── analyticsService.ts
│   ├── categoryService.ts
│   ├── transactionService.ts
│   └── hintService.ts
├── utils/
│   └── categoryIcons.ts        # Mapeamento nome → LucideIcon
├── types/
├── lib/
│   └── api.ts                  # Axios com interceptor de 401
├── index.css                   # Design system (tokens CSS)
└── App.tsx
```

---

## Design System — Warm Moss Finance

### Paleta

| Token     | Valor     | Uso                           |
| --------- | --------- | ----------------------------- |
| moss-400  | `#4C8A6A` | Primário, ações principais    |
| moss-300  | `#8FC4A6` | Receitas (dark)               |
| gold-500  | `#C7A35A` | Saldo, item ativo da sidebar  |
| gold-400  | `#D9B36A` | Destaque financeiro (dourado) |
| error-500 | `#C94A3F` | Despesas, ações destrutivas   |
| error-300 | `#D98B7E` | Despesas (dark)               |

### Variáveis CSS Semânticas

```css
--surface-card       /* Fundo de cards */
--surface-elevated   /* Fundo de inputs e elementos elevados */
--border-subtle      /* Bordas */
--text-primary       /* Texto principal */
--text-secondary     /* Texto secundário */
--text-muted         /* Texto apagado */
```

Definidas em `:root` (light) e `.dark` no `index.css`, permitindo que todos os componentes alternem automaticamente entre os modos.

### Tipografia

- **Plus Jakarta Sans** — headings e display
- **Inter** — UI e textos
- **DM Mono** — valores financeiros

---

## Páginas e Rotas

| Rota               | Componente     | Acesso                               |
| ------------------ | -------------- | ------------------------------------ |
| `/landing`         | Landing        | Público                              |
| `/login`           | Login          | Público (redireciona se autenticado) |
| `/register`        | Register       | Público (redireciona se autenticado) |
| `/forgot-password` | ForgotPassword | Público                              |
| `/reset-password`  | ResetPassword  | Público                              |
| `/`                | Dashboard      | Protegido                            |
| `/accounts`        | Accounts       | Protegido                            |
| `/transactions`    | Transactions   | Protegido                            |
| `/analytics`       | Analytics      | Protegido                            |
| `/categories`      | Categories     | Protegido                            |
| `/profile`         | Profile        | Protegido                            |
| `/settings`        | Settings       | Protegido                            |

---

## Arquitetura

**API client** — instância Axios em `lib/api.ts` com `baseURL="/api"` (proxy Vercel para o backend Heroku) e `withCredentials: true` para envio automático do cookie de autenticação.

**Contextos** — `UserProvider` verifica sessão via `GET /auth/me` ao carregar a aplicação. `TransactionProvider` carrega transações do usuário autenticado e expõe funções de CRUD, incluindo operações em grupo (parcelas, transferências).

**Rotas protegidas** — `ProtectedRoute` redireciona para `/landing` se não autenticado. `PublicRoute` redireciona para `/` se já autenticado.

---

## Funcionalidades de UX

### CategoryPicker

Componente de seleção de categoria com modal centralizado, grid 4 colunas, cada chip com cor e ícone da categoria. Suporte a hover com borda colorida (apenas desktop via `@media (hover: hover)`).

### Interceptor de Autenticação

`api.ts` intercepta respostas 401 e redireciona para `/landing`, exceto em rotas públicas (evita loops de redirecionamento).

### Exportar CSV

Na página de Configurações, o usuário pode exportar todas as transações ou filtrar por período. O arquivo usa separador `;` e encoding `utf-8-sig` para compatibilidade com Excel no Windows.

### Analytics em Abas

A página de Análises tem duas abas:

- **Visão Geral** — resumo anual com seletor de ano, evolução mensal, ranking de categorias, recorrentes e compromissos futuros
- **Por Mês** — detalhamento mensal com seletor de mês/ano, cards com variação vs mês anterior, ranking mensal e comparação entre dois meses

---

## Variáveis de Ambiente

O frontend não usa variáveis de ambiente diretamente — as requisições são feitas via proxy configurado no `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://valore-api-...herokuapp.com/:path*"
    }
  ]
}
```

---

## Testes

```bash
cd frontend
npm run test:run   # executa uma vez
npm run test       # modo watch
```

25 testes cobrindo formatação de transações, camada de serviços e o contexto de transações.

---

## Como Executar

```bash
npm install
npm run dev
```

O app fica disponível em <http://localhost:5173>.

Em desenvolvimento, o Axios aponta para `http://localhost:8000` via variável de ambiente. Crie `.env.local` se necessário:

```env
VITE_API_URL=http://localhost:8000
```
