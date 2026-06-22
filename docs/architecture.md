# Arquitetura e Decisões Técnicas

Este documento registra as principais decisões de arquitetura tomadas no projeto MyBudgets e o raciocínio por trás de cada uma.

---

## Estrutura do projeto

### Monorepo

O projeto usa uma estrutura de monorepo com backend e frontend no mesmo repositório. Essa decisão facilita o desenvolvimento solo e permite que recrutadores clonem e entendam o projeto completo em um único lugar. Mudanças que afetam os dois lados ficam em um único commit com contexto completo.

### Arquitetura em camadas (Backend)

```
Controller → Service → Repository → Entity
```

Cada camada conhece apenas a camada imediatamente abaixo — nunca acima. Isso garante que:
- Controllers podem ser testados sem subir o banco
- Services podem ser testados sem HTTP
- Regras de negócio ficam isoladas no Service

---

## Decisões de banco de dados

### Flyway para migrations

O schema é versionado com Flyway em vez de usar `ddl-auto=update` do Hibernate. Isso garante rastreabilidade de mudanças e comportamento consistente em todos os ambientes. Cada migration é um arquivo SQL imutável — uma vez aplicado, nunca é editado.

### `DECIMAL(15,2)` para valores monetários

Valores financeiros nunca usam `FLOAT` ou `DOUBLE` — tipos de ponto flutuante que perdem precisão em operações decimais. No Java o equivalente é `BigDecimal`.

### Indexes de performance

Criados na migration `V5` para as queries mais comuns:
- `idx_transactions_user_date` — listagem de transações filtrada por usuário e data
- `idx_transactions_category` — agrupamento por categoria nos relatórios
- `idx_budgets_user_period` — busca de orçamentos por período

---

## Decisões de segurança

### JWT stateless

A autenticação é stateless — o servidor não guarda nenhum registro de sessões. O token carrega o `userId` e o `email` no payload, eliminando queries ao banco para identificar o usuário em cada requisição.

### BCrypt para senhas

Senhas nunca são armazenadas em texto puro. O BCrypt é propositalmente lento para dificultar ataques de força bruta. Cada hash é único mesmo para a mesma senha, por causa do salt embutido.

### Isolamento de dados por usuário

Todos os repositories filtram por `userId` em conjunto com o `id` do recurso — ex: `findByIdAndUserId`. Isso impede que um usuário acesse dados de outro mesmo conhecendo o ID do recurso.

---

## Decisões de API

### HATEOAS

Todos os endpoints de recursos (exceto relatórios) retornam links `_links` com as ações disponíveis. Isso implementa o nível 3 do Richardson Maturity Model e documenta as operações disponíveis diretamente na resposta.

Relatórios não têm HATEOAS porque são somente leitura — não há ações que o cliente possa executar sobre eles.

### DTOs separados por direção

Entidades JPA nunca são expostas diretamente na API. DTOs de entrada (`Request`) e saída (`Response`) são classes separadas. Isso garante que mudanças internas no modelo de dados não vazam automaticamente para a API.

### Paginação obrigatória em transações

A listagem de transações é sempre paginada — nunca retorna todos os registros de uma vez. O padrão é 20 itens por página ordenados por data decrescente.

### Filtros dinâmicos com Specification

Os filtros de transações são implementados com JPA Criteria API (Specification) em vez de query methods separados para cada combinação. Com 4 filtros opcionais, query methods gerariam combinações inviáveis. A Specification monta a query dinamicamente conforme os filtros enviados.

---

## Decisões de performance

### FetchType.LAZY em todos os relacionamentos

Todos os relacionamentos JPA usam `LAZY` por padrão. O `EAGER` busca relacionamentos sempre, mesmo quando não são necessários. Com `LAZY`, o JOIN só acontece quando explicitamente requisitado via `JOIN FETCH` nas queries.

### JOIN FETCH para evitar N+1

Queries que precisam de dados de relacionamentos usam `JOIN FETCH` para trazer tudo em uma única query. Sem isso, o Hibernate dispararia uma query extra para cada item retornado.

### countQuery separado

Queries paginadas com `JOIN FETCH` usam `countQuery` separado para evitar que o Hibernate carregue todos os registros na memória para contar — o que anularia o propósito da paginação.

### Cálculo em batch para realizedAmount

Na listagem de orçamentos, o `realizedAmount` de todas as categorias é calculado em uma única query com `GROUP BY`, em vez de uma query por orçamento. Isso evita N+1 no cálculo dos valores realizados.

---

## Decisões de código

### SecurityUtils sem query ao banco

O `userId` é extraído diretamente do token JWT via `SecurityContextHolder`, sem consultar o banco. O token já carrega o `userId` no payload — uma query extra seria desperdício em toda requisição autenticada.

### Exceptions de domínio com semântica clara

Em vez de `RuntimeException` genérica, o projeto usa exceptions específicas:
- `ResourceNotFoundException` → 404
- `BusinessException` → 400
- `EmailAlreadyExistsException` → 400
- `InvalidCredentialsException` → 400

Um `@ControllerAdvice` centralizado converte cada tipo para o status HTTP correto — sem lógica de HTTP nos Services.

### Records para DTOs de entrada e relatórios

DTOs de entrada e responses de relatório usam `record` — imutáveis por natureza e sem boilerplate. DTOs de saída com HATEOAS usam classes normais porque precisam estender `RepresentationModel`, e records não podem estender classes em Java.