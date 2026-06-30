# MyBudgets

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-compose-blue?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Sistema de controle de gastos pessoais com autenticação JWT, categorias customizadas, orçamentos mensais e relatórios visuais.

---

## Sobre o projeto

O MyBudgets permite que usuários registrem receitas e despesas, organizem transações por categorias personalizadas, definam orçamentos mensais e acompanhem sua evolução financeira através de relatórios e gráficos.

## Funcionalidades

- Autenticação segura com JWT
- Gerenciamento de categorias personalizadas com cores
- Registro de transações com filtros e paginação
- Orçamentos mensais por categoria com acompanhamento de progresso
- Relatórios de resumo mensal, breakdown por categoria e evolução temporal

## Estrutura do monorepo

```
MyBudgets/
├── Api/          → Backend Java + Spring Boot
├── Front-end/     → Frontend React + TypeScript
├── docs/         → Documentação do projeto
├── docker-compose.yml
└── README.md
```

## Como rodar localmente

### Pré-requisitos

- Docker e Docker Compose
- Java 21+
- Node.js 18+

### 1. Clone o repositório

```bash
git clone https://github.com/dnl-alm/MyBudgets.git
cd MyBudgets
```

### 2. Suba o banco de dados

```bash
docker compose up -d
```

### 3. Configure as variáveis de ambiente do backend

Crie o arquivo `api/src/main/resources/application-local.properties`:

```properties
spring.datasource.password=root
security.jwt.secret=seu-secret-local-minimo-32-caracteres
```

### 4. Rode o backend

```bash
cd Api
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.
Documentação Swagger em `http://localhost:8080/swagger-ui.html`.

### 5. Rode o frontend

```bash
cd Front-end
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Documentação

- [Regras de negócio](docs/business-rules.md)
- [Arquitetura](docs/architecture.md)
- [Endpoints da API](docs/api-endpoints.md)

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21, Spring Boot 4.1, Spring Security, Spring Data JPA |
| Banco de dados | MySQL 8, Flyway |
| Autenticação | JWT (JJWT 0.12.6) |
| Documentação | SpringDoc OpenAPI 3 |
| Frontend | React 18, TypeScript, TanStack Query, Zustand |
| Infraestrutura | Docker, Docker Compose |
