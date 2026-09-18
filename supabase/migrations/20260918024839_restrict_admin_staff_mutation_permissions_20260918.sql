-- Align staff-management permissions with backend authorization.
-- Admin may read staff, but staff mutation remains Super Admin-only via update_staff().

DELETE FROM public.role_permissions
WHERE role_id = (SELECT id FROM public.roles WHERE name = 'admin')
  AND permission_id IN (
    SELECT id FROM public.permissions
    WHERE code IN ('users.update', 'users.disable')
  );
