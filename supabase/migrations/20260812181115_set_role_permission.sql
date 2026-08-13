-- role_permissions currently has only a SELECT policy, so writes are denied
-- by default even for Super Admin via the anon/authenticated client. Route
-- edits through a SECURITY DEFINER function (same pattern as
-- set_account_status/set_user_role) rather than adding a broad write policy,
-- for a single auditable choke point. Super Admin only (roles.manage = all;
-- Admin's "limited" scope is read-only in the UI for now).
create or replace function public.set_role_permission(
  p_role_key text,
  p_permission_key text,
  p_scope public.permission_scope
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if public.current_user_role() <> 'super_admin' then
    raise exception 'not authorized';
  end if;

  if p_scope = 'none' then
    delete from public.role_permissions
      where role_key = p_role_key and permission_key = p_permission_key;
  else
    insert into public.role_permissions (role_key, permission_key, scope)
    values (p_role_key, p_permission_key, p_scope)
    on conflict (role_key, permission_key) do update set scope = excluded.scope;
  end if;
end;
$$;

revoke all on function public.set_role_permission(text, text, public.permission_scope) from public;
grant execute on function public.set_role_permission(text, text, public.permission_scope) to authenticated;
