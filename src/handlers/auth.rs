use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::{extract::State, http::StatusCode, Json};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    error::AppError,
    models::user::{AuthResponse, LoginRequest, RegisterRequest, SuccessResponse, UserPublic},
    AppState,
};

// ─── Claims do JWT ────────────────────────────────────────────────────────────

/// Payload codificado dentro do JWT.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JwtClaims {
    /// Subject: user_id em formato string
    pub sub: String,
    /// Role do usuário
    pub role: String,
    /// Issued at (timestamp Unix)
    pub iat: i64,
    /// Expiration (timestamp Unix)
    pub exp: i64,
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

/// Registra um novo usuário no sistema.
///
/// Valida os campos, faz o hash seguro da senha com Argon2id,
/// e insere o usuário no PostgreSQL.
pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<SuccessResponse<UserPublic>>), AppError> {
    // ── Validações básicas ────────────────────────────────────────────────
    let name = payload.name.trim().to_string();
    let email = payload.email.trim().to_lowercase();
    let password = payload.password.trim().to_string();

    if name.is_empty() {
        return Err(AppError::ValidationError("O campo 'name' é obrigatório.".into()));
    }
    if email.is_empty() || !email.contains('@') {
        return Err(AppError::ValidationError("E-mail inválido.".into()));
    }
    if password.len() < 8 {
        return Err(AppError::ValidationError(
            "A senha deve ter no mínimo 8 caracteres.".into(),
        ));
    }

    // ── Normaliza role (padrão: EMBARCADOR) ───────────────────────────────
    let role = payload
        .role
        .as_deref()
        .unwrap_or("EMBARCADOR")
        .trim()
        .to_uppercase();

    if !["EMBARCADOR", "TRANSPORTADOR", "ADMIN"].contains(&role.as_str()) {
        return Err(AppError::ValidationError(
            "Role inválida. Use: EMBARCADOR, TRANSPORTADOR ou ADMIN.".into(),
        ));
    }

    // ── Hash da senha com Argon2id ────────────────────────────────────────
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| AppError::PasswordHashError)?
        .to_string();

    // ── Inserção no PostgreSQL ────────────────────────────────────────────
    let user = sqlx::query_as!(
        UserPublic,
        r#"
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
        "#,
        name,
        email,
        password_hash,
        role,
    )
    .fetch_one(&state.db)
    .await?;

    tracing::info!("Novo usuário registrado: {} ({})", user.email, user.role);

    Ok((
        StatusCode::CREATED,
        Json(SuccessResponse::with_message(user, "Usuário criado com sucesso.")),
    ))
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

/// Autentica o usuário, verifica a senha e retorna um JWT.
pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let email = payload.email.trim().to_lowercase();
    let password = payload.password.trim().to_string();

    if email.is_empty() || password.is_empty() {
        return Err(AppError::ValidationError(
            "E-mail e senha são obrigatórios.".into(),
        ));
    }

    // ── Busca usuário por e-mail ──────────────────────────────────────────
    let user = sqlx::query!(
        r#"
        SELECT id, name, email, password_hash, role, created_at
        FROM users
        WHERE email = $1
        "#,
        email
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::InvalidCredentials)?;

    // ── Verifica senha com Argon2 ─────────────────────────────────────────
    let parsed_hash = PasswordHash::new(&user.password_hash)
        .map_err(|_| AppError::PasswordHashError)?;

    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::InvalidCredentials)?;

    // ── Gera JWT ──────────────────────────────────────────────────────────
    let now = Utc::now();
    let expiration = now + Duration::hours(state.config.jwt_expiration_hours);

    let claims = JwtClaims {
        sub: user.id.to_string(),
        role: user.role.clone(),
        iat: now.timestamp(),
        exp: expiration.timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
    )
    .map_err(|_| AppError::InternalServer)?;

    let user_public = UserPublic {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
    };

    tracing::info!("Login bem-sucedido: {}", user_public.email);

    Ok(Json(AuthResponse {
        success: true,
        token,
        user: user_public,
    }))
}

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

/// Retorna os dados do usuário autenticado (extraídos via JWT middleware).
pub async fn me(
    State(state): State<AppState>,
    axum::Extension(claims): axum::Extension<JwtClaims>,
) -> Result<Json<SuccessResponse<UserPublic>>, AppError> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| AppError::InvalidToken)?;

    let user = sqlx::query_as!(
        UserPublic,
        r#"
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
        "#,
        user_id
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(Json(SuccessResponse::new(user)))
}
