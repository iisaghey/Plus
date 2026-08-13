-- Admin can manage Staff/Editor role assignments (per the matrix: Manage
-- Staff = all, Manage Editors = all) but not touch Admin/Super Admin
-- accounts or grant admin-tier roles (Manage Admins = Admin:none). Super
-- Admin remains unrestricted.
create or replace function public.set_user_role(p_user_id uuid, p_role public.app_role)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_caller_role public.app_role := public.current_user_role();
  v_target_role public.app_role;
begin
  if p_user_id = auth.uid() then
    raise exception 'cannot change your own role';
  end if;

  select role into v_target_role from public.user_roles where user_id = p_user_id;

  if v_caller_role = 'super_admin' then
    null; -- unrestricted
  elsif v_caller_role = 'admin' then
    if p_role not in ('staff', 'editor', 'profile_owner') then
      raise exception 'Admins may only assign the Staff or Editor role';
    end if;
    if v_target_role in ('admin', 'super_admin') then
      raise exception 'Admins cannot change another Admin''s role';
    end if;
  else
    raise exception 'not authorized';
  end if;

  update public.user_roles set role = p_role where user_id = p_user_id;
end;
$$;
