-- Kryzna Learn: learner engagement and exam archive foundation
-- Applied live on 2026-09-19 and kept as repository migration source.

alter table public.exams add column if not exists archived_at timestamptz null;
create index if not exists exams_archived_published_idx on public.exams (is_published, archived_at);

create table if not exists public.materi_bookmarks (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 materi_id uuid not null references public.materi(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(user_id,materi_id)
);
alter table public.materi_bookmarks enable row level security;
drop policy if exists "Users manage own material bookmarks" on public.materi_bookmarks;
create policy "Users manage own material bookmarks" on public.materi_bookmarks for all to authenticated
using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create table if not exists public.materi_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 materi_id uuid not null references public.materi(id) on delete cascade,
 rating integer not null check (rating between 1 and 5),
 comment text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(user_id,materi_id)
);
alter table public.materi_feedback enable row level security;
drop policy if exists "Users manage own material feedback" on public.materi_feedback;
create policy "Users manage own material feedback" on public.materi_feedback for all to authenticated
using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create table if not exists public.learner_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null,
 body text not null default '',
 read_at timestamptz null,
 created_at timestamptz not null default now()
);
alter table public.learner_notifications enable row level security;
drop policy if exists "Users read own notifications" on public.learner_notifications;
drop policy if exists "Users update own notifications" on public.learner_notifications;
create policy "Users read own notifications" on public.learner_notifications for select to authenticated
using ((select auth.uid())=user_id);
create policy "Users update own notifications" on public.learner_notifications for update to authenticated
using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create index if not exists materi_bookmarks_user_idx on public.materi_bookmarks(user_id,created_at desc);
create index if not exists materi_feedback_materi_idx on public.materi_feedback(materi_id);
create index if not exists learner_notifications_user_idx on public.learner_notifications(user_id,created_at desc);

grant select,insert,update,delete on public.materi_bookmarks to authenticated;
grant select,insert,update on public.materi_feedback to authenticated;
grant select,update on public.learner_notifications to authenticated;