-- Standalone: Postgres requires a new enum value to be committed before it
-- can be referenced, so this is applied as its own migration.
alter type public.app_role add value 'staff';
