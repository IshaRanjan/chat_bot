-- SecureBank FAQ Chatbot — PostgreSQL schema for Supabase
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Extensions (uuid generation)
create extension if not exists "pgcrypto";

-- Categories (top-level topics: Cards, Accounts, Loans, etc.)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Subcategories (e.g. Credit Cards under Cards)
create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (category_id, name)
);

-- FAQs (question + answer per subcategory)
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.subcategories (id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  unique (subcategory_id, question)
);

-- Indexes for API lookups
create index if not exists idx_subcategories_category_id
  on public.subcategories (category_id);

create index if not exists idx_faqs_subcategory_id
  on public.faqs (subcategory_id);

-- Row Level Security (public read for FAQ content)
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.faqs enable row level security;

create policy "Allow public read on categories"
  on public.categories for select
  using (true);

create policy "Allow public read on subcategories"
  on public.subcategories for select
  using (true);

create policy "Allow public read on faqs"
  on public.faqs for select
  using (true);

-- Optional: restrict writes to service role only (no insert policies for anon)
