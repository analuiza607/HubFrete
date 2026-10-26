use axum::{extract::State, Json};
use uuid::Uuid;

use crate::{
    error::AppError,
    handlers::auth::JwtClaims,
    models::{
        module::ModuleWithAccess,
        user::SuccessResponse,
    },
    AppState,
};

// ─── GET /api/hub/modules ─────────────────────────────────────────────────────

/// Retorna os módulos ativos disponíveis para o usuário autenticado.
///
/// Lógica:
///   - ADMIN: vê TODOS os módulos ativos.
///   - EMBARCADOR / TRANSPORTADOR: vê apenas módulos ativos nos quais
///     possui uma entrada em `user_module_permissions`.
///
/// A resposta inclui o `access_level` do usuário em cada módulo.
pub async fn list_modules(
    State(state): State<AppState>,
    axum::Extension(claims): axum::Extension<JwtClaims>,
) -> Result<Json<SuccessResponse<Vec<ModuleWithAccess>>>, AppError> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| AppError::InvalidToken)?;
    let is_admin = claims.role.to_uppercase() == "ADMIN";

    let modules: Vec<ModuleWithAccess> = if is_admin {
        // ADMIN enxerga todos os módulos ativos com access_level = 'ADMIN'
        sqlx::query_as!(
            ModuleWithAccess,
            r#"
            SELECT
                m.id,
                m.name,
                m.slug,
                m.description,
                m.icon,
                m.is_active,
                m.route_path,
                'ADMIN'::TEXT AS access_level
            FROM modules m
            WHERE m.is_active = TRUE
            ORDER BY m.name ASC
            "#
        )
        .fetch_all(&state.db)
        .await?
    } else {
        // Demais roles: somente módulos com permissão explícita
        sqlx::query_as!(
            ModuleWithAccess,
            r#"
            SELECT
                m.id,
                m.name,
                m.slug,
                m.description,
                m.icon,
                m.is_active,
                m.route_path,
                ump.access_level
            FROM modules m
            INNER JOIN user_module_permissions ump
                ON ump.module_id = m.id
                AND ump.user_id = $1
            WHERE m.is_active = TRUE
            ORDER BY m.name ASC
            "#,
            user_id
        )
        .fetch_all(&state.db)
        .await?
    };

    tracing::info!(
        "Usuário {} ({}) consultou {} módulo(s).",
        user_id,
        claims.role,
        modules.len()
    );

    Ok(Json(SuccessResponse::new(modules)))
}

// ─── GET /api/hub/health ─────────────────────────────────────────────────────

/// Endpoint de saúde — útil para load balancers e probes de Kubernetes.
pub async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "service": "hub",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}
