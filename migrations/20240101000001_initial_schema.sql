-- Migration: 001_initial_schema
-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'EMBARCADOR'
                  CHECK (role IN ('EMBARCADOR', 'TRANSPORTADOR', 'ADMIN')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for fast email lookups on login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- TABLE: modules
-- ============================================================
CREATE TABLE IF NOT EXISTS modules (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon        VARCHAR(100),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    route_path  VARCHAR(255) NOT NULL
);

-- ============================================================
-- TABLE: user_module_permissions
-- ============================================================
CREATE TABLE IF NOT EXISTS user_module_permissions (
    user_id      UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    module_id    UUID        NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    access_level VARCHAR(50) NOT NULL DEFAULT 'READ'
                 CHECK (access_level IN ('READ', 'WRITE', 'ADMIN')),
    PRIMARY KEY (user_id, module_id)
);

-- ============================================================
-- TRIGGER: auto-update updated_at on users
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
