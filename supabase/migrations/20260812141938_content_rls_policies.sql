-- Standard content-table policy pattern: public can read active content on public/active
-- profiles; the profile owner and staff (admin/editor) can always read/write their own.
-- Verifiers get read via is_staff() but writes are gated by can_edit_content().

create policy "read biographies" on public.biographies for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write biographies" on public.biographies for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update biographies" on public.biographies for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete biographies" on public.biographies for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read career_timeline" on public.career_timeline for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write career_timeline" on public.career_timeline for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update career_timeline" on public.career_timeline for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete career_timeline" on public.career_timeline for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read government_positions" on public.government_positions for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write government_positions" on public.government_positions for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update government_positions" on public.government_positions for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete government_positions" on public.government_positions for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read achievements" on public.achievements for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write achievements" on public.achievements for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update achievements" on public.achievements for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete achievements" on public.achievements for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read official_activities" on public.official_activities for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write official_activities" on public.official_activities for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update official_activities" on public.official_activities for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete official_activities" on public.official_activities for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read official_travel" on public.official_travel for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write official_travel" on public.official_travel for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update official_travel" on public.official_travel for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete official_travel" on public.official_travel for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read speeches" on public.speeches for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write speeches" on public.speeches for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update speeches" on public.speeches for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete speeches" on public.speeches for delete using (public.owns_profile(profile_id) or public.can_edit_content());

create policy "read media" on public.media for select using (
  (status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write media" on public.media for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update media" on public.media for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete media" on public.media for delete using (public.owns_profile(profile_id) or public.can_edit_content());

-- Documents: private documents are only visible to the owner and staff, never the public
create policy "read documents" on public.documents for select using (
  (is_private = false and status = 'active' and exists (select 1 from public.profiles p where p.id = profile_id and p.is_public and p.status = 'active'))
  or public.owns_profile(profile_id) or public.is_staff());
create policy "write documents" on public.documents for insert with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "update documents" on public.documents for update using (public.owns_profile(profile_id) or public.can_edit_content()) with check (public.owns_profile(profile_id) or public.can_edit_content());
create policy "delete documents" on public.documents for delete using (public.owns_profile(profile_id) or public.can_edit_content());
