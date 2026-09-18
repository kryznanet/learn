-- Align the RPC authorization with the RBAC contract:
-- only Super Admin may mutate staff profile, role, or active state.

CREATE OR REPLACE FUNCTION public.update_staff(
  p_user_id uuid,
  p_display_name text,
  p_role text,
  p_active boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  actor_role text := public.current_admin_role();
  clean_role text := lower(trim(p_role));
  active_super_count integer;
  old_role text;
  old_active boolean;
  old_name text;
  role_id uuid;
begin
  if actor_role <> 'super_admin' then
    raise exception 'Hanya Super Admin yang dapat mengubah user staf.';
  end if;

  if clean_role not in ('super_admin', 'admin', 'penulis', 'editor', 'viewer') then
    raise exception 'Role tidak valid';
  end if;

  select role, active, display_name
    into old_role, old_active, old_name
  from public.admin_users
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'User staf tidak ditemukan';
  end if;

  if p_user_id = auth.uid()
     and (clean_role <> 'super_admin' or p_active = false) then
    raise exception 'Super Admin aktif tidak boleh menonaktifkan atau menurunkan role sendiri.';
  end if;

  if clean_role <> 'super_admin' or p_active = false then
    select count(*)
      into active_super_count
    from public.admin_users
    where role = 'super_admin'
      and active = true
      and user_id <> p_user_id;

    if active_super_count = 0 then
      raise exception 'Minimal harus ada satu Super Admin aktif.';
    end if;
  end if;

  update public.admin_users
  set display_name = coalesce(p_display_name, ''),
      role = clean_role,
      active = p_active
  where user_id = p_user_id;

  delete from public.user_roles
  where user_id = p_user_id;

  if clean_role <> 'viewer' then
    select id
      into role_id
    from public.roles
    where name = clean_role
    limit 1;

    if role_id is null then
      raise exception 'Role RBAC tidak ditemukan';
    end if;

    insert into public.user_roles(user_id, role_id)
    values (p_user_id, role_id);
  end if;

  insert into public.system_activity_logs(
    actor_user_id,
    action,
    entity_type,
    entity_id,
    description,
    metadata
  )
  values (
    auth.uid(),
    'user_updated',
    'admin_user',
    p_user_id,
    'Profil, role, atau status user diperbarui',
    jsonb_build_object(
      'old_role', old_role,
      'new_role', clean_role,
      'old_active', old_active,
      'new_active', p_active
    )
  );

  return json_build_object('ok', true);
end;
$function$;
