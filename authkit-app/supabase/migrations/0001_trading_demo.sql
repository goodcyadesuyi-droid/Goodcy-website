-- Mamba FX persistent demo-trading foundation (Supabase/Postgres)
-- Apply this migration in the database SQL editor before enabling the API routes.
create extension if not exists pgcrypto;

create table if not exists public.mfx_trading_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null unique,
  account_mode text not null default 'DEMO' check (account_mode in ('DEMO')),
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mfx_demo_trades (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.mfx_trading_accounts(id) on delete cascade,
  auth_user_id text not null,
  product text not null check (product in ('FOREX_CFD', 'FIXED_TIME_OPTIONS')),
  symbol text not null,
  side text not null check (side in ('BUY', 'SELL')),
  quantity numeric(24, 8) not null check (quantity > 0),
  reference_price numeric(24, 10) not null check (reference_price > 0),
  expiry_label text,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint mfx_demo_trades_user_id_unique unique (id, auth_user_id)
);

create index if not exists mfx_demo_trades_user_created_idx
  on public.mfx_demo_trades (auth_user_id, created_at desc);
create index if not exists mfx_demo_trades_account_status_idx
  on public.mfx_demo_trades (account_id, status);

-- This app uses a server-only Supabase service-role key after AuthKit identity
-- verification. Never expose that key to the browser. These tables intentionally
-- deny anonymous/authenticated direct table access; all access goes through
-- the authenticated Next.js server routes.
alter table public.mfx_trading_accounts enable row level security;
alter table public.mfx_demo_trades enable row level security;
revoke all on public.mfx_trading_accounts from anon, authenticated;
revoke all on public.mfx_demo_trades from anon, authenticated;
