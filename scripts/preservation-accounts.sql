-- Self-service optical preservation accounts.
-- One row per signup. Each Cloutility ID column is filled in as its provisioning
-- step succeeds, so a retried provisioning run resumes where it stopped.
CREATE TABLE IF NOT EXISTS preservation_accounts (
  id uuid PRIMARY KEY,
  status text NOT NULL CHECK (status IN (
    'pending_payment', -- checkout started, not paid yet
    'paid',            -- payment confirmed, waiting to provision
    'provisioning',    -- a provisioning run holds the claim
    'active',          -- fully provisioned
    'failed',          -- last provisioning run failed; retry picks it up
    'past_due',        -- Stripe reports a failed renewal payment
    'canceled'         -- subscription ended; data is retained until a deletion request completes
  )),
  tier text NOT NULL,
  included_tb integer NOT NULL CHECK (included_tb > 0),
  name varchar(150) NOT NULL,
  organization varchar(200) NOT NULL,
  email varchar(254) NOT NULL,
  phone varchar(40),
  terms_accepted_at timestamptz NOT NULL,

  stripe_checkout_session_id text UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,

  cloutility_bunit_id integer,
  cloutility_contract_erp_reference text UNIQUE,
  cloutility_user_id integer,
  cloutility_orain_user_id integer,
  cloutility_consumer_id integer,
  cloutility_bucket_created boolean NOT NULL DEFAULT false,

  provisioning_attempts integer NOT NULL DEFAULT 0,
  provisioning_started_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  paid_at timestamptz,
  activated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS preservation_accounts_needs_provisioning
  ON preservation_accounts (updated_at) WHERE status IN ('paid', 'failed', 'provisioning');

-- Monthly usage charges added to Stripe, keyed by Cloutility billing line, so a
-- re-sent billing-data notification never bills twice.
CREATE TABLE IF NOT EXISTS preservation_usage_charges (
  identifier text PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES preservation_accounts (id),
  invoice_date date NOT NULL,
  total_tb integer NOT NULL CHECK (total_tb > 0),
  plan_tier text NOT NULL,
  effective_tier text NOT NULL,
  amount_cents integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT NOW()
);

-- Storage use (decides the Stripe product and tax code) and US sales tax
-- exemption requests. An account with tax_exempt_status = 'requested' stays
-- in pending_payment, without a checkout session, until staff review it.
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS use_case text;
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_exempt_status text NOT NULL DEFAULT 'none'
  CHECK (tax_exempt_status IN ('none', 'requested', 'approved', 'declined'));
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_exempt_type text;
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_exempt_state char(2);
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_exempt_number varchar(40);
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_exempt_reviewed_at timestamptz;
-- Stripe file ID of the exemption certificate uploaded at signup (also in the
-- Stripe customer's metadata).
ALTER TABLE preservation_accounts ADD COLUMN IF NOT EXISTS tax_certificate_file_id text;
-- Organization is optional at signup; accountName() falls back to the name.
ALTER TABLE preservation_accounts ALTER COLUMN organization DROP NOT NULL;
