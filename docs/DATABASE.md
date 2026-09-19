# Database Kryzna Learn

**Tanggal:** 18 September 2026

## Tabel inti

- `admin_users`: staf, role legacy/kompatibilitas, active state.
- `roles`: definisi role.
- `permissions`: definisi permission.
- `user_roles`: assignment user ke role.
- `role_permissions`: mapping role ke permission.
- `materi`: materi pembelajaran dan status workflow.
- `materi_versions`: snapshot perubahan materi.
- `content_activity_logs`: audit content.
- `system_activity_logs`: audit system.

## Materi

Kolom penting meliputi `id`, `judul`, `deskripsi_singkat`, `link_halaman`, `kategori`, `slug`, `konten`, file metadata, `status`, `author_id`, `created_at`, dan `updated_at`.

Status yang valid: `draft`, `review`, `published`, `archived`.

Authenticated content roles (`penulis`, `editor`, `admin`, `super_admin`) sekarang memiliki SELECT RLS pada `materi` agar dapat membaca draft/review/archived sesuai kebutuhan aplikasi. Public tetap hanya dapat SELECT materi dengan status `published`.

Ini juga diperlukan oleh editor karena `content/editor.html` menggunakan `UPDATE ... SELECT`. PostgreSQL menerapkan SELECT policy pada DML yang menggunakan `RETURNING`; tanpa policy SELECT yang cocok, update yang mengubah materi menjadi non-published dapat gagal dengan pesan RLS pada row baru.

## Version history

`materi_versions` memakai unique (`materi_id`, `version_number`) dan index berdasarkan material/version. Trigger `trg_snapshot_materi_version` berjalan setelah insert/update `materi`.

`snapshot_materi_version()` adalah `SECURITY DEFINER` trigger-only function dengan `search_path = public`. `EXECUTE` untuk `PUBLIC`, `anon`, dan `authenticated` telah dicabut. Trigger tetap dapat menjalankannya karena privilege trigger execution tidak bergantung pada pemanggilan RPC oleh role API.

## RPC penting

- `current_admin_role()` — role aktif user.
- `get_my_permissions()` — permission aktif user.
- `add_staff_by_email(...)` — jalur penambahan staf terproteksi.
- `update_staff(...)` — perubahan staf terproteksi.
- `restore_materi_version(...)` — restore versi terproteksi.
- `snapshot_materi_version()` — trigger-only function; tidak diekspos sebagai RPC publik.

## RLS

RLS aktif pada tabel inti. Policy harus selalu dipandang bersama dengan permission mapping dan authorization RPC.

`materi` memiliki SELECT policy terpisah untuk authenticated content roles. Policy ini tidak berlaku untuk `anon`; public policy tetap membatasi anon/public pada `status='published'`.

`user_roles` menggunakan dua lapis enforcement: authenticated users dapat membaca assignment sendiri, Admin/Super Admin dapat membaca assignment staf, sedangkan INSERT/UPDATE/DELETE assignment role hanya diizinkan untuk `super_admin`. Ini menjaga pembagian user administration agar Admin tidak dapat mengubah role secara langsung.

## Index / constraint

Workflow dan version history memiliki index/constraint yang mendukung pencarian status serta version lookup. Review index final tetap menjadi bagian audit database berikutnya.

## Migration discipline

Perubahan schema dilakukan melalui migration dan diverifikasi dengan query setelah penerapan. Dokumentasikan perubahan signifikan di `PROJECT-STATUS.md`.

### Security hardening — 18 September 2026

Migration `20260918010522_harden_trigger_function_privileges_20260918` menetapkan `search_path = public` pada `set_materi_updated_at()` dan mencabut `EXECUTE` eksplisit untuk role API pada `snapshot_materi_version()`.

Migration `20260918010535_restrict_trigger_function_execute_20260918` mencabut `EXECUTE` dari `PUBLIC`, `anon`, dan `authenticated` pada `snapshot_materi_version()`.

Migration `20260918010830_restrict_internal_security_definer_helpers` mencabut `EXECUTE` dari `PUBLIC`, `anon`, dan `authenticated` pada `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, dan `get_my_role(uuid)` karena ketiganya tidak diperlukan sebagai RPC langsung.

Migration `20260918011836_restrict_user_role_management_to_super_admin_20260918` mengganti policy `Admins manage user roles` menjadi `Super admins manage user roles`, sehingga direct write ke `user_roles` hanya dapat dilakukan oleh `super_admin`.

Migration `20260918012129_allow_authenticated_content_users_to_view_materi_20260918` menambahkan SELECT RLS untuk authenticated content roles. Public read tetap dibatasi pada materi published.

Verifikasi database mengonfirmasi `anon_execute=false`, `authenticated_execute=false`, dan `public_execute=false` untuk `snapshot_materi_version()`. Pengujian transaksional insert/update pada `materi` menghasilkan dua `materi_versions` lalu di-rollback. Setelah migration user-role, policy `Super admins manage user roles` terverifikasi sebagai `FOR ALL TO authenticated` dengan `USING/WITH CHECK current_admin_role() = 'super_admin'`. Policy SELECT baru pada `materi` juga terverifikasi sebagai `FOR SELECT TO authenticated` untuk role content.

### Staff update hardening — 18 September 2026

Migration `20260918020413_restrict_direct_admin_users_updates_20260918` mencabut policy UPDATE langsung pada `admin_users`. Verifikasi database menunjukkan migration tercatat dan `pg_policies` tidak lagi memiliki policy UPDATE pada tabel tersebut.

### API table privileges — 18 September 2026

Tiga migration privilege memperkecil grant API tanpa mengubah RLS policy semantics. `anon` hanya mempertahankan SELECT pada `materi` untuk public published-content path. `authenticated` mempertahankan privilege yang dibutuhkan oleh policy RLS dan jalur aplikasi; privilege `REFERENCES`, `TRIGGER`, `TRUNCATE`, serta DML tanpa policy terkait telah dicabut. `user_roles` dan `role_permissions` mempertahankan DML karena policy `FOR ALL` Super Admin memang merupakan jalur administrasi yang sah.

### RBAC staff mutation alignment — 18 September 2026

Migration `20260918030000_restrict_update_staff_to_super_admin_20260918` menyelaraskan authorization internal `update_staff()` dengan RBAC: hanya `super_admin` yang dapat mengubah profil, role, atau active state staf. Ini menutup mismatch sebelumnya ketika function masih menerima actor `admin` walaupun permission `users.update`/`users.disable` sudah dicabut dari role Admin.

Migration `20260918024839_restrict_admin_staff_mutation_permissions_20260918` mencabut `users.update` dan `users.disable` dari role `admin`. Admin tetap memiliki `users.read`; perubahan profil/status/role staf hanya melalui jalur Super Admin `update_staff()`. Verifikasi live RBAC menunjukkan role `admin` tidak memiliki `roles.manage`.

### Material workflow status enforcement — 18 September 2026

Migrations `20260918025136_enforce_materi_status_permissions_20260918` and `20260918025144_tighten_materi_insert_author_20260918` enforce workflow status boundaries at the `materi` RLS layer. `penulis` can only insert/update their own material while it remains `draft`; `editor` can insert/update their own material across workflow statuses; `admin` and `super_admin` can manage material across workflow statuses. All content-role inserts still require `author_id = auth.uid()`. This prevents a caller with only `content.create`/`content.update` from bypassing missing `content.review`, `content.publish`, or `content.archive` permissions by writing `status` directly through the API.

## Live schema baseline audit — 18 September 2026

A read-only catalog audit of the connected project verified the current public schema before any local baseline write:

- PostgreSQL engine: **17.6.1**.
- Ten application tables have RLS enabled: `admin_users`, `activity_logs`, `content_activity_logs`, `materi`, `materi_versions`, `permissions`, `role_permissions`, `roles`, `system_activity_logs`, and `user_roles`.
- Core primary keys, foreign keys, workflow check constraint, role/permission uniqueness, material slug uniqueness, and version uniqueness were verified.
- Core public indexes include material author/status/slug indexes, version lookup indexes, and activity-log user lookup.
- Current live application functions include 14 public functions, including 7 application `SECURITY DEFINER` RPCs plus trigger/helper functions.
- Current live triggers include material updated-at, material activity, version snapshot, and Supabase Storage maintenance/protection triggers.
- Storage currently contains `avatars` (5 MiB, JPEG/PNG/WebP) and `materi-files` (25 MiB, restricted document/text/image MIME set).
- Live role/permission seed currently contains 4 roles and 17 permissions with 41 role-permission mappings.

The audit also confirmed why a hand-written baseline should not be committed yet: the local migration directory still lacks the earlier 16–17 September migration sequence that established these objects, and Storage/Auth are Supabase-managed schemas with dependencies that should be reproduced through the supported CLI/database pull workflow rather than guessed SQL. The repository's legacy root SQL files are incomplete historical bootstrap scripts and do not contain the current function/RLS/grant state.

**Conclusion:** schema capture is complete enough to design the baseline, but an authoritative reproducible migration must still be generated/validated by Supabase CLI against the live schema. This environment does not have the Supabase CLI/Docker runtime required to run `supabase db pull`/local reset, so no local reset is claimed.

## Local Supabase / reproducible test environment — 18 September 2026

Local Supabase is the no-cost path for isolated Restore E2E. The repository already contains versioned migrations, but the current repository migration directory is **not yet a complete baseline** for recreating the live database: the connected project currently records earlier migrations from 16–17 September that are not present in `supabase/migrations/` on this branch. The live database also reports PostgreSQL 17.6.

Do not run the current hardening-only migrations against a fresh local database before a complete baseline migration is added. The legacy root SQL files are explicitly non-authoritative and must not be treated as that baseline. The next implementation step is to generate/review the authoritative baseline with Supabase CLI, then verify local reset before wiring Restore E2E to local Supabase.


## Ujian Online & Riwayat Belajar — 19 September 2026

Migration `20260919100000_add_exam_and_learning_history.sql` menambahkan delapan tabel: `exam_categories`, `exams`, `exam_questions`, `exam_question_options`, `exam_answer_keys`, `exam_attempts`, `exam_answers`, dan `material_reading_history`.

Seluruh tabel baru mengaktifkan RLS. Learner hanya dapat membaca ujian yang published, pertanyaan dan opsi dari ujian published, attempt miliknya sendiri, answer miliknya sendiri, serta reading history miliknya sendiri. Insert/update attempt dan answer tidak diberikan kepada browser; `exam-api` menggunakan server-side privileged client untuk membuat attempt dan melakukan penilaian.

Permission `exam.manage` dan `exam.read` ditambahkan untuk `admin` dan `super_admin`. Seed live saat ini: 4 kategori, 4 ujian published, 20 soal, dan 20 answer key.

`exam-api` adalah Edge Function authenticated-user dengan `verify_jwt=true`. Source repo berada di `supabase/functions/exam-api/index.ts` dan deployment live aktif.


## Learner role / user biasa — 19 September 2026

Migration `20260919120000_add_user_role_learner_access.sql` menambahkan role `user` (label **Pengguna**) dan tiga permission learner: `learning.read`, `exam.take`, dan `exam.history.read`.

Trigger `on_auth_user_created_assign_default_role` memberi role `user` secara otomatis untuk Auth user baru. Existing Auth users juga direkonsiliasi ke role tersebut saat migration diterapkan. Verifikasi live menemukan role `user`, ketiga permission terpetakan, trigger aktif, 4 Auth users, dan 4 assignment learner.

Role `user` berada di `user_roles`, bukan `admin_users`. RLS `user_roles` tetap membatasi pembacaan assignment self dan perubahan assignment hanya untuk Super Admin.

### Learner role and staff separation — 19 September 2026

Migration `20260919120000_add_user_role_learner_access.sql` menyediakan role learner `user`, permission learner, auto-assignment untuk Auth user baru, dan rekonsiliasi existing users. Migration `20260919123000_remove_user_role_from_staff.sql` membersihkan assignment learner dari staf. Migration `20260919124000_enforce_staff_learner_role_separation.sql` menambahkan trigger `trg_remove_learner_role_from_staff` pada `admin_users` agar staff creation/update tidak mempertahankan role learner.

Verifikasi live: role `user` tersedia; `learning.read`, `exam.take`, dan `exam.history.read` terpetakan; trigger Auth assignment dan staff-separation aktif; 0 staff memiliki role `user`.

## Reading history completion confirmation — 19 September 2026

`material_reading_history` sekarang hanya dibuat saat learner mengonfirmasi materi sudah dibaca sampai bagian paling bawah. Browser menampilkan checkbox dan tombol konfirmasi setelah sentinel di bagian akhir materi terdeteksi oleh `IntersectionObserver`.

Policy INSERT membatasi row baru ke `auth.uid()` sendiri dengan `status = 'completed'` dan `completed_at` terisi. Hak `UPDATE` untuk `authenticated` dicabut sehingga browser tidak dapat mengubah row riwayat secara langsung setelah tercatat. RLS SELECT tetap membatasi learner ke riwayat miliknya sendiri.

Catatan security: database tidak dapat membuktikan secara kriptografis bahwa pengguna benar-benar membaca setiap bagian layar; kontrol “sampai bawah” adalah sinyal browser yang dipadukan dengan konfirmasi eksplisit. Database tetap menjadi boundary kepemilikan dan status completion.
\n## Kategori Materi Dinamis — 19 September 2026\n\nMigration `20260919150000_add_materi_categories` menambahkan tabel `public.materi_categories` untuk katalog kategori materi yang dapat berkembang tanpa perubahan kode editor. Tabel memiliki `name`, `is_active`, dan timestamp, dengan unique index case-insensitive pada nama.\n\nRLS aktif. Public/learner hanya dapat membaca kategori aktif; pembuatan kategori hanya dapat dilakukan oleh authenticated user yang memiliki permission `content.manage_categories`. Verifikasi live setelah migration: tabel tersedia dan berisi 4 kategori hasil sinkronisasi dari materi existing: Advanced, Dasar, Intermediate, Tutorial.\n
## Kategori Materi — full management — 19 September 2026

Migration `20260919160000_allow_materi_category_management` menambahkan RLS UPDATE dan DELETE pada `public.materi_categories`. Keduanya hanya tersedia untuk authenticated user yang memiliki permission `content.manage_categories`, dengan `WITH CHECK` pada UPDATE untuk mempertahankan authorization setelah perubahan row.

UI kategori sekarang mendukung tambah, ubah nama, aktif/nonaktif, dan hapus. Rename dan delete memeriksa penggunaan kategori pada `materi.kategori`; kategori yang masih dipakai tidak dapat diubah namanya atau dihapus agar referensi materi berbasis nama tidak rusak. Untuk kategori yang sudah dipakai, gunakan nonaktifkan lalu buat kategori baru.


## Riwayat Ujian learner — 19 September 2026

UI learner sekarang menyediakan halaman `belajar/ujian-riwayat.html` yang membaca `exam_attempts` milik user melalui RLS dan menampilkan ujian, kategori, status, nilai, serta jumlah jawaban benar. Tidak ada answer key yang dibaca dari browser.
