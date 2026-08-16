-- Lock self-service owner edits once a profile leaves their hands: after
-- submitting for review, and for the lifetime of an already-published
-- profile, the owner can no longer edit it directly. Editor/Admin/Super
-- Admin and any Staff member assigned to the profile are unaffected --
-- they need full edit access precisely during those states to do reviews,
-- corrections, and publish-time fixes.
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
    or public.current_user_role() in ('editor', 'admin', 'super_admin')
    or (
      public.current_user_role() = 'staff'
      and exists (
        select 1 from public.profiles p
        where p.id = p_profile_id and p.assigned_staff_id = auth.uid()
      )
    );
$$;

comment on function public.can_edit_profile(uuid) is
  'Owner edits are locked once a profile leaves draft/changes_required/rejected (i.e. once submitted, under review, approved, verified, or published). Editor/Admin/Super Admin and assigned Staff are unaffected by this lock.';
