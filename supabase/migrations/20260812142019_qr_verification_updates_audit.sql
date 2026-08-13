create table public.qr_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  qr_storage_path text,
  scan_count integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create trigger set_qr_profiles_updated_at before update on public.qr_profiles for each row execute function public.set_updated_at();
alter table public.qr_profiles enable row level security;

create policy "read qr_profiles" on public.qr_profiles for select using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active')
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write qr_profiles" on public.qr_profiles for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update qr_profiles" on public.qr_profiles for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete qr_profiles" on public.qr_profiles for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  verifier_id uuid references auth.users(id),
  identity_verified boolean not null default false,
  information_reviewed boolean not null default false,
  status public.verification_status not null default 'pending',
  notes text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create trigger set_verifications_updated_at before update on public.verifications for each row execute function public.set_updated_at();
create index verifications_profile_idx on public.verifications(profile_id);
alter table public.verifications enable row level security;

create policy "owners view own verifications" on public.verifications for select using (public.owns_profile(profile_id) or public.is_staff());
create policy "verifiers manage verifications" on public.verifications for insert with check (public.current_user_role() in ('super_admin','admin','verifier'));
create policy "verifiers update verifications" on public.verifications for update using (public.current_user_role() in ('super_admin','admin','verifier')) with check (public.current_user_role() in ('super_admin','admin','verifier'));
create policy "admins delete verifications" on public.verifications for delete using (public.is_admin());

create table public.profile_updates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  section text not null,
  change_summary text,
  old_data jsonb,
  new_data jsonb,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create trigger set_profile_updates_updated_at before update on public.profile_updates for each row execute function public.set_updated_at();
create index profile_updates_profile_idx on public.profile_updates(profile_id, created_at desc);
alter table public.profile_updates enable row level security;

create policy "read profile_updates" on public.profile_updates for select using (public.owns_profile(profile_id) or public.is_staff());
create policy "write profile_updates" on public.profile_updates for insert with check (public.owns_profile(profile_id) or public.is_staff());

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index audit_logs_actor_idx on public.audit_logs(actor_id);
alter table public.audit_logs enable row level security;

-- Audit logs are written by trusted server-side code using the service role (which
-- bypasses RLS); only admins may read them from the client.
create policy "admins read audit_logs" on public.audit_logs for select using (public.is_admin());
