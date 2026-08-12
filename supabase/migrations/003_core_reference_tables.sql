create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  country text,
  logo_url text,
  website text,
  description text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create trigger set_organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;

create policy "public read active organizations" on public.organizations
  for select using (status = 'active' or public.is_staff());
create policy "staff insert organizations" on public.organizations
  for insert with check (public.is_staff());
create policy "staff update organizations" on public.organizations
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete organizations" on public.organizations
  for delete using (public.is_staff());

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "public read active categories" on public.categories
  for select using (status = 'active' or public.is_staff());
create policy "staff insert categories" on public.categories
  for insert with check (public.is_staff());
create policy "staff update categories" on public.categories
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete categories" on public.categories
  for delete using (public.is_staff());
