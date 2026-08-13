-- Pin search_path on the shared trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Move pg_trgm out of the public schema per Supabase lint guidance
create schema if not exists extensions;
alter extension pg_trgm set schema extensions;

-- handle_new_user is only ever invoked by the auth.users trigger; it should not be
-- directly callable via the PostgREST RPC surface.
revoke execute on function public.handle_new_user() from anon, authenticated;
