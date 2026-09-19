-- Ensure staff records never retain the ordinary learner role.
create or replace function public.remove_learner_role_from_staff()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.user_roles ur
  using public.roles r
  where ur.user_id = new.user_id
    and ur.role_id = r.id
    and r.name = 'user';
  return new;
end;
$$;

revoke all on function public.remove_learner_role_from_staff() from public, anon, authenticated;

drop trigger if exists trg_remove_learner_role_from_staff on public.admin_users;
create trigger trg_remove_learner_role_from_staff
after insert or update of user_id, role, active on public.admin_users
for each row
execute function public.remove_learner_role_from_staff();
