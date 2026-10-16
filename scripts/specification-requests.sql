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
