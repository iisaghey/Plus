-- auth.users is not queryable through the client (only "public" schema is
-- exposed via PostgREST), so denormalize email onto user_roles for staff
-- screens like the account-approval queue.
alter table public.user_roles add column email text;

update public.user_roles ur
set email = u.email
from auth.users u
where u.id = ur.user_id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role, email) values (new.id, 'profile_owner', new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- All staff (not just admins) need to see the full roster to review pending
-- accounts; only admins can still change roles (see "admins manage roles").
drop policy "users view own role" on public.user_roles;
create policy "users view own role or staff view all" on public.user_roles
  for select using (auth.uid() = user_id or public.is_staff());
