-- Published Profile Edit Permission System: once a profile is published,
-- Editors lose unconditional edit access (Admin/Super Admin keep theirs)
-- and must request, then be granted, permission by Super Admin.

create type public.edit_request_status as enum ('pending', 'more_info_requested', 'approved', 'rejected');
create type public.edit_grant_type as enum ('one_time', 'time_limited', 'full');

create table public.edit_permission_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  editor_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  fields_requested text[] not null default '{}',
  description text,
  supporting_document_path text,
  status public.edit_request_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_edit_permission_requests_updated_at
  before update on public.edit_permission_requests
  for each row execute function public.set_updated_at();

create index edit_permission_requests_profile_idx on public.edit_permission_requests(profile_id);
create index edit_permission_requests_editor_idx on public.edit_permission_requests(editor_id);
create index edit_permission_requests_status_idx on public.edit_permission_requests(status);

create table public.edit_permission_grants (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.edit_permission_requests(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  editor_id uuid not null references auth.users(id) on delete cascade,
  grant_type public.edit_grant_type not null default 'one_time',
  allowed_fields text[],
  expires_at timestamptz,
  used_at timestamptz,
  revoked_at timestamptz,
  snapshot_before jsonb,
  granted_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index edit_permission_grants_active_idx
  on public.edit_permission_grants (profile_id, editor_id)
  where revoked_at is null;

alter table public.edit_permission_requests enable row level security;
alter table public.edit_permission_grants enable row level security;

create policy "editors read own requests, staff read all" on public.edit_permission_requests
  for select using (editor_id = auth.uid() or public.is_staff());

create policy "editors create own requests" on public.edit_permission_requests
  for insert with check (editor_id = auth.uid() and public.current_user_role() = 'editor');

create policy "super admin reviews requests" on public.edit_permission_requests
  for update using (public.current_user_role() = 'super_admin')
  with check (public.current_user_role() = 'super_admin');

create policy "editors read own grants, staff read all" on public.edit_permission_grants
  for select using (editor_id = auth.uid() or public.is_staff());

create policy "super admin creates grants" on public.edit_permission_grants
  for insert with check (public.current_user_role() = 'super_admin');

create policy "super admin updates grants" on public.edit_permission_grants
  for update using (public.current_user_role() = 'super_admin')
  with check (public.current_user_role() = 'super_admin');

-- Dedicated private bucket for request supporting documents: an editor
-- requesting permission on a published profile doesn't have edit access
-- yet, so this can't key off can_edit_profile() like profile-documents
-- does. Path convention "<user_id>/<filename>" instead of profile_id.
insert into storage.buckets (id, name, public)
values ('edit-request-documents', 'edit-request-documents', false)
on conflict (id) do nothing;

create policy "editors upload own request documents" on storage.objects
  for insert with check (
    bucket_id = 'edit-request-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owners and staff read request documents" on storage.objects
  for select using (
    bucket_id = 'edit-request-documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
  );

-- can_edit_profile(): Admin/Super Admin keep unconditional access. Editor
-- keeps free access to profiles that aren't published yet (their normal
-- editorial workflow), but on a published profile now needs an active,
-- unrevoked, unexpired, not-already-consumed grant.
create or replace function public.can_edit_profile(p_profile_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select
    exists (
      select 1 from public.profiles p
      where p.id = p_profile_id
        and p.user_id = auth.uid()
        and p.workflow_status in ('draft', 'in_progress', 'changes_required', 'rejected')
    )
    or public.current_user_role() in ('admin', 'super_admin')
    or (
      public.current_user_role() = 'editor'
      and exists (
        select 1 from public.profiles p
        where p.id = p_profile_id
          and (
            p.workflow_status <> 'published'
            or exists (
              select 1 from public.edit_permission_grants g
              where g.profile_id = p_profile_id
                and g.editor_id = auth.uid()
                and g.revoked_at is null
                and (g.expires_at is null or g.expires_at > now())
                and (g.grant_type <> 'one_time' or g.used_at is null)
            )
          )
      )
    )
    or (
      public.current_user_role() = 'staff'
      and exists (
        select 1 from public.profiles p
        where p.id = p_profile_id and p.assigned_staff_id = auth.uid()
      )
    );
$$;

comment on function public.can_edit_profile(uuid) is
  'Owner: locked once submitted (see lock_owner_edits_by_workflow_status). Editor: unconditional except on published profiles, which require an active edit_permission_grants row (see published_profile_edit_permissions). Admin/Super Admin/assigned Staff: unaffected by either lock.';

-- Enforces field-scope on grants that restrict allowed_fields, consumes
-- one_time grants, and forces an editor''s edit to a published profile
-- into admin_review instead of silently staying "published" with
-- unreviewed changes already live (public visibility already requires
-- workflow_status = ''published'', so this also pulls it from public view
-- for the duration of the review).
create or replace function public.enforce_editor_published_edit()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_grant record;
  v_editable_cols text[] := array[
    'full_name','preferred_title','profession','current_position',
    'category_id','organization_id','country','location','nationality',
    'short_bio','email','website','photo_url','cover_url','phone','social_links'
  ];
  v_old_json jsonb;
  v_new_json jsonb;
  v_key text;
begin
  if public.current_user_role() <> 'editor' or OLD.workflow_status <> 'published' then
    return NEW;
  end if;

  select * into v_grant
  from public.edit_permission_grants g
  where g.profile_id = OLD.id
    and g.editor_id = auth.uid()
    and g.revoked_at is null
    and (g.expires_at is null or g.expires_at > now())
    and (g.grant_type <> 'one_time' or g.used_at is null)
  order by g.created_at desc
  limit 1;

  if v_grant.id is null then
    raise exception 'You need Super Admin permission to edit a published profile.';
  end if;

  if v_grant.allowed_fields is not null then
    v_old_json := to_jsonb(OLD);
    v_new_json := to_jsonb(NEW);
    foreach v_key in array v_editable_cols loop
      if v_old_json -> v_key is distinct from v_new_json -> v_key
         and not (v_key = any(v_grant.allowed_fields)) then
        raise exception 'You are only permitted to edit: %', array_to_string(v_grant.allowed_fields, ', ');
      end if;
    end loop;
  end if;

  update public.edit_permission_grants
  set used_at = case when v_grant.grant_type = 'one_time' then now() else used_at end
  where id = v_grant.id;

  NEW.workflow_status := 'admin_review';

  return NEW;
end;
$$;

create trigger enforce_editor_published_edit
  before update on public.profiles
  for each row execute function public.enforce_editor_published_edit();
