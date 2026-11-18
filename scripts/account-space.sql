-- Savartus account space: our own sign-in, members of each preservation
-- space, and the space's S3 details. One preservation_accounts row = one space.

-- Bucket and S3 user of the space. The secret is encrypted with
-- PRESERVATION_ENCRYPTION_KEY (AES-256-GCM); the site uses it to list files
-- and sign upload and download links, and shows it to admins once on renewal.
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS bucket_name text;
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS s3_access_key text;
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS s3_secret_enc text;
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS s3_secret_renewed_at timestamptz;

CREATE TABLE IF NOT EXISTS account_users (
  id uuid PRIMARY KEY,
  email varchar(254) NOT NULL,
  name varchar(150),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  last_signin_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS account_users_email ON account_users (lower(email));

CREATE TABLE IF NOT EXISTS account_members (
  account_id uuid NOT NULL REFERENCES preservation_accounts (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES account_users (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  invited_by uuid REFERENCES account_users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);
CREATE INDEX IF NOT EXISTS account_members_user ON account_members (user_id);

-- One-time sign-in links (also sent as invitations). Only the SHA-256 of the
-- token is stored.
CREATE TABLE IF NOT EXISTS account_signin_tokens (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES account_users (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS account_signin_tokens_user ON account_signin_tokens (user_id, created_at);

-- Signed-in browsers. Only the SHA-256 of the cookie value is stored.
CREATE TABLE IF NOT EXISTS account_sessions (
  id_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES account_users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS account_sessions_user ON account_sessions (user_id);

-- What happened in a space, for its admins.
CREATE TABLE IF NOT EXISTS account_activity (
  id bigserial PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES preservation_accounts (id) ON DELETE CASCADE,
  user_id uuid REFERENCES account_users (id) ON DELETE SET NULL,
  action text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS account_activity_account ON account_activity (account_id, created_at DESC);
