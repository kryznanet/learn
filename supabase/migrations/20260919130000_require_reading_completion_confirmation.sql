-- Reading history completion is an explicit learner confirmation after reaching the page bottom.
drop policy if exists "Users create own material history" on public.material_reading_history;
drop policy if exists "Users update own material history" on public.material_reading_history;

create policy "Users create completed own material history"
on public.material_reading_history
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'completed'
  and completed_at is not null
);

revoke update on public.material_reading_history from authenticated;
grant insert on public.material_reading_history to authenticated;
