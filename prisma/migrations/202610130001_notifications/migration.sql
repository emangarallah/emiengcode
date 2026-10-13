-- EMICODE persistent role-scoped notifications and per-request client capability tokens.
-- Safe to apply to an existing Neon database. No existing customer/project rows are deleted.

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_role VARCHAR(32) NOT NULL,
  recipient_key VARCHAR(128),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(64) NOT NULL DEFAULT 'info',
  entity_type VARCHAR(64),
  entity_id VARCHAR(128),
  target_url TEXT,
  read_at TIMESTAMPTZ,
  dedupe_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS notifications_recipient_created_idx
  ON notifications (recipient_role, recipient_key, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx
  ON notifications (recipient_role, recipient_key, read_at);

CREATE TABLE IF NOT EXISTS client_request_access (
  contact_id UUID PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT client_request_access_contact_fk
    FOREIGN KEY (contact_id) REFERENCES contact_requests(id) ON DELETE CASCADE
);
