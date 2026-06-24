-- =============================================
-- StockMind - V1: Schema Inicial
-- =============================================

-- Habilita a extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- DOMÍNIO: CATÁLOGO E ESTRUTURA
-- =============================================

CREATE TABLE tb_stores (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    manager_name  VARCHAR(255) NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE tb_products (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    ean            VARCHAR(50)    NOT NULL UNIQUE,
    name           VARCHAR(255)   NOT NULL,
    curve_category VARCHAR(1)     NOT NULL CHECK (curve_category IN ('A', 'B', 'C')),
    cost_price     NUMERIC(10, 2) NOT NULL,
    sale_price     NUMERIC(10, 2) NOT NULL,
    active         BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_ean ON tb_products (ean);
CREATE INDEX idx_products_curve_category ON tb_products (curve_category);

-- =============================================
-- DOMÍNIO: OPERAÇÃO E HISTÓRICO
-- =============================================

CREATE TABLE tb_inventory_lots (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID        NOT NULL REFERENCES tb_stores(id),
    product_id      UUID        NOT NULL REFERENCES tb_products(id),
    batch_number    VARCHAR(100) NOT NULL,
    expiration_date DATE        NOT NULL,
    quantity        INTEGER     NOT NULL DEFAULT 0,
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_lots_store_id     ON tb_inventory_lots (store_id);
CREATE INDEX idx_inventory_lots_product_id   ON tb_inventory_lots (product_id);
CREATE INDEX idx_inventory_lots_expiration   ON tb_inventory_lots (expiration_date);

CREATE TABLE tb_sales_history (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id        UUID           NOT NULL REFERENCES tb_stores(id),
    product_id      UUID           NOT NULL REFERENCES tb_products(id),
    sale_date       TIMESTAMP      NOT NULL,
    quantity_sold   INTEGER        NOT NULL,
    unit_price      NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_sales_history_store_product_date
    ON tb_sales_history (store_id, product_id, sale_date);

-- =============================================
-- DOMÍNIO: INTELIGÊNCIA E RECOMENDAÇÕES
-- =============================================

CREATE TABLE tb_forecasts (
    id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id           UUID           NOT NULL REFERENCES tb_stores(id),
    product_id         UUID           NOT NULL REFERENCES tb_products(id),
    target_date        DATE           NOT NULL,
    predicted_quantity INTEGER        NOT NULL,
    confidence_score   NUMERIC(5, 4)  NOT NULL,
    created_at         TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forecasts_store_product ON tb_forecasts (store_id, product_id);
CREATE INDEX idx_forecasts_target_date   ON tb_forecasts (target_date);

CREATE TABLE tb_purchase_recommendations (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id          UUID           NOT NULL REFERENCES tb_stores(id),
    product_id        UUID           NOT NULL REFERENCES tb_products(id),
    suggested_quantity INTEGER       NOT NULL,
    financial_impact  NUMERIC(10, 2) NOT NULL,
    rationale         TEXT           NOT NULL,
    status            VARCHAR(20)    NOT NULL DEFAULT 'PENDING'
                                     CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at        TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_store_id ON tb_purchase_recommendations (store_id);
CREATE INDEX idx_recommendations_status   ON tb_purchase_recommendations (status);