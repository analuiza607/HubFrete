use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

/// Enumeração centralizada de todos os erros da aplicação Hub.
/// Cada variante mapeia automaticamente para um HTTP StatusCode adequado.
#[derive(Debug, Error)]
pub enum AppError {
    // ── Banco de Dados ────────────────────────────────────────────────────
    #[error("Erro de banco de dados: {0}")]
    Database(#[from] sqlx::Error),

    // ── Autenticação / Autorização ────────────────────────────────────────
    #[error("Credenciais inválidas")]
    InvalidCredentials,

    #[error("Token JWT inválido ou expirado")]
    InvalidToken,

    #[error("Acesso não autorizado")]
    Unauthorized,

    // ── Validação de entrada ──────────────────────────────────────────────
    #[error("Dados inválidos: {0}")]
    ValidationError(String),

    #[error("Recurso não encontrado")]
    NotFound,

    #[error("Conflito: {0}")]
    Conflict(String),

    // ── Erros internos ────────────────────────────────────────────────────
    #[error("Erro interno do servidor")]
    InternalServer,

    #[error("Erro ao processar senha")]
    PasswordHashError,
}

/// Converte AppError em uma resposta HTTP JSON padronizada.
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_code, message) = match &self {
            AppError::Database(e) => {
                // Detecta violação de unicidade (ex: email duplicado)
                if let sqlx::Error::Database(db_err) = e {
                    if db_err.constraint().is_some() {
                        return (
                            StatusCode::CONFLICT,
                            Json(json!({
                                "success": false,
                                "error": "CONFLICT",
                                "message": "Registro já existe (violação de restrição única)."
                            })),
                        )
                            .into_response();
                    }
                }
                tracing::error!("Database error: {:?}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "DATABASE_ERROR",
                    "Erro interno de banco de dados.".to_string(),
                )
            }
            AppError::InvalidCredentials => (
                StatusCode::UNAUTHORIZED,
                "INVALID_CREDENTIALS",
                self.to_string(),
            ),
            AppError::InvalidToken => (
                StatusCode::UNAUTHORIZED,
                "INVALID_TOKEN",
                self.to_string(),
            ),
            AppError::Unauthorized => (
                StatusCode::FORBIDDEN,
                "FORBIDDEN",
                self.to_string(),
            ),
            AppError::ValidationError(msg) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                "VALIDATION_ERROR",
                msg.clone(),
            ),
            AppError::NotFound => (
                StatusCode::NOT_FOUND,
                "NOT_FOUND",
                self.to_string(),
            ),
            AppError::Conflict(msg) => (
                StatusCode::CONFLICT,
                "CONFLICT",
                msg.clone(),
            ),
            AppError::InternalServer => {
                tracing::error!("Internal server error");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "INTERNAL_SERVER_ERROR",
                    self.to_string(),
                )
            }
            AppError::PasswordHashError => {
                tracing::error!("Password hashing error");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "PASSWORD_HASH_ERROR",
                    "Erro ao processar credenciais.".to_string(),
                )
            }
        };

        (
            status,
            Json(json!({
                "success": false,
                "error": error_code,
                "message": message
            })),
        )
            .into_response()
    }
}
