-- Editorial workflow state, separate from the coarse `status` (active/
-- archived/...) shared by every content table. Public visibility now also
-- requires workflow_status = 'published'.
create type public.profile_workflow_status as enum (
  'draft', 'in_progress', 'submitted', 'under_review', 'changes_required',
  'editor_approved', 'admin_review', 'approved', 'verified', 'published',
  'suspended', 'archived', 'rejected'
);

alter table public.profiles
  add column workflow_status public.profile_workflow_status not null default 'draft',
  add column assigned_staff_id uuid references auth.users(id) on delete set null,
  add column assigned_editor_id uuid references auth.users(id) on delete set null,
  add column assignment_deadline date,
  add column editorial_notes text;

-- Every profile that existed before this workflow shipped (seeded demo
-- profiles, and any self-service profile already live) was already public;
-- treat it as already published rather than sending it back to draft.
update public.profiles set workflow_status = 'published' where status = 'active';

create index profiles_workflow_status_idx on public.profiles(workflow_status);
create index profiles_assigned_staff_idx on public.profiles(assigned_staff_id);
create index profiles_assigned_editor_idx on public.profiles(assigned_editor_id);

-- Public visibility now requires the profile to have actually reached
-- "published", not just is_public/status=active.
drop policy "read public or own or staff profiles" on public.profiles;
create policy "read public or own or staff profiles" on public.profiles
  for select using (
    (is_public = true and status = 'active' and workflow_status = 'published')
    or user_id = auth.uid()
    or public.is_staff()
  );

-- Audit log: add the explicit fields the spec calls for.
alter table public.audit_logs
  add column actor_role text,
  add column ip_address text,
  add column previous_value jsonb,
  add column new_value jsonb;

-- Notifications ----------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  related_profile_id uuid references public.profiles(id) on delete set null,
  action_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

create policy "users read own notifications" on public.notifications
  for select using (user_id = auth.uid());
create policy "users mark own notifications read" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "staff create notifications" on public.notifications
  for insert with check (public.is_staff());
