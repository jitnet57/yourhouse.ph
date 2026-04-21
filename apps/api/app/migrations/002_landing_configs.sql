-- Migration: Landing Page Editor
-- 002_landing_configs.sql

CREATE TABLE IF NOT EXISTS landing_configs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL,
  version            INT  NOT NULL DEFAULT 1,
  is_published       BOOLEAN NOT NULL DEFAULT FALSE,

  -- Hero
  hero_bg_url        TEXT,
  hero_bg_type       VARCHAR(10) CHECK (hero_bg_type IN ('upload','url','gradient')),

  -- Overlay
  overlay_color      VARCHAR(9)  DEFAULT '#000000',
  overlay_alpha      FLOAT       DEFAULT 0.4 CHECK (overlay_alpha BETWEEN 0 AND 1),

  -- Gradient
  gradient_from      VARCHAR(9)  DEFAULT '#6366f1',
  gradient_to        VARCHAR(9)  DEFAULT '#ec4899',
  gradient_direction VARCHAR(10) DEFAULT 'to-br',

  -- Content (i18n jsonb)
  headline_i18n      JSONB       NOT NULL DEFAULT '{"en":""}',
  subtext_i18n       JSONB       NOT NULL DEFAULT '{"en":""}',
  cta_text_i18n      JSONB       NOT NULL DEFAULT '{"en":"Get Started"}',
  cta_color          VARCHAR(9)  DEFAULT '#6366f1',
  cta_url            TEXT        DEFAULT '/signup',

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at       TIMESTAMPTZ,

  UNIQUE (tenant_id, version)
);

CREATE INDEX IF NOT EXISTS idx_landing_tenant_published
  ON landing_configs(tenant_id, is_published)
  WHERE is_published = TRUE;

CREATE TRIGGER landing_configs_updated_at
  BEFORE UPDATE ON landing_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
