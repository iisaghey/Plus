-- Education section (new — no prior table existed for this).
create table public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create trigger set_education_updated_at before update on public.education
  for each row execute function public.set_updated_at();

create index education_profile_idx on public.education(profile_id, sort_order);

alter table public.education enable row level security;

create policy "read education" on public.education
for select using (
  (status = 'active' and exists (
    select 1 from public.profiles p
    where p.id = education.profile_id and p.is_public and p.status = 'active'
  ))
  or public.owns_profile(profile_id)
  or public.is_staff()
);

create policy "write education" on public.education
for insert with check (public.can_edit_profile(profile_id));

create policy "update education" on public.education
for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));

create policy "delete education" on public.education
for delete using (public.can_edit_profile(profile_id));

-- Richer file metadata (name, size, MIME type) so the upload UI can show
-- real file info instead of just a bare URL, and so media can include
-- document-type uploads alongside photos/videos. Widen the constraint
-- before migrating 'image' -> 'photo' (the old constraint would reject
-- 'photo' rows), then tighten it back once no 'image' rows remain.
alter table public.media
  drop constraint if exists media_media_type_check,
  add constraint media_media_type_check check (media_type in ('image','photo','video','document')),
  add column if not exists file_name text,
  add column if not exists file_size bigint,
  add column if not exists mime_type text;

update public.media set media_type = 'photo' where media_type = 'image';

alter table public.media
  drop constraint media_media_type_check,
  add constraint media_media_type_check check (media_type in ('photo','video','document'));

alter table public.documents
  add column if not exists file_name text,
  add column if not exists file_size bigint,
  add column if not exists mime_type text;

-- Speeches currently only stores a single video_url/audio_url text field
-- each — no real file upload, and no support for multiple attachments per
-- speech (video + photos + a PDF transcript + an audio recording, all at
-- once). A child table matches the "one or multiple files" requirement the
-- same way media/documents already do.
create table public.speech_attachments (
  id uuid primary key default gen_random_uuid(),
  speech_id uuid not null references public.speeches(id) on delete cascade,
  file_type text not null check (file_type in ('video','photo','document','audio')),
  storage_path text not null,
  file_name text,
  file_size bigint,
  mime_type text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index speech_attachments_speech_idx on public.speech_attachments(speech_id, sort_order);

alter table public.speech_attachments enable row level security;

create policy "read speech_attachments" on public.speech_attachments
for select using (
  exists (
    select 1 from public.speeches s
    join public.profiles p on p.id = s.profile_id
    where s.id = speech_attachments.speech_id
      and (
        (s.status = 'active' and p.is_public and p.status = 'active')
        or public.owns_profile(s.profile_id)
        or public.is_staff()
      )
  )
);

create policy "write speech_attachments" on public.speech_attachments
for insert with check (
  exists (
    select 1 from public.speeches s
    where s.id = speech_attachments.speech_id and public.can_edit_profile(s.profile_id)
  )
);

create policy "delete speech_attachments" on public.speech_attachments
for delete using (
  exists (
    select 1 from public.speeches s
    where s.id = speech_attachments.speech_id and public.can_edit_profile(s.profile_id)
  )
);

-- profile-media storage already keys on <profile_id>/... via can_edit_profile,
-- which speech attachments reuse directly since they hang off a profile too.
