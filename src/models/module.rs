use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Mapeamento da tabela `modules`.
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Module {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub is_active: bool,
    pub route_path: String,
}

/// Resposta para listagem de módulos com permissão de acesso do usuário.
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ModuleWithAccess {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub is_active: bool,
    pub route_path: String,
    pub access_level: Option<String>,
}
