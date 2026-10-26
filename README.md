# Hub — Portal de Módulos SaaS

Backend do Hub central do ecossistema SaaS de Frete, construído com **Rust + Axum + PostgreSQL**.

## Stack

| Camada       | Tecnologia                          |
|--------------|--------------------------------------|
| Framework    | Axum 0.7 + Tokio                    |
| Banco        | PostgreSQL (SQLx 0.7 + migrations)  |
| Auth         | JWT (jsonwebtoken 9) + Argon2id     |
| Logs         | tracing + tracing-subscriber        |

## Pré-requisitos

- Rust >= 1.75 (`rustup update stable`)
- PostgreSQL >= 14 rodando localmente
- SQLx CLI: `cargo install sqlx-cli --no-default-features --features rustls,postgres`

## Configuração

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais reais:
   ```env
   DATABASE_URL=postgres://USUARIO:SENHA@localhost:5432/hub_db
   JWT_SECRET=<string aleatória segura com 32+ caracteres>
   ```

3. Crie o banco de dados:
   ```bash
   sqlx database create
   ```

4. Execute as migrations:
   ```bash
   sqlx migrate run
   ```
   > As migrations também são aplicadas automaticamente na inicialização da aplicação.

## Rodando em desenvolvimento

```bash
cargo run
```

O servidor sobe em `http://0.0.0.0:3000` por padrão.

## Endpoints

### Públicos

| Método | Rota                  | Descrição                          |
|--------|-----------------------|------------------------------------|
| GET    | `/api/health`         | Health check                       |
| POST   | `/api/auth/register`  | Registro de novo usuário           |
| POST   | `/api/auth/login`     | Login — retorna JWT                |

### Protegidos (requer `Authorization: Bearer <token>`)

| Método | Rota                  | Descrição                          |
|--------|-----------------------|------------------------------------|
| GET    | `/api/auth/me`        | Dados do usuário autenticado       |
| GET    | `/api/hub/modules`    | Lista módulos disponíveis ao user  |

## Exemplos de uso (cURL)

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Luiza","email":"ana@empresa.com","password":"senha123","role":"EMBARCADOR"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@empresa.com","password":"senha123"}'
```

### Listar módulos (use o token retornado no login)
```bash
curl http://localhost:3000/api/hub/modules \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Estrutura do projeto

```
src/
├── main.rs          # Entry point, AppState, Router
├── config.rs        # Leitura de variáveis de ambiente
├── error.rs         # AppError centralizado -> HTTP responses
├── db.rs            # PgPool + auto-migrate
├── models/
│   ├── user.rs      # User, UserPublic, RegisterRequest, LoginRequest, AuthResponse
│   └── module.rs    # Module, ModuleWithAccess
├── handlers/
│   ├── auth.rs      # POST /register, POST /login, GET /me
│   └── hub.rs       # GET /hub/modules, GET /health
└── middleware/
    └── jwt_auth.rs  # require_auth, require_admin
migrations/
├── 20240101000001_initial_schema.sql
└── 20240101000002_seed_modules.sql
```

## Roles de usuário

| Role           | Acesso a Módulos                                           |
|----------------|------------------------------------------------------------|
| `EMBARCADOR`   | Módulos explicitamente concedidos em `user_module_permissions` |
| `TRANSPORTADOR`| Módulos explicitamente concedidos em `user_module_permissions` |
| `ADMIN`        | Todos os módulos ativos (sem necessidade de permissão)         |
