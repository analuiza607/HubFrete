mod config;
mod db;
mod error;
mod handlers;
mod middleware;
mod models;

use axum::{
    middleware as axum_middleware,
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use config::Config;

// ─── AppState ─────────────────────────────────────────────────────────────────

/// Estado compartilhado entre todos os handlers do Axum.
/// Clonado de forma barata via Arc internamente pelo Axum.
#[derive(Clone)]
pub struct AppState {
    /// Pool de conexões com o PostgreSQL
    pub db: PgPool,
    /// Configurações carregadas do .env
    pub config: Config,
}

// ─── main ─────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() {
    // ── Inicializa tracing (logs estruturados) ────────────────────────────
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "hub=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // ── Carrega variáveis de ambiente do arquivo .env ─────────────────────
    dotenvy::dotenv().ok();
    let config = Config::from_env();

    tracing::info!("===========================================");
    tracing::info!("  Hub SaaS — Iniciando servidor           ");
    tracing::info!("===========================================");

    // ── Cria pool do PostgreSQL e executa migrations ──────────────────────
    let db_pool = db::create_pool(&config.database_url).await;

    // ── Monta o AppState ──────────────────────────────────────────────────
    let state = AppState {
        db: db_pool,
        config: config.clone(),
    };

    // ── Constrói o Router do Axum ─────────────────────────────────────────
    let app = build_router(state);

    // ── Inicia o servidor TCP ─────────────────────────────────────────────
    let addr: SocketAddr = format!("{}:{}", config.server_host, config.server_port)
        .parse()
        .expect("Endereço do servidor inválido");

    tracing::info!("Servidor escutando em http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Falha ao criar listener TCP");

    axum::serve(listener, app)
        .await
        .expect("Falha ao iniciar servidor Axum");
}

// ─── Router ───────────────────────────────────────────────────────────────────

fn build_router(state: AppState) -> Router {
    // ── Rotas públicas (sem JWT) ───────────────────────────────────────────
    let public_routes = Router::new()
        .route("/api/health", get(handlers::hub::health_check))
        .route("/api/auth/register", post(handlers::auth::register))
        .route("/api/auth/login", post(handlers::auth::login));

    // ── Rotas protegidas (requerem JWT válido) ────────────────────────────
    let protected_routes = Router::new()
        .route("/api/auth/me", get(handlers::auth::me))
        .route("/api/hub/modules", get(handlers::hub::list_modules))
        .layer(axum_middleware::from_fn_with_state(
            state.clone(),
            middleware::jwt_auth::require_auth,
        ));

    // ── CORS: permite todas as origens em desenvolvimento ─────────────────
    // Em produção, substitua `Any` pelos domínios reais.
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // ── Monta router principal ────────────────────────────────────────────
    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state)
}
