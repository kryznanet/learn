-- Follow-up to 20260918025136: preserve author ownership for every content-role insert.

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
