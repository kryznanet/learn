create table if not exists public.materi_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists materi_categories_name_unique
  on public.materi_categories (lower(btrim(name)));

alter table public.materi_categories enable row level security;

drop policy if exists "Public can read active materi categories" on public.materi_categories;
create policy "Public can read active materi categories"
on public.materi_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Content managers can create materi categories" on public.materi_categories;
create policy "Content managers can create materi categories"
on public.materi_categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.get_my_permissions() p
    where p.code = 'content.manage_categories'
  )
);

insert into public.materi_categories (name)
select kategori
from (
  select distinct btrim(kategori) as kategori
  from public.materi
  where btrim(kategori) <> ''
) s
on conflict do nothing;
