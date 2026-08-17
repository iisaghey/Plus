-- Staff/editors need to upload a profile photo before the profile row
-- exists (it's required at creation time), but the existing write
-- policy keys on can_edit_profile(), which needs a real profile id.
-- This adds a second insert policy scoped to the uploader's own
-- user-id folder, used only during the create flow.
create policy "staff stage profile-photos before creation"
on storage.objects for insert
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.is_staff()
);
