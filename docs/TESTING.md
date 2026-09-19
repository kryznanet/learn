# Testing Kryzna Learn

## Browser E2E — Playwright

The repository now includes a Chromium browser test harness:

- package.json provides npm run test:e2e.
- playwright.config.js runs Chromium tests and starts a local Python HTTP server when BASE_URL is not provided.
- tests/e2e/public.spec.js covers public homepage, admin-login smoke checks, published material category filters, learning-path category activation, and public material detail navigation.
- tests/e2e/authenticated.spec.js covers authenticated editor reachability when KRYZNA_E2E_EMAIL and KRYZNA_E2E_PASSWORD are configured.
- .github/workflows/browser-e2e.yml installs Chromium with dependencies, uploads Playwright reports/traces as workflow artifacts, and automatically records runtime results into `docs/BROWSER-E2E-RESULTS.md` and `docs/PROJECT-STATUS.md`. The dedicated results document keeps only the latest runtime result; a new run replaces the previous entry.
- Authenticated tests are intentionally skipped when the credentials secrets are absent; this is not equivalent to a passed authenticated E2E test.
- Verified 18 September 2026: GitHub Actions Browser E2E run #6 ran with the dedicated E2E secrets and all 3 tests passed, including authenticated Super Admin editor reachability.
- As of 19 September 2026, the workflow can receive push, pull request, and manual-dispatch events, but the Playwright job runs only when the event targets the repository default branch. The condition reads `github.event.repository.default_branch`, so it follows future default-branch changes automatically without hard-coded date branch names.
- Added 19 September 2026: public E2E coverage now verifies the current published catalog count (58), exact counts for Dasar (22), Intermediate (20), Advanced (12), and Tutorial (4), category-filter badges, learning-path activation, and material-card navigation to a rendered public detail page. The strengthened tests are source/commit verified but still require a fresh Browser E2E workflow run for runtime verification on the current branch. Runtime evidence and run history are recorded separately in `docs/BROWSER-E2E-RESULTS.md`.

GitHub Actions setup:

1. Repository Settings → Secrets and variables → Actions.
2. Add KRYZNA_E2E_EMAIL for a dedicated E2E account.
3. Add KRYZNA_E2E_PASSWORD for that account.
4. Push to the repository default branch, open a pull request targeting the default branch, or run the workflow manually on the default branch. Events from other branches are skipped by the Playwright job.
5. Review the playwright-report artifact after the run; the workflow also commits the runtime result documentation automatically. `docs/BROWSER-E2E-RESULTS.md` retains only the newest runtime result.

Do not use a personal password in source code or commit it to the repository. Prefer a dedicated test account with only the permissions required by the E2E scenarios.

**Tanggal:** 19 September 2026

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
- [x] Public category filter and learning-path navigation tests added; runtime verification pending fresh CI run.
- [x] Public material card navigation test added; runtime verification pending fresh CI run.
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

## Local Supabase Restore E2E readiness — 18 September 2026

Restore UI-to-database E2E remains **Blocked** for the free local path until the repository has a complete reproducible database baseline. The branch currently tracks hardening migrations from 18 September, while the connected project migration history also contains required schema/RBAC/storage migrations from 16–17 September that are absent from this branch's `supabase/migrations/` directory.

A local supabase/config.toml should be added only after the baseline is established. Do not point Browser E2E at production for Restore execution, and do not use the legacy root SQL bootstrap files as a substitute for the current live schema.

## Live schema baseline audit — 18 September 2026

Read-only Supabase catalog inspection verified the live baseline inputs needed for Restore E2E isolation: PostgreSQL 17.6.1, ten application tables with RLS enabled, current PK/FK/check/unique constraints, core indexes, 14 public application functions, material/version/activity triggers, two Storage buckets, and the current four-role/17-permission/41-mapping RBAC seed. No production mutation was performed.

The baseline is **not yet executable locally**. The branch lacks the earlier 16–17 September migration sequence, and Supabase-managed Auth/Storage dependencies should be reproduced through the supported CLI/database-pull workflow rather than hand-authored from catalog output. Local reset remains unverified because this environment has no Supabase CLI/Docker runtime.


## Material CRUD delete — 19 September 2026

- [x] UI hanya menampilkan Hapus jika user memiliki `content.delete`.
- [x] Backend RLS DELETE `materi` membatasi aksi ke `admin` dan `super_admin`.
- [x] Foreign key version history menggunakan `ON DELETE CASCADE` untuk snapshot terkait.
- [ ] Browser E2E delete materi masih perlu runtime verification pada dedicated test data; jangan menghapus materi production secara destruktif untuk pengujian.

## Audit pedagogis materi — 19 September 2026

- Read-only audit terhadap 58 materi published memverifikasi struktur lengkap pada seluruh materi.
- Ditemukan 35 materi dengan blok latihan/troubleshooting/checklist/ringkasan yang terlalu generik.
- Blok generik tersebut telah diganti dengan konten spesifik topik untuk 20 Intermediate, 11 Advanced, dan 4 Tutorial.
- Verifikasi live setelah update menunjukkan 58 published tetap tersedia dan marker generik yang diaudit menjadi 0.
- Audit ini belum menggantikan verifikasi browser/rendering; fresh Browser E2E dan review visual tetap diperlukan.


## Ujian Online & Riwayat Belajar — 19 September 2026

Verifikasi database live: 4 kategori ujian published; masing-masing memiliki 5 soal; total 20 soal; 20 answer key tersedia server-side; 8 tabel modul memiliki RLS aktif; permission `exam.manage` dan `exam.read` terpetakan ke Admin dan Super Admin; Edge Function `exam-api` deployed aktif dengan JWT verification.

Status browser/E2E modul baru: **Needs Verification**. Coverage berikut perlu dijalankan pada akun learner test: login/registrasi, pembukaan materi dan pencatatan riwayat, penandaan selesai, start exam, timer, submit, score, pass/fail, dan riwayat attempt.

Jangan menggunakan akun production secara destruktif untuk pengujian; gunakan akun E2E learner khusus dan data ujian yang memang disediakan untuk test.


## Learner / user role — 19 September 2026

- [x] Role `user` tersedia di RBAC.
- [x] User Auth baru mendapat role `user` melalui trigger.
- [x] Existing Auth users direkonsiliasi ke role `user`.
- [x] Permission learner: `learning.read`, `exam.take`, `exam.history.read`.
- [x] `shared/auth.js` dapat mengenali role learner dari `user_roles`.
- [ ] Browser E2E learner: login dan routing ke Belajar Saya.
- [ ] Browser E2E learner: buka materi dan reading history.
- [ ] Browser E2E learner: start/submit ujian, timer, score/pass-fail.
- [ ] Browser E2E learner: riwayat attempt.
- [ ] Verifikasi bahwa learner tidak dapat membuka area Admin.

Gunakan akun E2E learner khusus. Jangan menggunakan operasi destruktif terhadap production untuk pengujian.

## Learner reading completion — 19 September 2026
- [x] Membuka materi tidak langsung membuat row `material_reading_history`.
- [x] Kontrol konfirmasi disabled sampai sentinel bagian paling bawah materi terlihat.
- [x] Checkbox wajib dicentang sebelum tombol `Tandai sudah dibaca` aktif.
- [x] Setelah konfirmasi, row learner disimpan sebagai `completed` dengan `completed_at`.
- [x] Browser tidak lagi memiliki hak UPDATE langsung pada `material_reading_history`.
- [ ] Browser E2E learner untuk alur ini masih membutuhkan runtime verification dengan akun E2E learner khusus.


## Main web login + learner profile — 19 September 2026
- [x] Source menu `Masuk` pada web utama.
- [x] Source menu berubah ke identitas akun saat sesi aktif.
- [x] Learner profile tersedia di `belajar/profile.html`.
- [x] Shortcut profile tersedia dari `Belajar Saya`.
- [ ] Browser E2E: visitor → login → profile → logout.
- [ ] Browser E2E: update nama/avatar/password/email sesuai policy.


## Admin learner user management — 19 September 2026
- [x] Admin memiliki `users.read`, `users.create`, `users.update`, `users.disable` untuk learner account management.
- [x] Super Admin memiliki permission yang sama.
- [x] UI Kelola Pengguna memiliki form tambah pengguna biasa.
- [x] UI memiliki daftar learner dan edit nama/email/status/password opsional.
- [x] Endpoint menolak target staff.
- [x] Edge Function `manage-users` deployed aktif dengan JWT verification.
- [ ] Browser E2E Admin: create + edit learner.
- [ ] Browser E2E Super Admin: create + edit learner.
\n\n## Dynamic Material Category Verification — 19 September 2026\n\nChecklist runtime: (1) Admin/Super Admin dapat membuka Kelola Konten, (2) halaman Kategori Materi menampilkan kategori existing, (3) tambah kategori baru berhasil dan muncul di daftar, (4) editor menampilkan kategori baru tanpa hard-code, (5) user tanpa `content.manage_categories` tidak dapat menambah kategori, dan (6) RLS tetap menolak INSERT tanpa permission. Browser E2E khusus kategori masih **Pending**.\n

## Kategori Materi — management coverage — 19 September 2026

- [x] RLS INSERT kategori memerlukan `content.manage_categories`.
- [x] RLS UPDATE kategori memerlukan `content.manage_categories` dan memiliki `WITH CHECK` authorization.
- [x] RLS DELETE kategori memerlukan `content.manage_categories`.
- [x] UI menampilkan tambah, ubah, aktif/nonaktif, dan hapus.
- [x] Rename kategori yang sudah dipakai materi diblokir untuk menjaga referensi `materi.kategori`.
- [x] Delete kategori yang masih dipakai materi diblokir; nonaktifkan sebagai alternatif.
- [ ] Browser E2E kategori tetap ditunda sampai seluruh feature request selesai.


## Learner exam history — 19 September 2026

- [x] Halaman `belajar/ujian-riwayat.html` tersedia dan terhubung dari Belajar Saya/Profile.
- [x] Query hanya membaca `exam_attempts` dan relasi ujian/kategori; authorization tetap melalui RLS.
- [x] Nilai/status ditampilkan dari hasil server-side attempt.
- [ ] Browser E2E riwayat ujian ditunda sampai seluruh feature request selesai.


## Ujian — administration expansion — 19 September 2026

- [x] Admin/Super Admin dapat membuat ujian baru.
- [x] Admin/Super Admin dapat mengubah judul, deskripsi, kategori, durasi, nilai lulus, dan status terbit.
- [x] Admin/Super Admin dapat menambah soal dengan 4 pilihan, kunci jawaban, kesulitan, dan pembahasan.
- [x] Admin/Super Admin dapat menghapus soal.
- [ ] Browser E2E ujian administration ditunda sampai seluruh feature request selesai.


## Pengaturan & learner UX — 19 September 2026

- [x] Halaman Pengaturan tetap dilindungi permission settings.manage dan hanya menjadi hub; tidak menambah tabel konfigurasi palsu di browser.
- [x] Hub Pengaturan menyediakan jalur ke Pengguna Belajar, Konten/Materi, Kategori, Ujian, dan Aktivitas Sistem.
- [x] Belajar Saya menampilkan ringkasan materi selesai, total percobaan ujian, dan ujian lulus dari data akun sendiri.
- [x] Riwayat Belajar memiliki pencarian judul dan filter status serta mempertahankan aturan completion end-of-material.
- [x] Katalog Ujian memiliki pencarian dan filter kategori serta hanya menampilkan ujian published.
- [x] Riwayat Ujian memiliki ringkasan total/lulus dan filter hasil.
- [x] Pengerjaan Ujian mencegah submit ganda, memperingatkan soal belum dijawab, memberi peringatan lima menit, dan menghentikan timer setelah submit.
- [ ] Browser E2E untuk perubahan UX ini tetap ditunda sampai seluruh feature request selesai.


## Feature expansion — 19 September 2026

Source verification yang perlu dilakukan sebelum feature freeze:
- Admin Ujian: edit soal, poin, pembahasan, kunci, urutan soal, arsip/aktifkan ujian, dan CRUD/aktif-nonaktif kategori.
- Learner: dashboard progres, detail hasil ujian, bookmark materi, feedback materi, dan notifikasi.
- Admin dashboard: statistik learner/materi/ujian dan filter pengguna.
- Regression: ujian arsip tidak muncul pada katalog publik; riwayat attempt tetap tersedia; kategori yang masih dipakai tidak dapat dihapus.
- E2E tetap ditunda sampai seluruh feature request selesai sesuai keputusan proyek.
