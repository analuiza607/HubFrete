use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::time::Duration;

/// Cria e retorna um pool de conexões PostgreSQL configurado.
///
/// - Máximo de 10 conexões simultâneas
/// - Timeout de aquisição de conexão: 5 segundos
/// - Executa todas as migrations pendentes automaticamente
pub async fn create_pool(database_url: &str) -> PgPool {
    tracing::info!("Conectando ao PostgreSQL...");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(5))
        .connect(database_url)
        .await
        .expect("Falha ao conectar ao PostgreSQL. Verifique DATABASE_URL no .env");

    tracing::info!("Conexão com PostgreSQL estabelecida.");

    // Executa todas as migrations em ./migrations/ automaticamente
    tracing::info!("Executando migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Falha ao executar migrations do SQLx");

    tracing::info!("Migrations aplicadas com sucesso.");
    pool
}
