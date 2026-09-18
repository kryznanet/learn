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

## Version history

`materi_versions` memakai unique `(materi_id, version_number)` dan index berdasarkan material/version. Trigger `trg_snapshot_materi_version` berjalan setelah insert/update `materi`.

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

## Index / constraint

Workflow dan version history memiliki index/constraint yang mendukung pencarian status serta version lookup. Review index final tetap menjadi bagian audit database berikutnya.

## Migration discipline

Perubahan schema dilakukan melalui migration dan diverifikasi dengan query setelah penerapan. Dokumentasikan perubahan signifikan di `PROJECT-STATUS.md`.

### Security hardening — 18 September 2026

Migration `20260918010522_harden_trigger_function_privileges_20260918` menetapkan `search_path = public` pada `set_materi_updated_at()` dan mencabut `EXECUTE` eksplisit untuk role API pada `snapshot_materi_version()`.

Migration `20260918010535_restrict_trigger_function_execute_20260918` mencabut `EXECUTE` dari `PUBLIC`, `anon`, dan `authenticated` pada `snapshot_materi_version()`.

Migration `20260918010830_restrict_internal_security_definer_helpers` mencabut `EXECUTE` dari `PUBLIC`, `anon`, dan `authenticated` pada `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, dan `get_my_role(uuid)` karena ketiganya tidak diperlukan sebagai RPC langsung.

Verifikasi database mengonfirmasi `anon_execute=false`, `authenticated_execute=false`, dan `public_execute=false` untuk `snapshot_materi_version()`. Pengujian transaksional insert/update pada `materi` menghasilkan dua `materi_versions` lalu di-rollback.
