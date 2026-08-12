insert into storage.buckets (id, name, public)
values
  ('profile-photos', 'profile-photos', true),
  ('profile-media', 'profile-media', true),
  ('qr-codes', 'qr-codes', true),
  ('profile-documents', 'profile-documents', false)
on conflict (id) do nothing;

-- Convention: object path is "<profile_id>/<filename>" so ownership can be checked
-- from the first path segment.

-- profile-photos (public bucket)
create policy "public read profile-photos" on storage.objects for select
  using (bucket_id = 'profile-photos');
create policy "owners write profile-photos" on storage.objects for insert
  with check (bucket_id = 'profile-photos' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.is_staff()));
create policy "owners update profile-photos" on storage.objects for update
  using (bucket_id = 'profile-photos' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.is_staff()));
create policy "owners delete profile-photos" on storage.objects for delete
  using (bucket_id = 'profile-photos' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.is_staff()));

-- profile-media (public bucket)
create policy "public read profile-media" on storage.objects for select
  using (bucket_id = 'profile-media');
create policy "owners write profile-media" on storage.objects for insert
  with check (bucket_id = 'profile-media' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
create policy "owners update profile-media" on storage.objects for update
  using (bucket_id = 'profile-media' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
create policy "owners delete profile-media" on storage.objects for delete
  using (bucket_id = 'profile-media' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));

-- qr-codes (public bucket)
create policy "public read qr-codes" on storage.objects for select
  using (bucket_id = 'qr-codes');
create policy "owners write qr-codes" on storage.objects for insert
  with check (bucket_id = 'qr-codes' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
create policy "owners update qr-codes" on storage.objects for update
  using (bucket_id = 'qr-codes' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));

-- profile-documents (private bucket: owner + staff only, never public)
create policy "owners read profile-documents" on storage.objects for select
  using (bucket_id = 'profile-documents' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.is_staff()));
create policy "owners write profile-documents" on storage.objects for insert
  with check (bucket_id = 'profile-documents' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
create policy "owners update profile-documents" on storage.objects for update
  using (bucket_id = 'profile-documents' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
create policy "owners delete profile-documents" on storage.objects for delete
  using (bucket_id = 'profile-documents' and (public.owns_profile((storage.foldername(name))[1]::uuid) or public.can_edit_content()));
