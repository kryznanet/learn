-- Restrict SECURITY DEFINER helpers that are not direct application RPCs.
-- These helpers are used by database authorization/RLS or are legacy/internal
-- and should not be exposed through the authenticated PostgREST API.

REVOKE EXECUTE ON FUNCTION public.can_manage_materi(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_delete_materi(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_my_role(uuid) FROM PUBLIC, anon, authenticated;
