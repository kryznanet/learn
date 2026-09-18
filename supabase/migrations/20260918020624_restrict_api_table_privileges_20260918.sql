-- Least-privilege API table grants for public schema.
-- RLS remains the row-level authorization boundary.
revoke all on table public.activity_logs, public.admin_users, public.content_activity_logs, public.materi, public.materi_versions, public.permissions, public.role_permissions, public.roles, public.system_activity_logs, public.user_roles from anon;
grant select on table public.materi to anon;

revoke references, trigger, truncate on table public.activity_logs, public.admin_users, public.content_activity_logs, public.materi, public.materi_versions, public.permissions, public.role_permissions, public.roles, public.system_activity_logs, public.user_roles from authenticated;
