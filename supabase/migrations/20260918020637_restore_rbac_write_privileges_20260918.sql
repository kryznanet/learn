-- role_permissions and user_roles both expose intentional Super Admin RLS write paths.
grant delete, insert, update on table public.role_permissions to authenticated;
grant delete, insert, update on table public.user_roles to authenticated;
