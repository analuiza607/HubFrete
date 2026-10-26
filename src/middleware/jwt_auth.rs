use axum::{
    body::Body,
    extract::State,
    http::{header, Request, StatusCode},
    middleware::Next,
    response::Response,
    Json,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde_json::json;

use crate::{handlers::auth::JwtClaims, AppState};

/// Middleware de autenticação JWT.
///
/// Extrai o token do header `Authorization: Bearer <token>`,
/// valida assinatura e expiração, e injeta `JwtClaims` na Extension
/// para uso pelos handlers downstream.
pub async fn require_auth(
    State(state): State<AppState>,
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, (StatusCode, Json<serde_json::Value>)> {
    // ── Extrai o header Authorization ────────────────────────────────────
    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok());

    let token = match auth_header {
        Some(h) if h.starts_with("Bearer ") => h.trim_start_matches("Bearer ").trim(),
        _ => {
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(json!({
                    "success": false,
                    "error": "MISSING_TOKEN",
                    "message": "Header Authorization ausente ou mal formatado. Use: Bearer <token>"
                })),
            ));
        }
    };

    // ── Valida e decodifica o JWT ─────────────────────────────────────────
    let token_data = decode::<JwtClaims>(
        token,
        &DecodingKey::from_secret(state.config.jwt_secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|e| {
        tracing::warn!("JWT inválido: {:?}", e);
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({
                "success": false,
                "error": "INVALID_TOKEN",
                "message": "Token JWT inválido ou expirado."
            })),
        )
    })?;

    // ── Injeta os claims como Extension ───────────────────────────────────
    request.extensions_mut().insert(token_data.claims);

    Ok(next.run(request).await)
}

/// Middleware auxiliar: restringe acesso apenas a usuários com role ADMIN.
pub async fn require_admin(
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, (StatusCode, Json<serde_json::Value>)> {
    let claims = request
        .extensions()
        .get::<JwtClaims>()
        .cloned()
        .ok_or_else(|| {
            (
                StatusCode::UNAUTHORIZED,
                Json(json!({
                    "success": false,
                    "error": "UNAUTHORIZED",
                    "message": "Autenticação necessária."
                })),
            )
        })?;

    if claims.role.to_uppercase() != "ADMIN" {
        return Err((
            StatusCode::FORBIDDEN,
            Json(json!({
                "success": false,
                "error": "FORBIDDEN",
                "message": "Acesso restrito a administradores."
            })),
        ));
    }

    // Reinserimos para garantir que está disponível após o check
    request.extensions_mut().insert(claims);
    Ok(next.run(request).await)
}
