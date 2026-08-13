-- Account-level approval gate: new sign-ups start "pending" and cannot create
-- a profile until a staff member approves the account. Staff roles are
-- auto-approved. This is separate from profile-level verification.

create type public.account_status as enum ('pending', 'approved', 'rejected');

alter table public.user_roles
  add column account_status public.account_status not null default 'pending';

update public.user_roles
  set account_status = 'approved'
  where role in ('super_admin', 'admin', 'editor', 'verifier');

create or replace function public.is_account_approved()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select account_status = 'approved' from public.user_roles where user_id = auth.uid()),
    false
  );
$$;

-- Replace the profiles insert policy to require an approved account for
-- self-serve profile creation (staff can still create profiles for others).
drop policy "owners or staff insert profiles" on public.profiles;
create policy "approved owners or staff insert profiles" on public.profiles
  for insert with check (
    (user_id = auth.uid() and public.is_account_approved())
    or public.is_staff()
  );

-- Account approval is granted through a security-definer function rather
-- than a broad UPDATE policy, so editor/verifier staff can approve accounts
-- without gaining the ability to change anyone's role (privilege escalation).
create or replace function public.set_account_status(p_user_id uuid, p_status public.account_status)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;
  update public.user_roles set account_status = p_status where user_id = p_user_id;
end;
$$;

revoke all on function public.set_account_status(uuid, public.account_status) from public;
grant execute on function public.set_account_status(uuid, public.account_status) to authenticated;

-- Guard profile verification fields: only staff may set verification_status
-- to anything other than "pending", and only staff may set verified_at.
-- Without this, RLS alone would let an owner PATCH their own profile row
-- with verification_status = 'verified' directly via the REST API.
create or replace function public.protect_profile_verification_fields()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_staff() then
    if new.verification_status is distinct from old.verification_status
       and new.verification_status <> 'pending' then
      raise exception 'Only staff can set this verification status';
    end if;
    new.verified_at := old.verified_at;
  end if;
  return new;
end;
$$;

create trigger protect_profile_verification_fields
  before update on public.profiles
  for each row execute function public.protect_profile_verification_fields();

-- Allow profile owners to request verification (pending only, no self-grant).
create policy "owners request verification" on public.verifications
  for insert with check (
    public.owns_profile(profile_id)
    and status = 'pending'
    and identity_verified = false
    and information_reviewed = false
  );
