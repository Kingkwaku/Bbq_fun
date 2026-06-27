-- AfriCup Backyard Challenge — Supabase schema
-- ---------------------------------------------------------------------------
-- Paste this whole file into the Supabase SQL editor and run it once.
-- It creates the two tables the app expects, enables realtime, and sets up
-- permissive policies suitable for a low-stakes backyard family party.
--
-- The app auto-detects Supabase via VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
-- (see .env.example). Without those it runs in single-device localStorage mode.
-- ---------------------------------------------------------------------------

-- Players ---------------------------------------------------------------------
-- `scores` is a JSON object keyed by game id, e.g. {"bucket-toss": 8, ...}.
create table if not exists public.players (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  team       text not null default 'neutral'
             check (team in ('ghana', 'nigeria', 'neutral')),
  scores     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Game state ------------------------------------------------------------------
-- Single-row table. The app upserts using a fixed row id = 1, so we pin it.
create table if not exists public.game_state (
  id              int primary key default 1 check (id = 1),
  last_updated_by text,
  last_updated_at timestamptz
);

-- Seed the single game_state row so the first upsert has a row to update.
insert into public.game_state (id) values (1)
  on conflict (id) do nothing;

-- Row Level Security ----------------------------------------------------------
-- NOTE / TRADE-OFF: these policies allow the anonymous (anon) key to read AND
-- write everything. That's intentional for a fun, low-stakes backyard party —
-- there's no sensitive data and the admin passcode is just a UX gate. Anyone
-- with the URL could technically write. For anything beyond a family BBQ,
-- tighten these (e.g. require auth, or restrict writes via an edge function).
alter table public.players enable row level security;
alter table public.game_state enable row level security;

-- Players: open select/insert/update/delete for anon.
drop policy if exists "players_anon_all" on public.players;
create policy "players_anon_all" on public.players
  for all to anon
  using (true)
  with check (true);

-- Game state: open select/insert/update/delete for anon.
drop policy if exists "game_state_anon_all" on public.game_state;
create policy "game_state_anon_all" on public.game_state
  for all to anon
  using (true)
  with check (true);

-- Realtime --------------------------------------------------------------------
-- Add both tables to the realtime publication so every phone sees live updates.
alter publication supabase_realtime add table public.players, public.game_state;

-- Optional seed ---------------------------------------------------------------
-- Uncomment to drop in the 6 sample players (3 per family) for a quick demo.
-- insert into public.players (name, team) values
--   ('Kwame',        'ghana'),
--   ('Ama',          'ghana'),
--   ('Uncle Kofi',   'ghana'),
--   ('Chinedu',      'nigeria'),
--   ('Ifeoma',       'nigeria'),
--   ('Auntie Ngozi', 'nigeria');
