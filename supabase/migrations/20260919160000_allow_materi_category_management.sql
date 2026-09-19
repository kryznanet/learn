-- Allow content managers to maintain category names and active state.
create policy "Content managers can update materi categories"
on public.materi_categories
for update
to authenticated
using (
  exists (
    select 1 from public.get_my_permissions() p(code)
    where p.code = 'content.manage_categories'
  )
)
with check (
  exists (
    select 1 from public.get_my_permissions() p(code)
    where p.code = 'content.manage_categories'
  )
);

create policy "Content managers can delete materi categories"
on public.materi_categories
for delete
to authenticated
using (
  exists (
    select 1 from public.get_my_permissions() p(code)
    where p.code = 'content.manage_categories'
  )
);
