-- is_staff() was broadened in 016 to include the new 'staff' role for
-- general visibility, but set_account_status() used it too -- which would
-- have let plain Staff approve/reject other users' accounts. The matrix is
-- explicit that User Management is Admin/Super Admin only (Staff and Editor
-- are both ✗), so this checks role directly instead of the broad helper.
create or replace function public.set_account_status(p_user_id uuid, p_status public.account_status)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() not in ('admin', 'super_admin') then
    raise exception 'not authorized';
  end if;
  update public.user_roles set account_status = p_status where user_id = p_user_id;
end;
$$;
