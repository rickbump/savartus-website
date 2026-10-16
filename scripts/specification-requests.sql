CREATE TABLE IF NOT EXISTS specification_requests (
  email_key text PRIMARY KEY CHECK (email_key ~ '^[a-f0-9]{64}$'),
  version uuid NOT NULL,
  name varchar(150) NOT NULL,
  organization varchar(200) NOT NULL,
  title varchar(150) NOT NULL,
  email varchar(254) NOT NULL,
  source varchar(200) NOT NULL,
  requested_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'failed')),
  email_accepted_at timestamptz
);

CREATE TABLE IF NOT EXISTS specification_crm_sync (
  request_id uuid PRIMARY KEY,
  email_key text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'synced')),
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  last_attempt_at timestamptz,
  contact_id text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  synced_at timestamptz
);

CREATE INDEX IF NOT EXISTS specification_crm_sync_pending
  ON specification_crm_sync (last_attempt_at, created_at) WHERE status = 'pending';
