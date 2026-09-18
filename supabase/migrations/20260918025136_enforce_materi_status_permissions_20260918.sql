-- Kryzna Learn: enforce workflow status permissions at the database boundary.
-- Penulis may create/update only draft material they author.
-- Editor may create/update authored material across workflow statuses.
-- Admin/Super Admin may manage material across workflow statuses.

DROP POLICY IF EXISTS "Content users can insert materi" ON public.materi;
CREATE POLICY "Content users can insert materi"
ON public.materi AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND (
    current_admin_role() IN ('admin', 'super_admin', 'editor')
    OR (current_admin_role() = 'penulis' AND status = 'draft')
  )
);

DROP POLICY IF EXISTS "Content users can update materi" ON public.materi;
CREATE POLICY "Content users can update materi"
ON public.materi AS PERMISSIVE FOR UPDATE TO authenticated
USING (
  current_admin_role() IN ('admin', 'super_admin')
  OR (author_id = auth.uid() AND current_admin_role() IN ('penulis', 'editor'))
)
WITH CHECK (
  current_admin_role() IN ('admin', 'super_admin', 'editor')
  OR (current_admin_role() = 'penulis' AND author_id = auth.uid() AND status = 'draft')
);
