create extension if not exists pg_trgm;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  slug text not null unique,
  full_name text not null,
  preferred_title text,
  profession text,
  current_position text,
  organization_id uuid references public.organizations(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  country text,
  location text,
  nationality text,
  photo_url text,
  cover_url text,
  short_bio text,
  email text,
  phone text,
  website text,
  social_links jsonb not null default '{}'::jsonb,
  verification_status public.verification_status not null default 'unverified',
  verified_at timestamptz,
  is_public boolean not null default true,
  view_count integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index profiles_slug_idx on public.profiles(slug);
create index profiles_category_idx on public.profiles(category_id);
create index profiles_organization_idx on public.profiles(organization_id);
create index profiles_country_idx on public.profiles(country);
create index profiles_verification_idx on public.profiles(verification_status);
create index profiles_status_idx on public.profiles(status);
create index profiles_full_name_trgm_idx on public.profiles using gin (full_name gin_trgm_ops);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create or replace function public.owns_profile(p_profile_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles where id = p_profile_id and user_id = auth.uid()
  );
$$;

create policy "read public or own or staff profiles" on public.profiles
  for select using (
    (is_public = true and status = 'active')
    or user_id = auth.uid()
    or public.is_staff()
  );

create policy "owners or staff insert profiles" on public.profiles
  for insert with check (user_id = auth.uid() or public.is_staff());

create policy "owners or staff update profiles" on public.profiles
  for update using (user_id = auth.uid() or public.is_staff())
  with check (user_id = auth.uid() or public.is_staff());

create policy "staff delete profiles" on public.profiles
  for delete using (public.is_staff());
