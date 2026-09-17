# RBAC Kryzna Learn

**Tanggal:** 17 September 2026

## Role

| Role | Fungsi |
|---|---|
| `super_admin` | Kontrol penuh, termasuk role dan user management |
| `admin` | Administrasi dan pengelolaan materi sesuai permission |
| `editor` | Review, publish, archive, dan pengelolaan materi |
| `penulis` | Membuat dan memperbarui materi |
| `viewer` | Role legacy dengan akses baca konten |

## Permission utama

`content.read`, `content.create`, `content.update`, `content.delete`, `content.import`, `content.review`, `content.publish`, `content.archive`, `content.manage_categories`, `content.view_logs`, `users.read`, `users.create`, `users.update`, `users.disable`, `roles.manage`, `system.view_logs`, `settings.manage`.

## Mapping

- `super_admin`: seluruh permission.
- `admin`: permission content penuh sesuai matrix aplikasi, user read/update/disable, dan `system.view_logs`; role management tetap Super Admin.
- `editor`: content read/create/update/review/publish/archive/manage_categories/view_logs.
- `penulis`: content read/create/update/view_logs.
- `viewer`: content.read.

## Enforcement

```text
UI → shared/auth.js → permission UX
                    ↓
             RLS / RPC backend
                    ↓
             PostgreSQL / Auth
```

`get_my_permissions()` mengambil permission melalui `user_roles → role_permissions → permissions`. UI tidak boleh dianggap sebagai security boundary.

## User management

Admin dapat membaca dan memperbarui profil/status staf melalui policy yang diselaraskan. Perubahan role dan pembuatan user melalui jalur administratif tetap memerlukan Super Admin.

## Catatan legacy

`admin_users.role` masih dipertahankan untuk kompatibilitas dan sinkronisasi. RBAC terpusat menggunakan `roles`, `user_roles`, dan `role_permissions`.
