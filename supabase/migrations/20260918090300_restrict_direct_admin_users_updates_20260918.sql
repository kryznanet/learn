-- Prevent direct admin_users writes from bypassing protected staff-management RPCs.
-- Staff profile/role/active changes must flow through update_staff(), which enforces
-- the role-management authorization and keeps admin_users/user_roles synchronized.

DROP POLICY IF EXISTS "Staff managers can update staff profile" ON public.admin_users;
DROP POLICY IF EXISTS "Users can update own display name" ON public.admin_users;
