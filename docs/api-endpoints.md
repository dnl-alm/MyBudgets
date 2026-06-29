# Endpoints da API

Documentação completa dos endpoints disponíveis na API do MyBudgets.

Base URL: `http://localhost:8080`

Documentação interativa: `http://localhost:8080/swagger-ui.html`

---

## Autenticação

Endpoints públicos — não exigem token.

### `POST /api/auth/register`

Registra um novo usuário e retorna o token JWT.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minimo8chars"
}
```

**Response `201`:**
```json
{
  "token": "eyJhbGci...",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

### `POST /api/auth/login`

Autentica um usuário existente e retorna o token JWT.

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "minimo8chars"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGci...",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## Categorias

Todos os endpoints exigem autenticação.

### `GET /api/categories`

Lista todas as categorias do usuário autenticado.

**Response `200`:**
```json
{
  "_embedded": {
    "categories": [
      {
        "id": 1,
        "name": "Alimentação",
        "color": "#ef4444",
        "type": "EXPENSE",
        "_links": { ... }
      }
    ]
  },
  "_links": {
    "self": { "href": "/api/categories" }
  }
}
```

---

### `GET /api/categories/{id}`

Busca uma categoria pelo ID.

**Response `200`:**
```json
{
  "id": 1,
  "name": "Alimentação",
  "color": "#ef4444",
  "type": "EXPENSE",
  "_links": { ... }
}
```

---

### `POST /api/categories`

Cria uma nova categoria.

**Request:**
```json
{
  "name": "Alimentação",
  "color": "#ef4444",
  "type": "EXPENSE"
}
```

**Response `201`:** mesma estrutura do `GET /api/categories/{id}`

---

### `PUT /api/categories/{id}`

Atualiza uma categoria existente.

**Request:** mesma estrutura do `POST`

**Response `200`:** mesma estrutura do `GET /api/categories/{id}`

---

### `DELETE /api/categories/{id}`

Deleta uma categoria.

**Response `204`:** sem body

---

## Transações

Todos os endpoints exigem autenticação.

### `GET /api/transactions`

Lista transações do usuário com paginação e filtros opcionais.

**Query params:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `page` | Integer | Não | Página (padrão: 0) |
| `size` | Integer | Não | Itens por página (padrão: 20) |
| `sort` | String | Não | ex: `date,desc` |
| `month` | Integer | Não | Mês (1-12) |
| `year` | Integer | Não | Ano |
| `type` | String | Não | `INCOME` ou `EXPENSE` |
| `categoryId` | Long | Não | ID da categoria |

**Response `200`:**
```json
{
  "_embedded": {
    "transactions": [
      {
        "id": 1,
        "amount": 50.00,
        "description": "Almoço",
        "date": "2026-06-18",
        "type": "EXPENSE",
        "category": {
          "id": 1,
          "name": "Alimentação",
          "color": "#ef4444",
          "type": "EXPENSE"
        },
        "createdAt": "2026-06-18T12:00:00",
        "_links": { ... }
      }
    ]
  },
  "_links": {
    "self": { "href": "..." },
    "next": { "href": "..." }
  },
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

---

### `GET /api/transactions/{id}`

Busca uma transação pelo ID.

**Response `200`:** objeto de transação com `_links`

---

### `POST /api/transactions`

Cria uma nova transação.

**Request:**
```json
{
  "amount": 50.00,
  "description": "Almoço",
  "date": "2026-06-18",
  "type": "EXPENSE",
  "categoryId": 1
}
```

**Response `201`:** objeto de transação com `_links`

---

### `PUT /api/transactions/{id}`

Atualiza uma transação existente.

**Request:** mesma estrutura do `POST`

**Response `200`:** objeto de transação com `_links`

---

### `DELETE /api/transactions/{id}`

Deleta uma transação.

**Response `204`:** sem body

---

## Orçamentos

Todos os endpoints exigem autenticação.

### `GET /api/budgets`

Lista orçamentos do usuário por período.

**Query params:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `month` | Integer | **Sim** | Mês (1-12) |
| `year` | Integer | **Sim** | Ano |

**Response `200`:**
```json
{
  "_embedded": {
    "budgets": [
      {
        "id": 1,
        "limitAmount": 1000.00,
        "realizedAmount": 750.00,
        "month": 6,
        "year": 2026,
        "category": {
          "id": 1,
          "name": "Alimentação",
          "color": "#ef4444",
          "type": "EXPENSE"
        },
        "_links": { ... }
      }
    ]
  },
  "_links": {
    "self": { "href": "/api/budgets" }
  }
}
```

---

### `GET /api/budgets/{id}`

Busca um orçamento pelo ID.

**Response `200`:** objeto de orçamento com `_links`

---

### `POST /api/budgets`

Cria um novo orçamento.

**Request:**
```json
{
  "categoryId": 1,
  "limitAmount": 1000.00,
  "month": 6,
  "year": 2026
}
```

**Response `201`:** objeto de orçamento com `_links`

---

### `PUT /api/budgets/{id}`

Atualiza um orçamento existente.

**Request:** mesma estrutura do `POST`

**Response `200`:** objeto de orçamento com `_links`

---

### `DELETE /api/budgets/{id}`

Deleta um orçamento.

**Response `204`:** sem body

---

## Relatórios

Todos os endpoints exigem autenticação. Sem HATEOAS — somente leitura.

### `GET /api/reports/summary`

Resumo financeiro do mês.

**Query params:**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `month` | Integer | **Sim** |
| `year` | Integer | **Sim** |

**Response `200`:**
```json
{
  "totalIncome": 5000.00,
  "totalExpense": 3200.00,
  "balance": 1800.00,
  "month": 6,
  "year": 2026
}
```

---

### `GET /api/reports/by-category`

Breakdown de receitas ou despesas por categoria.

**Query params:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `month` | Integer | **Sim** | Mês (1-12) |
| `year` | Integer | **Sim** | Ano |
| `type` | String | **Sim** | `INCOME` ou `EXPENSE` |

**Response `200`:**
```json
{
  "type": "EXPENSE",
  "total": 3200.00,
  "items": [
    {
      "categoryId": 1,
      "categoryName": "Alimentação",
      "color": "#ef4444",
      "amount": 800.00,
      "percentage": 25.00
    }
  ]
}
```

---

### `GET /api/reports/evolution`

Evolução financeira mensal em um período.

**Query params:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `startMonth` | Integer | **Sim** | Mês inicial (1-12) |
| `startYear` | Integer | **Sim** | Ano inicial |
| `endMonth` | Integer | **Sim** | Mês final (1-12) |
| `endYear` | Integer | **Sim** | Ano final |

**Response `200`:**
```json
{
  "items": [
    {
      "month": 1,
      "year": 2026,
      "totalIncome": 5000.00,
      "totalExpense": 3200.00,
      "balance": 1800.00
    },
    {
      "month": 2,
      "year": 2026,
      "totalIncome": 0.00,
      "totalExpense": 0.00,
      "balance": 0.00
    }
  ]
}
```

Meses sem transações retornam valores zero — garantindo que o gráfico de linha não tenha lacunas.