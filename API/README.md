# MyBudgets — API

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-brightgreen?style=flat-square&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?style=flat-square&logo=mysql)
![Flyway](https://img.shields.io/badge/Flyway-migrations-red?style=flat-square)

API REST do sistema MyBudgets desenvolvida com Java 21 e Spring Boot 4.1.

---

## Tecnologias

- **Java 21** — linguagem principal
- **Spring Boot 4.1** — framework principal
- **Spring Security + JWT** — autenticação e autorização
- **Spring Data JPA + Hibernate** — persistência
- **MySQL 8** — banco de dados
- **Flyway** — migrations de banco de dados
- **Spring HATEOAS** — links de navegação nas respostas
- **MapStruct** — conversão entre entidades e DTOs
- **Lombok** — redução de boilerplate
- **SpringDoc OpenAPI 3** — documentação interativa

## Arquitetura

A API segue uma arquitetura em camadas com separação clara de responsabilidades:

```
Controller → Service → Repository → Entity
```

- **Controller** — recebe requisições HTTP, valida entrada, delega ao Service
- **Service** — executa regras de negócio, orquestra repositories
- **Repository** — acesso a dados via Spring Data JPA
- **Entity** — modelo de domínio mapeado com JPA
- **DTO** — objetos de transferência separados por direção (Request/Response)
- **Assembler** — converte entidades em DTOs com links HATEOAS
- **Security** — filtro JWT, configuração do Spring Security

## Estrutura de pacotes

```
br.com.mybudgets/
├── config/          → configurações (Swagger)
├── controller/      → endpoints REST
├── domain/
│   ├── entity/      → entidades JPA
│   └── enums/       → enumerações
├── dto/
│   ├── request/     → DTOs de entrada
│   └── response/    → DTOs de saída
├── exception/       → exceptions customizadas e handler global
├── mapper/          → assemblers HATEOAS
├── repository/      → interfaces Spring Data JPA
├── security/        → JWT, filtros, configuração de segurança
├── service/         → regras de negócio
└── specification/   → filtros dinâmicos com JPA Criteria API
```

## Como rodar

### Pré-requisitos

- Java 21+
- Docker (para o MySQL)

### 1. Suba o banco de dados

Na raiz do monorepo:

```bash
docker compose up -d
```

### 2. Configure as variáveis de ambiente locais

Crie o arquivo `src/main/resources/application-local.properties`:

```properties
spring.datasource.password=root
security.jwt.secret=seu-secret-local-minimo-32-caracteres
```

### 3. Rode a aplicação

```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

### 4. Acesse a documentação

```
http://localhost:8080/swagger-ui.html
```

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_URL` | URL do banco de dados | `jdbc:mysql://localhost:3306/mybudgets` |
| `DB_USERNAME` | Usuário do banco | `root` |
| `DB_PASSWORD` | Senha do banco | — |
| `JWT_SECRET` | Chave secreta do JWT | — |
| `JWT_EXPIRATION` | Expiração do token em ms | `86400000` (24h) |

## Banco de dados

O schema é gerenciado pelo Flyway com migrations versionadas:

| Migration | Descrição |
|-----------|-----------|
| V1 | Criação da tabela `users` |
| V2 | Criação da tabela `categories` |
| V3 | Criação da tabela `transactions` |
| V4 | Criação da tabela `budgets` |
| V5 | Criação de indexes de performance |

## Endpoints

Consulte a documentação completa em [docs/api-endpoints.md](../docs/api-endpoints.md) ou acesse o Swagger em `http://localhost:8080/swagger-ui.html`.

## Testes

### Rodar todos os testes

```bash
./mvnw test
```

### Rodar pelo IntelliJ

Clica na setinha verde ao lado do nome do método ou da classe diretamente no editor. Ou pressiona `Ctrl + Shift + F10` com o cursor dentro da classe de teste.

### Estrutura dos testes

```
src/test/
├── java/br/com/mybudgets/
│   └── service/          → testes unitários dos Services
└── resources/
    └── application.properties  → configurações de teste
```

Os testes unitários usam JUnit 5 + Mockito e não precisam de banco de dados ou Docker rodando — todas as dependências são mockadas.

## Decisões técnicas

Consulte [docs/architecture.md](../docs/architecture.md) para entender as decisões de arquitetura tomadas no projeto.
