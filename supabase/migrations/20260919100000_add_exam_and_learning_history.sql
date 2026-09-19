-- Online Exam + Learning History
create table if not exists public.exam_categories (
 id uuid primary key default gen_random_uuid(), name text not null unique, label text not null,
 description text not null default '', sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.exams (
 id uuid primary key default gen_random_uuid(), category_id uuid not null references public.exam_categories(id) on delete restrict,
 title text not null, description text not null default '', duration_minutes integer not null default 30 check(duration_minutes between 5 and 180),
 passing_score integer not null default 70 check(passing_score between 0 and 100), is_published boolean not null default false,
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(category_id,title)
);
create table if not exists public.exam_questions (
 id uuid primary key default gen_random_uuid(), exam_id uuid not null references public.exams(id) on delete cascade,
 materi_id uuid references public.materi(id) on delete set null, question_code text not null unique, question_text text not null,
 explanation text not null default '', difficulty text not null default 'medium' check(difficulty in('easy','medium','hard')),
 points integer not null default 1 check(points>0 and points<=100), sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.exam_question_options (
 id uuid primary key default gen_random_uuid(), question_id uuid not null references public.exam_questions(id) on delete cascade,
 option_key text not null check(option_key in('A','B','C','D')), option_text text not null, sort_order integer not null default 0,
 unique(question_id,option_key)
);
create table if not exists public.exam_answer_keys (
 question_id uuid primary key references public.exam_questions(id) on delete cascade,
 correct_option_id uuid not null references public.exam_question_options(id) on delete restrict
);
create table if not exists public.exam_attempts (
 id uuid primary key default gen_random_uuid(), exam_id uuid not null references public.exams(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete cascade, started_at timestamptz not null default now(),
 submitted_at timestamptz, score numeric(5,2), correct_count integer, total_questions integer not null,
 passed boolean, status text not null default 'in_progress' check(status in('in_progress','submitted','expired','cancelled')), unique(id,user_id)
);
create table if not exists public.exam_answers (
 id uuid primary key default gen_random_uuid(), attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
 question_id uuid not null references public.exam_questions(id) on delete restrict, selected_option_id uuid references public.exam_question_options(id) on delete restrict,
 answered_at timestamptz not null default now(), unique(attempt_id,question_id)
);
create table if not exists public.material_reading_history (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 materi_id uuid not null references public.materi(id) on delete cascade, status text not null default 'in_progress' check(status in('in_progress','completed')),
 first_read_at timestamptz not null default now(), last_read_at timestamptz not null default now(), completed_at timestamptz,
 visit_count integer not null default 1 check(visit_count>=1), unique(user_id,materi_id)
);
create index if not exists exams_category_published_idx on public.exams(category_id,is_published);
create index if not exists exam_questions_exam_order_idx on public.exam_questions(exam_id,sort_order);
create index if not exists exam_questions_materi_idx on public.exam_questions(materi_id);
create index if not exists exam_options_question_order_idx on public.exam_question_options(question_id,sort_order);
create index if not exists exam_attempts_user_started_idx on public.exam_attempts(user_id,started_at desc);
create index if not exists exam_answers_attempt_idx on public.exam_answers(attempt_id);
create index if not exists material_reading_user_last_idx on public.material_reading_history(user_id,last_read_at desc);
alter table public.exam_categories enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_question_options enable row level security;
alter table public.exam_answer_keys enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_answers enable row level security;
alter table public.material_reading_history enable row level security;
revoke all on public.exam_categories,public.exams,public.exam_questions,public.exam_question_options,public.exam_answer_keys,public.exam_attempts,public.exam_answers,public.material_reading_history from anon,authenticated;
grant select on public.exam_categories,public.exams,public.exam_questions,public.exam_question_options to anon,authenticated;
grant select on public.exam_attempts,public.exam_answers to authenticated;
grant select,insert,update on public.material_reading_history to authenticated;
create policy "Published exam categories are public" on public.exam_categories for select to anon,authenticated using(exists(select 1 from public.exams e where e.category_id=exam_categories.id and e.is_published));
create policy "Published exams are public" on public.exams for select to anon,authenticated using(is_published=true);
create policy "Published exam questions are public" on public.exam_questions for select to anon,authenticated using(exists(select 1 from public.exams e where e.id=exam_questions.exam_id and e.is_published));
create policy "Published exam options are public" on public.exam_question_options for select to anon,authenticated using(exists(select 1 from public.exam_questions q join public.exams e on e.id=q.exam_id where q.id=exam_question_options.question_id and e.is_published));
create policy "Users read own exam attempts" on public.exam_attempts for select to authenticated using((select auth.uid())=user_id);
create policy "Users read own exam answers" on public.exam_answers for select to authenticated using(exists(select 1 from public.exam_attempts a where a.id=exam_answers.attempt_id and a.user_id=(select auth.uid())));
create policy "Users read own material history" on public.material_reading_history for select to authenticated using((select auth.uid())=user_id);
create policy "Users create own material history" on public.material_reading_history for insert to authenticated with check((select auth.uid())=user_id);
create policy "Users update own material history" on public.material_reading_history for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
insert into public.permissions(code,label) values('exam.manage','Kelola ujian dan bank soal'),('exam.read','Lihat ujian dan hasil') on conflict(code) do update set label=excluded.label;
insert into public.role_permissions(role_id,permission_id) select r.id,p.id from public.roles r cross join public.permissions p where r.name in('admin','super_admin') and p.code in('exam.manage','exam.read') on conflict do nothing;
grant select,insert,update,delete on public.exam_categories,public.exams,public.exam_questions,public.exam_question_options,public.exam_answer_keys to authenticated;
create policy "Exam managers can manage categories" on public.exam_categories for all to authenticated using(current_admin_role() in('admin','super_admin')) with check(current_admin_role() in('admin','super_admin'));
create policy "Exam managers can manage exams" on public.exams for all to authenticated using(current_admin_role() in('admin','super_admin')) with check(current_admin_role() in('admin','super_admin'));
create policy "Exam managers can manage questions" on public.exam_questions for all to authenticated using(current_admin_role() in('admin','super_admin')) with check(current_admin_role() in('admin','super_admin'));
create policy "Exam managers can manage options" on public.exam_question_options for all to authenticated using(current_admin_role() in('admin','super_admin')) with check(current_admin_role() in('admin','super_admin'));
create policy "Exam managers can manage answer keys" on public.exam_answer_keys for all to authenticated using(current_admin_role() in('admin','super_admin')) with check(current_admin_role() in('admin','super_admin'));