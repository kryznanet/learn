-- Kryzna Learn: exam category activation state
alter table public.exam_categories add column if not exists is_active boolean not null default true;
create index if not exists exam_categories_active_order_idx on public.exam_categories(is_active,sort_order);