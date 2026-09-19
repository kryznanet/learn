## 19 September 2026 — Public material Browser E2E coverage

- Added public Playwright coverage for the four published material categories: Dasar, Intermediate, Advanced, and Tutorial.
- Added assertions for the live published catalog count used by the current branch checkpoint: 58 materials, including 4 Tutorial materials.
- Added coverage that learning-path cards activate the corresponding category filter.
- Added coverage that public material cards navigate to `materi/view.html?slug=...`.
- Test commit: `6f54cf98357e668bcbd263ded86531f499226a7c`.
- Source commit and resulting test file were fetched and verified.
- Strengthened the tests with exact category counts (Dasar 22, Intermediate 20, Advanced 12, Tutorial 4), badge assertions for every displayed card, and detail-page rendering assertions.

## 19 September 2026 — Browser E2E branch coverage

- Updated `.github/workflows/browser-e2e.yml` so Browser E2E triggers on pushes and pull requests targeting both `18-Sep-2026` and the current development branch `19-Sep-2026`.
- Manual `workflow_dispatch` remains available.
- Commit: `47fda485020fbe2e517c563bb83e54eb74560770`; commit and workflow contents were verified.
- No application data or Supabase schema was changed.

## 19 September 2026 — Rekonsiliasi katalog materi

- Menyelaraskan `docs/MATERIAL-CATALOG.md` dengan data live `public.materi` menggunakan query read-only.
- Katalog sekarang mencatat seluruh **58 materi published** berdasarkan kategori aktual: Dasar 22, Intermediate 20, Advanced 12, Tutorial 4.
- Placeholder **Test** dan **Test 12** tidak dimasukkan karena telah diverifikasi berstatus `archived`.
- Commit katalog: `9a65c0a777b04778b35dd283f1bd077b3f6bf434`.
- Tidak ada perubahan pada data aplikasi atau schema database.

## 18 September 2026 — Draft Recovery E2E fixture cleanup
- Menghapus ketergantungan test Browser E2E authenticated terhadap judul fixture `Test 12` untuk existing-material recovery dan version history.
- Test sekarang memilih materi pertama yang tersedia dan membaca judul aktual dari card, sehingga coverage tidak bergantung pada seed data bernama tertentu.
- Commit test: `54d291161fd6318923876e165ef7c0f960f2939a`.

## 18 September 2026 — Import/RLS alignment
- Final source audit menemukan `admin/import.html` membuat row `materi` tanpa `author_id`, sementara RLS insert sekarang mewajibkan ownership `author_id = auth.uid()`.
- Payload import diperbaiki untuk menyimpan `author_id: user.id`; perubahan diverifikasi pada commit `4d32f6b7842c93c16fed67df148e793150c9a38d`.

## 18 September 2026 — Material workflow status enforcement
- Audit jalur `materi` menemukan bahwa permission UI untuk review/publish/archive belum sepenuhnya menjadi security boundary di database: role `penulis` masih dapat menulis `status` non-draft melalui direct API selama memiliki `content.update`.
- Diperketat RLS `materi` melalui migrations `20260918025136_enforce_materi_status_permissions_20260918` dan `20260918025144_tighten_materi_insert_author_20260918`.
- `penulis` sekarang hanya dapat insert/update materi miliknya sendiri dengan `status='draft'`; `editor` dapat mengelola materi miliknya sendiri di seluruh workflow; `admin`/`super_admin` tetap dapat mengelola lintas author.
- Semua content-role insert tetap wajib `author_id = auth.uid()`.
- Live Supabase policy verification setelah migration berhasil.

## 18 September 2026 — RBAC staff mutation alignment
- Menyamakan permission RBAC dengan enforcement backend: `admin` hanya dapat membaca staf; perubahan profil/status/role staf khusus Super Admin.
- Mencabut `users.update` dan `users.disable` dari role `admin`.
- UI `admin/users.html` sekarang read-only untuk Admin dan hanya Super Admin yang dapat menyimpan perubahan staf.
- Live database verification mengonfirmasi mapping permission dan migration `20260918024839`.

## 18 September 2026 — Documentation consistency audit
- Memverifikasi `docs/ARCHITECTURE.md`, `docs/RBAC.md`, `docs/LEGACY.md`, `docs/TESTING.md`, dan `docs/PROJECT-STATUS.md` terhadap struktur repository dan checkpoint aktif.
- Memperbaiki metadata branch/tanggal pada `docs/ARCHITECTURE.md` yang masih menunjuk checkpoint `17-Sep-2026`; arsitektur kini mengikuti branch aktif yang diverifikasi.
- Tidak ditemukan perubahan behavior aplikasi dari audit konsistensi ini.

## 18 September 2026 — Swift API consumer re-audit
- Re-verifikasi deployment `swift-api` langsung pada Supabase: ACTIVE v1, `verify_jwt=true`, source hash tetap `6ccb86e9607420d75fcd790e0cd86de168ef8ec12ed4724f0cb496be59646a2e`.
- Source deployment hanya menangani payload `name` dan tidak menunjukkan akses database/Storage Kryzna Learn.
- Audit repository branch `18-Sep-2026` tetap tidak menemukan source/config/consumer counterpart untuk `swift-api`.
- Status tetap `Needs Verification`: consumer eksternal tidak dapat dibuktikan dari repository/deployment saja, sehingga function tidak dihapus atau diubah.

## 18 September 2026 — Final repository cleanup audit
- Memverifikasi branch `18-Sep-2026` dan melakukan audit referensi runtime/build untuk `supabase-config-legacy.js`; tidak ditemukan referensi pada halaman aplikasi, shared code, test, workflow, atau konfigurasi yang diaudit.
- Menghapus `supabase-config-legacy.js` karena tidak lagi memiliki consumer terverifikasi. `supabase-config.js` tetap menjadi konfigurasi browser aktif.
- Memperbarui `docs/CODE-STYLE.md` agar tidak mengunci branch acuan ke tanggal lama; aturan sekarang mengikuti branch yang diverifikasi pada checkpoint aktif.
- Restore Browser E2E UI-to-database tetap pending karena tidak ada environment Supabase terisolasi yang disetujui.

## 18 September 2026 — Browser E2E draft recovery verified
- Browser E2E run #43 (`35298946197`) succeeded on `18-Sep-2026` at commit `2ec49859a5fffd793a721d257eaac0b122fd31b8`.
- New-material and existing-material Draft Recovery tests now wait for editor readiness and verify the persisted localStorage payload before reload/recovery.
- Draft Recovery CI verification is closed for the covered flows.

## 18 September 2026 — Browser E2E draft recovery fix
- Browser E2E run #35 (`35298200046`) exposed two timing failures in Draft Recovery coverage: interactions could occur before editor boot/listeners were ready, and existing-material `#id` could be checked before asynchronous material loading completed.
- `content/editor.html` now exposes `window.__kryznaEditorReady` after boot and Draft Recovery initialization.
- `tests/e2e/authenticated.spec.js` waits for the readiness signal before autosave/recovery interactions.
- GitHub Actions Browser E2E run #43 (`35298946197`) on the updated test commit completed successfully; Draft Recovery verification is now closed for the covered new/existing material reload flows.

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
- Browser E2E for autosave/draft recovery was later verified through GitHub Actions run #43 after the repository test runner was configured.

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


## 18 September 2026 — Staff update RPC hardening

- Menemukan mismatch source/database contract pada `update_staff()`: function masih menerima actor `admin` untuk perubahan profil/active state, sementara RBAC Admin sudah dicabut `users.update` dan `users.disable`.
- Migration `20260918030000_restrict_update_staff_to_super_admin_20260918` memperketat authorization internal menjadi Super Admin-only.
- Live database diverifikasi: `update_staff()` tetap executable untuk `authenticated` sebagai jalur aplikasi, tetapi memiliki guard `actor_role <> 'super_admin'`; `anon` tidak memiliki EXECUTE.


## 18 September 2026 — Pendalaman pedagogis seluruh materi published

- Memperbarui seluruh 58 materi published dengan konten yang lebih spesifik per topik, dimulai dari Dasar dan dilanjutkan ke Intermediate, Advanced, serta Tutorial.
- Menambahkan contoh kasus, bukti verifikasi, troubleshooting, latihan, dan checklist yang relevan dengan domain masing-masing materi.
- Verifikasi live: 58 published tetap terdiri dari Dasar 22, Intermediate 20, Advanced 12, Tutorial 4.
- Tidak ada perubahan schema, RLS, RBAC, atau status publikasi.
