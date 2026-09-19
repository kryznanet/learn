-- Allow only roles with content.delete to delete materi.
-- Current RBAC mapping grants content.delete to admin and super_admin.
create policy "Content admins can delete materi"
on public.materi
for delete
to authenticated
using (
  current_admin_role() in ('admin', 'super_admin')
);
