-- Allow authenticated content roles to read non-public material rows.
-- Public users remain limited to published rows by the existing public SELECT policy.
-- This is required for editor pages and UPDATE ... RETURNING under RLS.

DROP POLICY IF EXISTS "Authenticated content users can view materials" ON public.materi;

CREATE POLICY "Authenticated content users can view materials"
ON public.materi
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  current_admin_role() = ANY (
    ARRAY['penulis','editor','admin','super_admin']
  )
);
