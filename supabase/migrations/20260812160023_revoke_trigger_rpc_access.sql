-- protect_profile_verification_fields is only ever invoked by the profiles
-- update trigger; it should not be directly callable via the PostgREST RPC
-- surface (same reasoning as handle_new_user).
revoke execute on function public.protect_profile_verification_fields() from anon, authenticated;
