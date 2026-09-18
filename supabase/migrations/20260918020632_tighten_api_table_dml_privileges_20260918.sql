-- Remove authenticated DML privileges that have no corresponding RLS policy.
revoke delete on table public.materi from authenticated;
revoke update on table public.materi_versions from authenticated;
revoke delete, update on table public.content_activity_logs from authenticated;
revoke delete, insert, update on table public.permissions from authenticated;
revoke delete, insert, update on table public.roles from authenticated;
revoke delete, update on table public.system_activity_logs from authenticated;
revoke delete, insert, update on table public.user_roles from authenticated;
revoke delete, insert, update on table public.role_permissions from authenticated;
