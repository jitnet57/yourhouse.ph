-- Migration: Language Sync System
-- 001_lang_sync.sql

-- 1. Add preferred_lang to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS preferred_lang VARCHAR(5) NOT NULL DEFAULT 'en'
  CHECK (preferred_lang IN ('en', 'ko', 'ja', 'zh'));

-- 2. Content store — original text of each translatable field
CREATE TABLE IF NOT EXISTS content_store (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key VARCHAR(255) UNIQUE NOT NULL,   -- e.g. "property.42.title"
  content_type VARCHAR(50)  NOT NULL,          -- property | lead | agent | report
  original_lang VARCHAR(5)  NOT NULL DEFAULT 'en',
  original_text TEXT        NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_store_type ON content_store(content_type);

-- 3. Translation store — per-language translated text
CREATE TABLE IF NOT EXISTS translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key     VARCHAR(255) NOT NULL,
  lang            VARCHAR(5)   NOT NULL CHECK (lang IN ('en', 'ko', 'ja', 'zh')),
  translated_text TEXT         NOT NULL,
  model_used      VARCHAR(100) DEFAULT 'claude-opus-4-7',
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (content_key, lang),
  FOREIGN KEY (content_key) REFERENCES content_store(content_key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_translations_key_lang ON translations(content_key, lang);

-- 4. Helper function: get content in requested language, fallback to original
CREATE OR REPLACE FUNCTION get_content(p_key VARCHAR, p_lang VARCHAR)
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    (SELECT translated_text FROM translations
     WHERE content_key = p_key AND lang = p_lang),
    (SELECT original_text FROM content_store
     WHERE content_key = p_key)
  );
$$;

-- 5. Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER content_store_updated_at
  BEFORE UPDATE ON content_store
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
