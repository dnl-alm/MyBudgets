# Regras de Negócio

Este documento descreve todas as regras de negócio que o frontend deve conhecer para consumir a API do MyBudgets corretamente.

---

## Autenticação

- O token JWT é retornado no body da resposta do login e do registro — não em cookie ou header
- O frontend deve enviá-lo em toda requisição protegida no header `Authorization: Bearer <token>`
- O token expira em **24 horas**
- Quando o backend retornar `401`, o frontend deve redirecionar para login e limpar o token
- O registro já autentica o usuário — retorna o token igual ao login, sem precisar fazer duas requisições

---

## Categorias

- Toda categoria pertence a um único usuário — o frontend nunca verá categorias de outros usuários
- O campo `color` é sempre um hex de 6 dígitos com `#` — ex: `#6366f1`. Pode ser usado diretamente como cor CSS
- O campo `type` é sempre `INCOME` ou `EXPENSE`
- Não é possível criar duas categorias com o mesmo nome para o mesmo usuário — o backend retorna `400`

---

## Transações

- A listagem é sempre paginada
- Formato padrão sem parâmetros: página 0, 20 itens, ordenado por data decrescente
- O campo `date` é sempre no formato `yyyy-MM-dd`
- O campo `createdAt` é sempre no formato `yyyy-MM-dd'T'HH:mm:ss`
- O campo `amount` é sempre decimal positivo com até 2 casas — ex: `150.00`
- A categoria dentro da transação já vem com `id`, `name`, `color` e `type` — sem necessidade de segunda requisição
- Não é possível criar transação com `amount` menor ou igual a zero

### Parâmetros de listagem

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `page` | Integer | Não | Número da página, começa em 0 |
| `size` | Integer | Não | Itens por página |
| `sort` | String | Não | Campo e direção ex: `date,desc` |
| `month` | Integer | Não | Filtro por mês (1-12) |
| `year` | Integer | Não | Filtro por ano |
| `type` | String | Não | `INCOME` ou `EXPENSE` |
| `categoryId` | Long | Não | ID da categoria |

---

## Orçamentos

- A listagem exige sempre `month` e `year` — não é possível listar sem filtrar por período
- O campo `realizedAmount` representa o total de transações da categoria no período — para `EXPENSE` e `INCOME`
- Para categorias `EXPENSE`: `realizedAmount` = total gasto, `limitAmount` = limite de gasto
- Para categorias `INCOME`: `realizedAmount` = total recebido, `limitAmount` = meta de receita
- A porcentagem da barra de progresso deve ser calculada pelo frontend: `(realizedAmount / limitAmount) * 100`
- Quando `realizedAmount > limitAmount` o orçamento foi ultrapassado — sinalizar visualmente
- Não é possível criar dois orçamentos para a mesma categoria no mesmo mês e ano — o backend retorna `400`

---

## Relatórios

### `GET /api/reports/summary`

Exige `month` e `year`. Retorna resumo do mês:

| Campo | Descrição |
|-------|-----------|
| `totalIncome` | Total de receitas do mês |
| `totalExpense` | Total de despesas do mês |
| `balance` | `totalIncome - totalExpense` — pode ser negativo |

### `GET /api/reports/by-category`

Exige `month`, `year` e `type`. O `type` é obrigatório — misturar receitas e despesas no mesmo gráfico não faz sentido.

| Campo | Descrição |
|-------|-----------|
| `type` | `INCOME` ou `EXPENSE` |
| `total` | Soma de todos os amounts |
| `items[].percentage` | Já calculada no backend, pronta para o gráfico |

A soma de todos os `percentage` dos items é sempre 100 — ou zero se não houver transações.

### `GET /api/reports/evolution`

Exige `startMonth`, `startYear`, `endMonth` e `endYear`.

- Retorna **todos os meses do período**, inclusive os sem transações — nesses casos os valores são zero
- Isso garante que o gráfico de linha mostra todos os meses sem lacunas
- O campo `balance` pode ser negativo

---

## Formato padrão de erros

```json
{
  "status": 400,
  "message": "mensagem do erro",
  "path": "/api/categories",
  "timestamp": "2026-06-18T23:43:59",
  "fieldErrors": null
}
```

Para erros de validação de campos, `fieldErrors` vem preenchido:

```json
{
  "status": 422,
  "message": "Erro de validação",
  "path": "/api/transactions",
  "timestamp": "2026-06-18T23:43:59",
  "fieldErrors": {
    "amount": "Valor deve ser maior que zero",
    "categoryId": "Categoria é obrigatória"
  }
}
```

### Códigos HTTP

| Código | Situação |
|--------|----------|
| `200` | Sucesso em GET e PUT |
| `201` | Sucesso em POST |
| `204` | Sucesso em DELETE |
| `400` | Erro de regra de negócio |
| `401` | Não autenticado ou token expirado |
| `404` | Recurso não encontrado |
| `422` | Erro de validação de campos |
| `500` | Erro interno do servidor |

---

## HATEOAS

Todos os endpoints exceto relatórios retornam `_links` com as ações disponíveis:

```json
"_links": {
  "self":         { "href": "/api/categories/1" },
  "update":       { "href": "/api/categories/1" },
  "delete":       { "href": "/api/categories/1" },
  "categories":   { "href": "/api/categories" }
}
```

A listagem de transações retorna links de navegação e metadados de paginação:

```json
"_links": {
  "self": { "href": "..." },
  "next": { "href": "..." },
  "prev": { "href": "..." }
},
"page": {
  "number": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```