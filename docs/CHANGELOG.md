# Changelog Kryzna Learn

## 18 September 2026

- Hardened `admin_users` RLS by removing direct authenticated UPDATE policies. Staff profile, role, and active-state changes now rely on the protected `update_staff(...)` RPC, preventing direct role/privilege changes through PostgREST.

- Verified `restore_materi_version` end-to-end at the database/RPC layer in a transaction using the dedicated Super Admin identity. The probe created the material and snapshots, restored the original version, produced the expected new snapshot, and rolled back all test data; no production material was modified.
- Confirmed a safe Browser E2E Restore execution path requires an isolated Supabase environment; the connected project currently has no Supabase branch/staging database. Production Restore execution therefore remains pending.

- Added authenticated Browser E2E coverage that verifies a new editor draft is autosaved to localStorage without persisting test data to the database.\n\n- Added authenticated Browser E2E coverage for opening material version history as Super Admin and verifying the Restore control is visible without mutating production content.\n\n- Verified GitHub Actions Browser E2E run #6 (`35296715443`) with the dedicated E2E repository secrets. All 3 Playwright tests passed, including authenticated Super Admin editor reachability.\n\n- Added a Playwright + Chromium browser E2E harness under `tests/e2e/`, with GitHub Actions workflow `.github/workflows/browser-e2e.yml`. Public smoke tests run automatically; authenticated editor tests activate when `KRYZNA_E2E_EMAIL` and `KRYZNA_E2E_PASSWORD` repository secrets are configured.\n\n- Menambahkan `docs/SWIFT-API-AUDIT.md` berdasarkan audit langsung deployment `swift-api` v1. Deployment tetap ACTIVE dengan JWT verification; source repo counterpart belum ditemukan dan consumer eksternal masih perlu diverifikasi sebelum retirement.

- Fixed RLS on `materi` for authenticated content roles. The editor uses `UPDATE ... SELECT`; when a draft/review row was changed to a non-published status, the existing public-only SELECT policy could reject the returned new row with an RLS error.
- Added migration `20260918012129_allow_authenticated_content_users_to_view_materi_20260918`. Authenticated `penulis`, `editor`, `admin`, and `super_admin` can now read material rows; public/anon remain limited to published material.
- Restricted direct `user_roles` INSERT/UPDATE/DELETE to `super_admin` through RLS, while retaining Admin/Super Admin read access. This aligns database enforcement with the RBAC rule that role changes remain Super Admin-only. Applied migration: `20260918011836_restrict_user_role_management_to_super_admin_20260918`.
- Version Restore UI permission was aligned from `content.update` to `content.review`, matching the backend RPC authorization for `editor/admin/super_admin` and preventing a misleading Restore action for `penulis`.
- Integrated `shared/draft-recovery.js` into the material editor and deferred its initialization until the authenticated session/material state is ready, preventing existing-material drafts from being keyed as a new material.
- Browser E2E for autosave/draft recovery remains pending because no browser test runner/runtime is present in the repository connection.

- Restricted internal SECURITY DEFINER helpers `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, and `get_my_role(uuid)` by revoking EXECUTE from `PUBLIC`, `anon`, and `authenticated`.
- Verified the remaining Security Advisor application warning count is 7; these are application/RLS functions with authenticated execution and internal authorization requirements.

- Hardened trigger-only `snapshot_materi_version()` by revoking `EXECUTE` from `PUBLIC`, `anon`, and `authenticated`.
- Set explicit `search_path = public` on `set_materi_updated_at()`.
- Verified `trg_snapshot_materi_version` remains attached to `materi` for `AFTER INSERT OR UPDATE`.
- Verified trigger behavior with a transactional insert/update test; two version snapshots were produced and the transaction was rolled back.
- Reran Supabase Security Advisor: the `snapshot_materi_version()` and mutable-search-path findings are cleared. Remaining findings are the intended review of application `SECURITY DEFINER` RPCs and disabled Leaked Password Protection.

## 17 September 2026

- Merapikan formatting Content/Admin.
- Memusatkan auth dan permission melalui `shared/auth.js`.
- Menambahkan RBAC terpusat dengan `role_permissions` dan `get_my_permissions()`.
- Menambahkan workflow status materi.
- Menambahkan version history dan restore RPC.
- Menambahkan autosave/draft recovery lokal.
- Menyelaraskan Storage policy dengan RBAC.
- Sinkronisasi `create-staff` repo ↔ deployment; deployment aktif v3.
- Menambahkan dukungan role `editor` pada `create-staff`.
- Audit `swift-api`; deployment v1 masih aktif tetapi source tidak ada di repo.
- Menyelaraskan akses `system_activity_logs` dan sebagian user management Admin dengan permission matrix.
- Mencatat Security Advisor findings untuk hardening lanjutan.
- Menetapkan aturan wajib post-commit: setiap commit harus diikuti verifikasi, pembaruan dokumentasi teknis yang relevan, pembaruan `PROJECT-STATUS.md`, dan verifikasi dokumentasi.
- Menambahkan `docs/DEVELOPMENT.md` sebagai acuan workflow pengembangan.
- Menetapkan aturan branch dinamis: branch pengembangan tidak permanen, harus diverifikasi sebelum pekerjaan, dan tidak boleh dikunci berdasarkan nama/tanggal branch sebelumnya.

## Checkpoint akhir sesi — 17 September 2026

- Tidak ada perubahan behavior aplikasi pada checkpoint ini.
- Dokumentasi workflow pengembangan sudah masuk repository.
- Aturan branch dinamis sudah didokumentasikan.
- `PROJECT-STATUS.md` diperbarui untuk mencatat checkpoint dan pekerjaan berikutnya.

## Aturan pencatatan

Setiap perubahan signifikan pada schema, RBAC, security, Edge Function, atau behavior utama harus ditambahkan ke changelog dan `PROJECT-STATUS.md`.

Setiap commit juga wajib melalui siklus dokumentasi: **ubah → commit → verifikasi → update dokumentasi & progres → verifikasi dokumentasi → lanjut**.


## 18 September 2026 — Final database privilege audit

- Audited all public-schema `SECURITY DEFINER` functions: 12 functions found; only the 7 application RPCs remain executable by `authenticated`, while internal/trigger-only helpers are not executable by API roles. All audited SECURITY DEFINER functions have explicit `search_path` configuration.
- Audited RLS: all 10 core public tables have RLS enabled. Public/anon material access remains published-only.
- Hardened API table grants with migrations `20260918020624_restrict_api_table_privileges_20260918`, `20260918020632_tighten_api_table_dml_privileges_20260918`, and `20260918020637_restore_rbac_write_privileges_20260918`.
- Verified Storage policies for `materi-files` and `avatars`, core triggers, and final public indexes. No additional concrete security defect was identified in these areas.
