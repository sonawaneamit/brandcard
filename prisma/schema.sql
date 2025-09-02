-- Brandcard Database Schema for Supabase
-- Run this in Supabase SQL editor

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  primary_color text default '#111111',
  secondary_color text default '#ffffff',
  font_primary_url text,
  font_secondary_url text,
  logo_url text,
  created_at timestamptz default now()
);

-- templates.fields and .default_values hold the editable schema
create table templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  width int not null,
  height int not null,
  fields jsonb not null,
  default_values jsonb,
  brand_kit_id uuid references brand_kits(id),
  is_public_form boolean default false,
  form_password_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table renders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  template_id uuid references templates(id) on delete set null,
  payload jsonb not null,
  url text not null,
  size text default 'original',
  created_at timestamptz default now()
);

create table slack_installations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  team_id text,
  team_name text,
  access_token text,
  bot_user_id text,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  stripe_customer_id text,
  stripe_sub_id text,
  plan text,
  status text,
  current_period_end timestamptz
);

-- Row Level Security (RLS) policies
alter table templates enable row level security;
create policy "own templates"
  on templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table brand_kits enable row level security;
create policy "own brand kits"
  on brand_kits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table renders enable row level security;
create policy "read own renders"
  on renders for select
  using (auth.uid() = user_id);

-- Allow public access to templates marked as public forms
create policy "public templates"
  on templates for select
  using (is_public_form = true);

-- Storage buckets
insert into storage.buckets (id, name, public) values ('renders', 'renders', true);
insert into storage.buckets (id, name, public) values ('fonts', 'fonts', true);
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Storage policies
create policy "Public renders access"
  on storage.objects for select
  using (bucket_id = 'renders');

create policy "Public fonts access"
  on storage.objects for select
  using (bucket_id = 'fonts');

create policy "Public logos access"
  on storage.objects for select
  using (bucket_id = 'logos');
