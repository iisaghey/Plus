-- Extensions
create extension if not exists pgcrypto;

-- Enums
create type public.app_role as enum ('super_admin','admin','editor','verifier','profile_owner');
create type public.record_status as enum ('draft','active','archived','pending','rejected');
create type public.verification_status as enum ('unverified','pending','verified','rejected');

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
