# Testing Kryzna Learn

## Browser E2E — Playwright

The repository now includes a Chromium browser test harness:

- package.json provides npm run test:e2e.
- playwright.config.js runs Chromium tests and starts a local Python HTTP server when BASE_URL is not provided.
- tests/e2e/public.spec.js covers public homepage and admin-login smoke checks.
- tests/e2e/authenticated.spec.js covers authenticated editor reachability when KRYZNA_E2E_EMAIL and KRYZNA_E2E_PASSWORD are configured.
- .github/workflows/browser-e2e.yml installs Chromium with dependencies and uploads Playwright reports/traces as workflow artifacts.
- Authenticated tests are intentionally skipped when the credentials secrets are absent; this is not equivalent to a passed authenticated E2E test.
- Verified 18 September 2026: GitHub Actions Browser E2E run #6 ran with the dedicated E2E secrets and all 3 tests passed, including authenticated Super Admin editor reachability.

GitHub Actions setup:

1. Repository Settings → Secrets and variables → Actions.
2. Add KRYZNA_E2E_EMAIL for a dedicated E2E account.
3. Add KRYZNA_E2E_PASSWORD for that account.
4. Push to 18-Sep-2026 or run the workflow manually.
5. Review the playwright-report artifact after the run.

Do not use a personal password in source code or commit it to the repository. Prefer a dedicated test account with only the permissions required by the E2E scenarios.

**Tanggal:** 18 September 2026

## Public content sanitization regression — 18 September 2026
- Publish material content containing HTML/event-handler attributes and unsafe URL schemes; verify unsafe attributes/URLs are removed and safe HTTP(S)/relative links remain.

## Authentication

- [ ] Login valid.
- [ ] Login invalid.
- [ ] Session persistence.
- [ ] Logout.
- [ ] Routing per role.
- [ ] Inactive staff ditolak.

## RBAC

- [ ] Viewer hanya membaca konten.
- [ ] Penulis dapat create/update sesuai ownership.
- [ ] Editor dapat review/publish/archive.
- [ ] Admin mendapat akses administratif sesuai matrix.
- [ ] Super Admin dapat role management.
- [ ] Permission UI tidak menggantikan RLS/RPC.

## Content

- [ ] Create draft.
- [ ] Edit draft.
- [ ] Submit review.
- [ ] Publish.
- [ ] Archive.
- [ ] Search/filter.
- [ ] Slug otomatis.
- [ ] Public hanya melihat published.
- [ ] Regression: authenticated content role dapat UPDATE materi ke `review` menggunakan editor yang memakai `UPDATE ... SELECT`.

## Versioning

- [ ] Snapshot dibuat saat insert/update.
- [x] Riwayat versi tampil.
- [x] Restore RPC berhasil diverifikasi secara transaksional dengan identity Super Admin; material uji dan snapshot di-rollback.
- [x] Restore hanya role yang berwenang.
- [x] Browser E2E: Super Admin dapat membuka riwayat versi dan melihat kontrol Restore.
- [ ] Browser E2E: Restore execution dari UI sampai database pada environment terisolasi (blocked until an isolated Supabase environment is available).
- [ ] Restore membuat snapshot baru.
- [ ] Activity log restore tercatat.

## Autosave

Implementasi sudah diintegrasikan ke `content/editor.html` melalui `shared/draft-recovery.js`. Inisialisasi dilakukan setelah session dan materi selesai dimuat agar draft memakai key user + material yang benar. Browser E2E memverifikasi autosave lokal pada materi baru tanpa menulis ke database.

- [x] Browser E2E: draft lokal tersimpan setelah perubahan.
- [x] Browser E2E: draft dipulihkan setelah reload — verified in GitHub Actions Browser E2E run #43 for new and existing material.
- [x] Browser E2E: user mendapat konfirmasi recovery — verified by the reload/recovery flow in Browser E2E run #43.
- [ ] Browser E2E: draft lokal dibersihkan setelah save/review berhasil.
- [x] Browser E2E: test recovery untuk materi existing sudah ditambahkan.
- [x] Browser E2E: existing-material recovery test tidak lagi bergantung pada judul fixture `Test 12`; test memilih materi pertama yang tersedia dan membaca judul aktual sebelum verifikasi.
- [x] Browser E2E: verifikasi CI setelah perbaikan readiness editor — run #43 (`35298946197`) succeeded.

## Storage

- [ ] Role content dapat upload/update sesuai policy.
- [ ] Hanya Admin/Super Admin dapat delete.
- [ ] Public hanya membaca file materi published.

## Security

- [ ] Anon tidak dapat menjalankan RPC privileged.
- [ ] SECURITY DEFINER memiliki authorization yang sesuai.
- [ ] Security Advisor diperiksa setelah migration.
- [ ] Secret/service-role key tidak ada di browser/source.


## Browser E2E failure diagnosis — 18 September 2026
- Run #35 (`35298200046`) completed with failure: 4 tests passed and 2 failed.
- The new-draft autosave test filled the form before editor boot had attached the draft-recovery input listeners, so `#msg` remained empty.
- The existing-material recovery test asserted `#id` immediately after navigation before the asynchronous material load completed, so the field was still empty.
- Fix: `content/editor.html` now exposes `window.__kryznaEditorReady` after session/material loading and draft-recovery initialization; authenticated E2E waits for this signal before interacting with the editor.
- The fix is committed on `18-Sep-2026`; run #43 (`35298946197`) subsequently passed, so Draft Recovery is verified for the covered flows.


## Browser E2E Draft Recovery verification — 18 September 2026
- Run #43 (`35298946197`) on commit `2ec49859a5fffd793a721d257eaac0b122fd31b8` completed successfully.
- The Playwright job completed successfully, including the Browser E2E test step and report upload.
- The authenticated suite verifies new-material autosave/recovery and existing-material draft recovery after reload.
