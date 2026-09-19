-- Allow content managers to review learner feedback for quality improvement.
drop policy if exists "Content managers read learner feedback" on public.materi_feedback;
create policy "Content managers read learner feedback" on public.materi_feedback for select to authenticated
using (current_admin_role() = any(array['admin'::text,'editor'::text,'super_admin'::text]));