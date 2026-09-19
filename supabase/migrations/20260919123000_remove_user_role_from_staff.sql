-- Keep learner role exclusive to non-staff accounts.
delete from public.user_roles ur
using public.admin_users a, public.roles r
where ur.user_id = a.user_id
  and ur.role_id = r.id
  and r.name = 'user';
