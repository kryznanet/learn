-- Restrict direct user_roles writes to Super Admin.
-- Admin may read user-role assignments but cannot create, update, or delete roles directly.

DROP POLICY IF EXISTS "Admins manage user roles" ON public.user_roles;

CREATE POLICY "Super admins manage user roles"
ON public.user_roles
AS PERMISSIVE
FOR ALL
TO authenticated
USING (current_admin_role() = 'super_admin')
WITH CHECK (current_admin_role() = 'super_admin');
