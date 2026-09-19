-- Allow Admin to manage learner accounts only.
insert into public.role_permissions(role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in ('users.create','users.update','users.disable')
where r.name='admin'
on conflict do nothing;