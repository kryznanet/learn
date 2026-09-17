# Database Kryzna Learn

**Tanggal:** 17 September 2026

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

## Version history

`materi_versions` memakai unique `(materi_id, version_number)` dan index berdasarkan material/version. Trigger snapshot berjalan setelah insert/update `materi`.

## RPC penting

- `current_admin_role()` — role aktif user.
- `get_my_permissions()` — permission aktif user.
- `add_staff_by_email(...)` — jalur penambahan staf terproteksi.
- `update_staff(...)` — perubahan staf terproteksi.
- `restore_materi_version(...)` — restore versi terproteksi.
- `snapshot_materi_version()` — trigger-only function.

## RLS

RLS aktif pada tabel inti. Policy harus selalu dipandang bersama dengan permission mapping dan authorization RPC.

## Index / constraint

Workflow dan version history memiliki index/constraint yang mendukung pencarian status serta version lookup. Review index final tetap menjadi bagian audit database berikutnya.

## Migration discipline

Perubahan schema dilakukan melalui migration dan diverifikasi dengan query setelah penerapan. Dokumentasikan perubahan signifikan di `PROJECT-STATUS.md`.
