# MyBudgets — Frontend

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)

Interface web do sistema MyBudgets desenvolvida com React 18, TypeScript e Vite.

---

## Tecnologias

- **React 18** — biblioteca de UI
- **TypeScript 5** — tipagem estática com modo strict
- **Vite** — bundler e dev server
- **React Router 6** — roteamento client-side
- **TanStack Query** — gerenciamento de server state, cache e deduplicação de requests
- **Zustand** — gerenciamento de state global (auth)
- **React Hook Form** — formulários performáticos
- **Tailwind CSS 4** — utility-first CSS
- **Recharts** — gráficos (linha, barras, pizza)
- **Lucide React** — biblioteca de ícones
- **date-fns** — manipulação de datas
- **react-number-format** — máscara de moeda

## Arquitetura

O projeto segue uma arquitetura **feature-based**, com cada domínio do negócio agrupando seus próprios componentes, hooks, services e tipos:

```
features/<domínio>/
  ├── components/   → componentes específicos da feature
  ├── hooks/        → hooks com TanStack Query (queries + mutations)
  ├── services/     → camada HTTP (chamadas à API)
  ├── stores/       → state global da feature (Zustand)
  ├── types/        → tipos TypeScript da feature
  └── utils/        → funções utilitárias da feature
```

Componentes e utilitários compartilhados ficam em `shared/`.

### Separação de estado

- **Server state** (dados do backend) → TanStack Query
- **UI state global** (token, usuário) → Zustand persistente no localStorage
- **UI state local** (modal aberto, filtros) → `useState` ou `useSearchParams` (URL)

## Estrutura de pastas

```
src/
├── features/
│   ├── auth/              → login, registro, JWT, sessão
│   ├── categories/        → CRUD de categorias
│   ├── transactions/      → CRUD de transações com filtros e paginação
│   ├── budgets/           → CRUD de orçamentos por período
│   ├── reports/           → relatórios e indicadores
│   └── dashboard/         → cards do dashboard
├── shared/
│   ├── components/
│   │   ├── ui/            → componentes de UI reutilizáveis (Button, Input, Modal, etc.)
│   │   ├── AppLayout      → layout principal autenticado
│   │   ├── Sidebar        → navegação lateral
│   │   ├── ProtectedRoute → guard de rotas autenticadas
│   │   └── PublicOnlyRoute → guard de rotas públicas (login/registro)
│   ├── hooks/             → hooks reutilizáveis
│   ├── lib/               → http client, HATEOAS, query-client, date utils
│   ├── styles/            → estilos globais
│   └── types/             → tipos compartilhados
└── pages/                 → páginas da aplicação
```

## Como rodar

### Pré-requisitos

- Node.js 20+
- npm 10+
- Backend rodando em `http://localhost:8080`

### 1. Instale as dependências

```bash
npm install
```

### 2. Rode o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 3. Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`.

### 4. Preview do build

```bash
npm run preview
```

## Variáveis de ambiente

O frontend usa um proxy do Vite (`vite.config.ts`) para encaminhar `/api/*` para o backend. Não há variáveis de ambiente obrigatórias para rodar em desenvolvimento.

Para apontar para um backend diferente, ajuste o `target` do proxy em `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Auth** | Login, registro, JWT armazenado em localStorage, redirect automático em 401/403 |
| **Dashboard** | 5 cards: saldo, orçamento do mês, por categoria, transações recentes, fluxo de caixa |
| **Categorias** | CRUD completo com paleta de cores curada e seleção de tipo (Receita/Despesa) |
| **Transações** | CRUD com filtros por mês, tipo e categoria + paginação numérica |
| **Orçamentos** | CRUD por período (mês/ano) com barra de progresso e cálculo de gasto realizado |
| **Relatórios** | KPIs do mês, gráfico de pizza por categoria, fluxo de caixa dos últimos 12 meses |

## Roteamento

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Pública | Tela de login |
| `/register` | Pública | Tela de registro |
| `/dashboard` | Autenticada | Visão geral |
| `/transactions` | Autenticada | Listagem com filtros e paginação |
| `/categories` | Autenticada | Gerenciamento de categorias |
| `/budgets` | Autenticada | Orçamentos por período |
| `/reports` | Autenticada | Relatórios e indicadores |

Filtros e paginação são persistidos na URL via `useSearchParams`, permitindo compartilhamento e navegação pelo histórico do navegador.

## Padrões adotados

- **Discriminated unions** para gerenciar estado de modais (`{ mode: 'closed' | 'create' | 'edit' | 'delete' }`)
- **Composition over inheritance** — componentes pequenos compostos em telas (ex.: `ConfirmDialog` usa `Modal` por baixo)
- **Funções puras em `utils/`** — lógica de negócio testável e reutilizável (cálculo de períodos, agregações, filtros)
- **HATEOAS parsing centralizado** em `shared/lib/hateoas.ts` para lidar com respostas do Spring HATEOAS
- **Error handling tipado** com classe `ApiError` que expõe `status` e `fieldErrors`
- **Paths absolutos** com alias `@/` mapeado para `./src`
- **TypeScript strict** com `noUncheckedIndexedAccess` ativo

## Design system

Tema dark inspirado em Linear e Vercel:

| Token | Valor |
|-------|-------|
| Background base | `#09090B` |
| Surface | `#13131A` / `#0F0F14` |
| Border | `#1F1F26` / `#27272A` |
| Texto primário | `#F4F4F5` |
| Texto secundário | `#A1A1AA` |
| Accent | `#7C3AED` |
| Sucesso | `#4ADE80` |
| Erro | `#F87171` |

Tipografia: Inter (UI) + mono com `tabular-nums` para valores monetários.

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Roda o ESLint em todo o projeto |

## Integração com a API

Toda comunicação com o backend é feita através do wrapper `src/shared/lib/http.ts`, que:

- Injeta automaticamente o JWT em requisições autenticadas
- Trata respostas `application/hal+json` do Spring HATEOAS
- Redireciona para `/login` em respostas 401/403
- Converte erros em instâncias de `ApiError` com `status`, `message` e `fieldErrors`

Hooks de cada feature encapsulam as chamadas via TanStack Query, expondo uma API ergonômica:

```ts
const { transactions, page, isLoading, createTransaction, updateTransaction, deleteTransaction } =
  useTransactions(filters, pagination)
```

## Decisões técnicas

Consulte [docs/architecture.md](../docs/architecture.md) para entender as decisões de arquitetura tomadas no projeto.