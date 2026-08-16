-- Hide/soft-delete tracking columns for full Super Admin profile control.
alter table public.profiles
  add column hidden_at timestamptz null,
  add column hidden_by uuid null references auth.users(id) on delete set null,
  add column deleted_at timestamptz null,
  add column deleted_by uuid null references auth.users(id) on delete set null;

create index profiles_hidden_at_idx on public.profiles(hidden_at) where hidden_at is not null;
create index profiles_deleted_at_idx on public.profiles(deleted_at) where deleted_at is not null;

-- Public visibility now also respects hidden_at; deleted profiles ("trash")
-- are invisible to everyone except Super Admin, including their own owner
-- and assigned staff/editor -- matches "remaining accessible to the Super
-- Admin" from the spec.
drop policy "read public or own or staff profiles" on public.profiles;
create policy "read public or own or staff profiles" on public.profiles
  for select using (
    public.current_user_role() = 'super_admin'
    or (
      deleted_at is null
      and (
        (is_public = true and status = 'active' and workflow_status = 'published' and hidden_at is null)
        or user_id = auth.uid()
        or public.is_staff()
      )
    )
  );

-- Security-definer choke points for the unrestricted lifecycle actions --
-- same pattern as set_account_status()/set_user_role(): the general
-- can_edit_profile() UPDATE policy already lets Admin edit any profile
-- (by design, for normal content work), so these specific actions need
-- their own super_admin-only gate rather than relying on that policy.

create or replace function public.super_admin_set_profile_hidden(p_profile_id uuid, p_hidden boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'Only Super Admin can hide or unhide profiles.';
  end if;
  update public.profiles
  set hidden_at = case when p_hidden then now() else null end,
      hidden_by = case when p_hidden then auth.uid() else null end
  where id = p_profile_id;
end;
$$;

create or replace function public.super_admin_set_profile_verified(p_profile_id uuid, p_verified boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'Only Super Admin can verify or unverify profiles.';
  end if;
  update public.profiles
  set verification_status = case when p_verified then 'verified' else 'unverified' end,
      verified_at = case when p_verified then now() else null end
  where id = p_profile_id;
end;
$$;

create or replace function public.super_admin_set_profile_archived(p_profile_id uuid, p_archived boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'Only Super Admin can archive or restore profiles.';
  end if;
  update public.profiles
  set status = case when p_archived then 'archived' else 'active' end
  where id = p_profile_id;
end;
$$;

create or replace function public.super_admin_set_profile_deleted(p_profile_id uuid, p_deleted boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'Only Super Admin can delete or restore profiles.';
  end if;
  update public.profiles
  set deleted_at = case when p_deleted then now() else null end,
      deleted_by = case when p_deleted then auth.uid() else null end
  where id = p_profile_id;
end;
$$;

create or replace function public.super_admin_permanently_delete_profile(p_profile_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'Only Super Admin can permanently delete profiles.';
  end if;
  -- Cascades to every profile-scoped content table (biographies,
  -- career_timeline, government_positions, achievements,
  -- official_activities, official_travel, speeches, media, documents,
  -- qr_profiles, verifications) via their existing "on delete cascade" FKs.
  delete from public.profiles where id = p_profile_id;
end;
$$;
