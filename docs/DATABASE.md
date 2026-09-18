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
