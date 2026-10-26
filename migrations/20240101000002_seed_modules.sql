-- Migration: 002_seed_modules
-- Seeds the initial module: Leilão de Fretes
INSERT INTO modules (id, name, slug, description, icon, is_active, route_path)
VALUES
    (
        gen_random_uuid(),
        'Leilão de Fretes',
        'leilao-de-fretes',
        'Módulo para publicação e participação em leilões reversos de frete. Embarcadores publicam cargas e Transportadores ofertam o menor preço.',
        'truck',
        TRUE,
        '/modulos/leilao-de-fretes'
    )
ON CONFLICT (slug) DO NOTHING;
