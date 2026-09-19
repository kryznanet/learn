-- Add notification management permission for Admin and Super Admin.
insert into public.permissions(code,label) values ('notifications.manage','Kelola Notifikasi') on conflict(code) do nothing;
insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r cross join public.permissions p
where r.name in ('admin','super_admin') and p.code='notifications.manage'
on conflict do nothing;
drop policy if exists "Managers create learner notifications" on public.learner_notifications;
create policy "Managers create learner notifications" on public.learner_notifications for insert to authenticated
with check (current_admin_role() = any(array['admin'::text,'super_admin'::text]));