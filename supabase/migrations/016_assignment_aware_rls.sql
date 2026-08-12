-- is_staff() now also recognizes the 'staff' role for broad read/visibility
-- purposes (they need to see the profiles they might work on).
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role in ('super_admin','admin','editor','verifier','staff') from public.user_roles where user_id = auth.uid()), false);
$$;

-- Profile-scoped edit check: owner, or Editor/Admin/Super Admin (full edit
-- per the matrix), or Staff but only when assigned to this specific profile.
create or replace function public.can_edit_profile(p_profile_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select
    public.owns_profile(p_profile_id)
    or public.current_user_role() in ('editor','admin','super_admin')
    or (
      public.current_user_role() = 'staff'
      and exists (
        select 1 from public.profiles p
        where p.id = p_profile_id and p.assigned_staff_id = auth.uid()
      )
    );
$$;

-- can_edit_content() (no profile argument) is now used only for global
-- content (organizations/categories), tightened to Admin+ since Editor is
-- "Limited" (read-only for now) and Staff has no access at all there.
create or replace function public.can_edit_content()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role in ('super_admin','admin') from public.user_roles where user_id = auth.uid()), false);
$$;

-- profiles: assignment-aware update, admin+-only delete -------------------
drop policy "owners or staff update profiles" on public.profiles;
create policy "editors admins or assigned staff update profiles" on public.profiles
  for update using (public.can_edit_profile(id)) with check (public.can_edit_profile(id));

drop policy "staff delete profiles" on public.profiles;
create policy "admins delete profiles" on public.profiles
  for delete using (public.current_user_role() in ('admin', 'super_admin'));

-- organizations / categories: re-scoped to the tightened can_edit_content()
drop policy "staff insert organizations" on public.organizations;
drop policy "staff update organizations" on public.organizations;
drop policy "staff delete organizations" on public.organizations;
create policy "admins insert organizations" on public.organizations for insert with check (public.can_edit_content());
create policy "admins update organizations" on public.organizations for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admins delete organizations" on public.organizations for delete using (public.can_edit_content());

drop policy "staff insert categories" on public.categories;
drop policy "staff update categories" on public.categories;
drop policy "staff delete categories" on public.categories;
create policy "admins insert categories" on public.categories for insert with check (public.can_edit_content());
create policy "admins update categories" on public.categories for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admins delete categories" on public.categories for delete using (public.can_edit_content());

-- The 9 profile-scoped content tables: replace "owns_profile or
-- can_edit_content()" with the single assignment-aware can_edit_profile().
drop policy "write biographies" on public.biographies;
drop policy "update biographies" on public.biographies;
drop policy "delete biographies" on public.biographies;
create policy "write biographies" on public.biographies for insert with check (public.can_edit_profile(profile_id));
create policy "update biographies" on public.biographies for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete biographies" on public.biographies for delete using (public.can_edit_profile(profile_id));

drop policy "write career_timeline" on public.career_timeline;
drop policy "update career_timeline" on public.career_timeline;
drop policy "delete career_timeline" on public.career_timeline;
create policy "write career_timeline" on public.career_timeline for insert with check (public.can_edit_profile(profile_id));
create policy "update career_timeline" on public.career_timeline for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete career_timeline" on public.career_timeline for delete using (public.can_edit_profile(profile_id));

drop policy "write government_positions" on public.government_positions;
drop policy "update government_positions" on public.government_positions;
drop policy "delete government_positions" on public.government_positions;
create policy "write government_positions" on public.government_positions for insert with check (public.can_edit_profile(profile_id));
create policy "update government_positions" on public.government_positions for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete government_positions" on public.government_positions for delete using (public.can_edit_profile(profile_id));

drop policy "write achievements" on public.achievements;
drop policy "update achievements" on public.achievements;
drop policy "delete achievements" on public.achievements;
create policy "write achievements" on public.achievements for insert with check (public.can_edit_profile(profile_id));
create policy "update achievements" on public.achievements for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete achievements" on public.achievements for delete using (public.can_edit_profile(profile_id));

drop policy "write official_activities" on public.official_activities;
drop policy "update official_activities" on public.official_activities;
drop policy "delete official_activities" on public.official_activities;
create policy "write official_activities" on public.official_activities for insert with check (public.can_edit_profile(profile_id));
create policy "update official_activities" on public.official_activities for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete official_activities" on public.official_activities for delete using (public.can_edit_profile(profile_id));

drop policy "write official_travel" on public.official_travel;
drop policy "update official_travel" on public.official_travel;
drop policy "delete official_travel" on public.official_travel;
create policy "write official_travel" on public.official_travel for insert with check (public.can_edit_profile(profile_id));
create policy "update official_travel" on public.official_travel for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete official_travel" on public.official_travel for delete using (public.can_edit_profile(profile_id));

drop policy "write speeches" on public.speeches;
drop policy "update speeches" on public.speeches;
drop policy "delete speeches" on public.speeches;
create policy "write speeches" on public.speeches for insert with check (public.can_edit_profile(profile_id));
create policy "update speeches" on public.speeches for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete speeches" on public.speeches for delete using (public.can_edit_profile(profile_id));

drop policy "write media" on public.media;
drop policy "update media" on public.media;
drop policy "delete media" on public.media;
create policy "write media" on public.media for insert with check (public.can_edit_profile(profile_id));
create policy "update media" on public.media for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete media" on public.media for delete using (public.can_edit_profile(profile_id));

drop policy "write documents" on public.documents;
drop policy "update documents" on public.documents;
drop policy "delete documents" on public.documents;
create policy "write documents" on public.documents for insert with check (public.can_edit_profile(profile_id));
create policy "update documents" on public.documents for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete documents" on public.documents for delete using (public.can_edit_profile(profile_id));

-- qr_profiles follows the same pattern
drop policy "write qr_profiles" on public.qr_profiles;
drop policy "update qr_profiles" on public.qr_profiles;
drop policy "delete qr_profiles" on public.qr_profiles;
create policy "write qr_profiles" on public.qr_profiles for insert with check (public.can_edit_profile(profile_id));
create policy "update qr_profiles" on public.qr_profiles for update using (public.can_edit_profile(profile_id)) with check (public.can_edit_profile(profile_id));
create policy "delete qr_profiles" on public.qr_profiles for delete using (public.can_edit_profile(profile_id));

-- storage: profile-photos/media/qr-codes/documents now key off the
-- assignment-aware can_edit_profile() using the profile id in the path,
-- instead of the old blanket is_staff()/can_edit_content().
drop policy "owners write profile-photos" on storage.objects;
drop policy "owners update profile-photos" on storage.objects;
drop policy "owners delete profile-photos" on storage.objects;
create policy "editors write profile-photos" on storage.objects for insert with check (bucket_id = 'profile-photos' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors update profile-photos" on storage.objects for update using (bucket_id = 'profile-photos' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors delete profile-photos" on storage.objects for delete using (bucket_id = 'profile-photos' and public.can_edit_profile((storage.foldername(name))[1]::uuid));

drop policy "owners write profile-media" on storage.objects;
drop policy "owners update profile-media" on storage.objects;
drop policy "owners delete profile-media" on storage.objects;
create policy "editors write profile-media" on storage.objects for insert with check (bucket_id = 'profile-media' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors update profile-media" on storage.objects for update using (bucket_id = 'profile-media' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors delete profile-media" on storage.objects for delete using (bucket_id = 'profile-media' and public.can_edit_profile((storage.foldername(name))[1]::uuid));

drop policy "owners write qr-codes" on storage.objects;
drop policy "owners update qr-codes" on storage.objects;
create policy "editors write qr-codes" on storage.objects for insert with check (bucket_id = 'qr-codes' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors update qr-codes" on storage.objects for update using (bucket_id = 'qr-codes' and public.can_edit_profile((storage.foldername(name))[1]::uuid));

drop policy "owners write profile-documents" on storage.objects;
drop policy "owners update profile-documents" on storage.objects;
drop policy "owners delete profile-documents" on storage.objects;
create policy "editors write profile-documents" on storage.objects for insert with check (bucket_id = 'profile-documents' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors update profile-documents" on storage.objects for update using (bucket_id = 'profile-documents' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
create policy "editors delete profile-documents" on storage.objects for delete using (bucket_id = 'profile-documents' and public.can_edit_profile((storage.foldername(name))[1]::uuid));
