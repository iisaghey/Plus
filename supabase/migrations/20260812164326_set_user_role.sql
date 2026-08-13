-- Role changes are Super Admin-only for now (the matrix's "Limited" role
-- management for Admin -- e.g. Admin may promote Staff to Editor but not
-- touch Admin/Super Admin -- is a scoping nuance left for a future pass;
-- restricting to Super Admin here is the safe default in the meantime).
create or replace function public.set_user_role(p_user_id uuid, p_role public.app_role)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'not authorized';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot change your own role';
  end if;
  update public.user_roles set role = p_role where user_id = p_user_id;
end;
$$;

revoke all on function public.set_user_role(uuid, public.app_role) from public;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;
