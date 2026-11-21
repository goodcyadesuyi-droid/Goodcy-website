-- Mamba FX Academy platform services foundation.
-- Run with the Supabase SQL editor/migration runner. Do not expose service-role keys to browsers.
create extension if not exists pgcrypto;

create table if not exists public.mfx_platform_flags (
  flag_key text primary key,
  enabled boolean not null default false,
  updated_by text,
  updated_at timestamptz not null default now()
);

insert into public.mfx_platform_flags(flag_key,enabled) values
 ('broker_connections',false),('auto_trading',false),('nano_ai',false),
 ('agi_os_actions',false),('live_execution',false),('live_options',false)
on conflict (flag_key) do nothing;

create table if not exists public.mfx_broker_connections (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null,
  provider_id text not null,
  provider_account_ref text,
  connection_status text not null default 'PENDING'
    check (connection_status in ('PENDING','SANDBOX','ACTIVE','REVOKED','ERROR')),
  credential_secret_ref text,
  scopes text[] not null default '{}',
  region_code text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(auth_user_id,provider_id,provider_account_ref)
);
comment on column public.mfx_broker_connections.credential_secret_ref is
 'Reference to a managed secret; never store raw passwords, access tokens or refresh tokens here.';

create table if not exists public.mfx_automation_settings (
  auth_user_id text primary key,
  enabled boolean not null default false,
  environment text not null default 'DEMO' check(environment in ('DEMO','LIVE')),
  strategy_id text,
  max_risk_bps integer not null default 100 check(max_risk_bps between 1 and 500),
  max_daily_loss_bps integer not null default 200 check(max_daily_loss_bps between 1 and 1000),
  max_open_positions integer not null default 1 check(max_open_positions between 1 and 50),
  kill_switch boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.mfx_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null,
  mode text not null default 'ASK_ONLY' check(mode in ('ASK_ONLY','PRO_ASSIST')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mfx_ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.mfx_ai_conversations(id) on delete cascade,
  auth_user_id text not null,
  role text not null check(role in ('USER','ASSISTANT','SYSTEM')),
  content text not null check(char_length(content) between 1 and 12000),
  created_at timestamptz not null default now()
);

create table if not exists public.mfx_ai_action_requests (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null,
  action_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'AWAITING_APPROVAL'
    check(status in ('AWAITING_APPROVAL','APPROVED','REJECTED','EXECUTED','FAILED','CANCELLED')),
  approved_at timestamptz,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mfx_admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text not null,
  actor_email text not null,
  action text not null,
  target_user_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mfx_broker_connections_user_idx on public.mfx_broker_connections(auth_user_id);
create index if not exists mfx_ai_messages_user_created_idx on public.mfx_ai_messages(auth_user_id,created_at desc);
create index if not exists mfx_ai_actions_user_created_idx on public.mfx_ai_action_requests(auth_user_id,created_at desc);
create index if not exists mfx_admin_audit_created_idx on public.mfx_admin_audit_events(created_at desc);

-- All writes/reads must go through authenticated server routes using the service role.
-- Browser roles receive no direct access to platform secrets, admin audit events or action queues.
alter table public.mfx_platform_flags enable row level security;
alter table public.mfx_broker_connections enable row level security;
alter table public.mfx_automation_settings enable row level security;
alter table public.mfx_ai_conversations enable row level security;
alter table public.mfx_ai_messages enable row level security;
alter table public.mfx_ai_action_requests enable row level security;
alter table public.mfx_admin_audit_events enable row level security;

revoke all on public.mfx_platform_flags, public.mfx_broker_connections,
 public.mfx_automation_settings, public.mfx_ai_conversations, public.mfx_ai_messages,
 public.mfx_ai_action_requests, public.mfx_admin_audit_events from anon, authenticated;
grant all on public.mfx_platform_flags, public.mfx_broker_connections,
 public.mfx_automation_settings, public.mfx_ai_conversations, public.mfx_ai_messages,
 public.mfx_ai_action_requests, public.mfx_admin_audit_events to service_role;
