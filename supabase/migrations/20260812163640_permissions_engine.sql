-- Permission-based RBAC engine. user_roles.role stays an enum (avoids
-- rewriting every existing FK/policy that depends on it), but the actual
-- permission catalog lives in tables so new roles (Verifier, Researcher,
-- Organization Manager, ...) can be added and wired up with plain inserts,
-- not schema migrations, per the platform's "permission-based, not
-- role-hardcoded" principle.

create table public.roles (
  key text primary key,
  label text not null,
  level integer not null,
  is_system boolean not null default true,
  description text,
  created_at timestamptz not null default now()
);

create table public.permissions (
  key text primary key,
  label text not null,
  category text not null,
  description text,
  created_at timestamptz not null default now()
);

create type public.permission_scope as enum ('none', 'assigned', 'limited', 'all');

create table public.role_permissions (
  role_key text not null references public.roles(key) on delete cascade,
  permission_key text not null references public.permissions(key) on delete cascade,
  scope public.permission_scope not null default 'all',
  primary key (role_key, permission_key)
);

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

-- The catalog is readable by any signed-in user (the UI needs it to decide
-- what to render) but only writable by Super Admin (roles.manage = all for
-- super_admin; Admin gets a read-only "limited" view per the matrix).
create policy "authenticated read roles" on public.roles for select using (auth.role() = 'authenticated');
create policy "authenticated read permissions" on public.permissions for select using (auth.role() = 'authenticated');
create policy "authenticated read role_permissions" on public.role_permissions for select using (auth.role() = 'authenticated');

-- Seed the role catalog. profile_owner and verifier are included so they
-- appear consistently in role-aware UI; profile_owner's access continues to
-- flow entirely from row ownership (owns_profile()), not this table, and
-- verifier is intentionally left with zero role_permissions rows below --
-- inert until the role is actually adopted, exactly the extensibility the
-- source spec asks for.
insert into public.roles (key, label, level, is_system, description) values
  ('profile_owner', 'Profile Owner', 0, true, 'Self-service profile subject managing their own profile.'),
  ('staff', 'Staff', 1, true, 'Collects and enters profile information.'),
  ('verifier', 'Verifier', 2, false, 'Reserved for future use.'),
  ('editor', 'Editor', 2, true, 'Reviews and improves submitted content.'),
  ('admin', 'Admin', 3, true, 'Operational management, approval, and verification.'),
  ('super_admin', 'Super Admin', 4, true, 'Full platform authority.');

insert into public.permissions (key, label, category) values
  ('profile.create', 'Create Profile', 'Content'),
  ('profile.edit', 'Edit Profile', 'Content'),
  ('profile.review', 'Review Profile', 'Content'),
  ('profile.submit', 'Submit Profile', 'Content'),
  ('content.approve', 'Approve Content', 'Content'),
  ('profile.publish', 'Publish Profile', 'Content'),
  ('profile.verify', 'Verify Profile', 'Content'),
  ('staff.manage', 'Manage Staff', 'People'),
  ('editors.manage', 'Manage Editors', 'People'),
  ('admins.manage', 'Manage Admins', 'People'),
  ('roles.manage', 'Manage Roles', 'People'),
  ('categories.manage', 'Manage Categories', 'Taxonomy'),
  ('organizations.manage', 'Manage Organizations', 'Taxonomy'),
  ('audit.view', 'View Audit Logs', 'System'),
  ('settings.system', 'System Settings', 'System'),
  ('settings.security', 'Security Settings', 'System'),
  ('database.config', 'Database Configuration', 'System'),
  ('storage.config', 'Storage Configuration', 'System'),
  ('users.manage', 'User Management', 'People'),
  ('records.delete', 'Delete Records', 'Content'),
  ('records.delete_permanent', 'Permanent Delete', 'Content'),
  ('platform.config', 'Platform Configuration', 'System');

-- The matrix, transcribed directly from the spec. "assigned"/"limited" rows
-- carry a scope that RLS and the UI can branch on; unlisted (role, permission)
-- pairs default to no access.
insert into public.role_permissions (role_key, permission_key, scope) values
  ('staff', 'profile.create', 'all'),
  ('staff', 'profile.edit', 'assigned'),
  ('staff', 'profile.submit', 'all'),
  ('staff', 'audit.view', 'limited'),
  ('staff', 'records.delete', 'limited'),

  ('editor', 'profile.create', 'all'),
  ('editor', 'profile.edit', 'all'),
  ('editor', 'profile.review', 'all'),
  ('editor', 'profile.submit', 'all'),
  ('editor', 'content.approve', 'all'),
  ('editor', 'categories.manage', 'limited'),
  ('editor', 'organizations.manage', 'limited'),
  ('editor', 'audit.view', 'limited'),
  ('editor', 'records.delete', 'limited'),

  ('admin', 'profile.create', 'all'),
  ('admin', 'profile.edit', 'all'),
  ('admin', 'profile.review', 'all'),
  ('admin', 'profile.submit', 'all'),
  ('admin', 'content.approve', 'all'),
  ('admin', 'profile.publish', 'all'),
  ('admin', 'profile.verify', 'all'),
  ('admin', 'staff.manage', 'all'),
  ('admin', 'editors.manage', 'all'),
  ('admin', 'roles.manage', 'limited'),
  ('admin', 'categories.manage', 'all'),
  ('admin', 'organizations.manage', 'all'),
  ('admin', 'audit.view', 'all'),
  ('admin', 'settings.system', 'limited'),
  ('admin', 'storage.config', 'limited'),
  ('admin', 'users.manage', 'all'),
  ('admin', 'records.delete', 'all'),
  ('admin', 'records.delete_permanent', 'limited'),

  ('super_admin', 'profile.create', 'all'),
  ('super_admin', 'profile.edit', 'all'),
  ('super_admin', 'profile.review', 'all'),
  ('super_admin', 'profile.submit', 'all'),
  ('super_admin', 'content.approve', 'all'),
  ('super_admin', 'profile.publish', 'all'),
  ('super_admin', 'profile.verify', 'all'),
  ('super_admin', 'staff.manage', 'all'),
  ('super_admin', 'editors.manage', 'all'),
  ('super_admin', 'admins.manage', 'all'),
  ('super_admin', 'roles.manage', 'all'),
  ('super_admin', 'categories.manage', 'all'),
  ('super_admin', 'organizations.manage', 'all'),
  ('super_admin', 'audit.view', 'all'),
  ('super_admin', 'settings.system', 'all'),
  ('super_admin', 'settings.security', 'all'),
  ('super_admin', 'database.config', 'all'),
  ('super_admin', 'storage.config', 'all'),
  ('super_admin', 'users.manage', 'all'),
  ('super_admin', 'records.delete', 'all'),
  ('super_admin', 'records.delete_permanent', 'all'),
  ('super_admin', 'platform.config', 'all');

-- Helper functions ------------------------------------------------------

create or replace function public.role_level(p_user_id uuid default auth.uid())
returns integer
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select r.level from public.user_roles ur join public.roles r on r.key = ur.role::text where ur.user_id = p_user_id),
    0
  );
$$;

create or replace function public.permission_scope(p_permission_key text, p_user_id uuid default auth.uid())
returns public.permission_scope
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select rp.scope
       from public.user_roles ur
       join public.role_permissions rp on rp.role_key = ur.role::text and rp.permission_key = p_permission_key
      where ur.user_id = p_user_id),
    'none'
  );
$$;

create or replace function public.has_permission(p_permission_key text, p_user_id uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.permission_scope(p_permission_key, p_user_id) <> 'none';
$$;
