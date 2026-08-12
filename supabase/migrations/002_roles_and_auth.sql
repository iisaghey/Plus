-- user_roles: one role per platform user
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role public.app_role not null default 'profile_owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create trigger set_user_roles_updated_at
  before update on public.user_roles
  for each row execute function public.set_updated_at();

alter table public.user_roles enable row level security;

-- Role helper functions (security definer to avoid RLS recursion)
create or replace function public.current_user_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.user_roles where user_id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role in ('super_admin','admin') from public.user_roles where user_id = auth.uid()), false);
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role in ('super_admin','admin','editor','verifier') from public.user_roles where user_id = auth.uid()), false);
$$;

create or replace function public.can_edit_content()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role in ('super_admin','admin','editor') from public.user_roles where user_id = auth.uid()), false);
$$;

-- Auto-provision a profile_owner role row for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'profile_owner')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: users can see their own role; only admins can see/manage all roles
create policy "users view own role" on public.user_roles
  for select using (auth.uid() = user_id or public.is_admin());

create policy "admins manage roles" on public.user_roles
  for all using (public.is_admin()) with check (public.is_admin());
