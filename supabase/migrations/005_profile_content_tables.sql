create table public.biographies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  summary text,
  content text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.career_timeline (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  organization text,
  location text,
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

create table public.government_positions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position_title text not null,
  institution text,
  government_level text,
  country text,
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

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text,
  issuing_organization text,
  achievement_date date,
  description text,
  media_url text,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.official_activities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  activity_type text,
  activity_date date,
  location text,
  organization text,
  description text,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.official_travel (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  destination_country text not null,
  destination_city text,
  purpose text,
  delegation text,
  start_date date,
  end_date date,
  description text,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.speeches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  event text,
  speech_date date,
  location text,
  summary text,
  full_text text,
  video_url text,
  audio_url text,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image','video')),
  title text,
  caption text,
  category text,
  storage_path text,
  external_url text,
  event_date date,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text,
  issuing_organization text,
  document_date date,
  storage_path text,
  is_private boolean not null default false,
  verification_status public.verification_status not null default 'unverified',
  sort_order integer not null default 0,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- shared updated_at triggers
create trigger set_biographies_updated_at before update on public.biographies for each row execute function public.set_updated_at();
create trigger set_career_timeline_updated_at before update on public.career_timeline for each row execute function public.set_updated_at();
create trigger set_government_positions_updated_at before update on public.government_positions for each row execute function public.set_updated_at();
create trigger set_achievements_updated_at before update on public.achievements for each row execute function public.set_updated_at();
create trigger set_official_activities_updated_at before update on public.official_activities for each row execute function public.set_updated_at();
create trigger set_official_travel_updated_at before update on public.official_travel for each row execute function public.set_updated_at();
create trigger set_speeches_updated_at before update on public.speeches for each row execute function public.set_updated_at();
create trigger set_media_updated_at before update on public.media for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();

-- indexes for common lookups
create index career_timeline_profile_idx on public.career_timeline(profile_id, sort_order);
create index government_positions_profile_idx on public.government_positions(profile_id, sort_order);
create index achievements_profile_idx on public.achievements(profile_id, sort_order);
create index official_activities_profile_idx on public.official_activities(profile_id, sort_order);
create index official_travel_profile_idx on public.official_travel(profile_id, sort_order);
create index speeches_profile_idx on public.speeches(profile_id, sort_order);
create index media_profile_idx on public.media(profile_id, sort_order);
create index documents_profile_idx on public.documents(profile_id, sort_order);

alter table public.biographies enable row level security;
alter table public.career_timeline enable row level security;
alter table public.government_positions enable row level security;
alter table public.achievements enable row level security;
alter table public.official_activities enable row level security;
alter table public.official_travel enable row level security;
alter table public.speeches enable row level security;
alter table public.media enable row level security;
alter table public.documents enable row level security;
