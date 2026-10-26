use std::env;

/// Configurações da aplicação carregadas das variáveis de ambiente.
#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expiration_hours: i64,
    pub server_host: String,
    pub server_port: u16,
}

impl Config {
    /// Carrega todas as configurações do ambiente.
    /// Entra em pânico se alguma variável obrigatória estiver ausente.
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL")
                .expect("DATABASE_URL deve estar definida no .env"),
            jwt_secret: env::var("JWT_SECRET")
                .expect("JWT_SECRET deve estar definida no .env"),
            jwt_expiration_hours: env::var("JWT_EXPIRATION_HOURS")
                .unwrap_or_else(|_| "24".to_string())
                .parse()
                .expect("JWT_EXPIRATION_HOURS deve ser um número inteiro"),
            server_host: env::var("SERVER_HOST")
                .unwrap_or_else(|_| "0.0.0.0".to_string()),
            server_port: env::var("SERVER_PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse()
                .expect("SERVER_PORT deve ser um número válido"),
        }
    }
}
