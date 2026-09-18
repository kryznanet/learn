# RBAC Kryzna Learn

**Tanggal:** 18 September 2026

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
- `admin`: permission content penuh sesuai matrix aplikasi, `users.read`, dan `system.view_logs`; perubahan profil/status/role staf tetap khusus Super Admin melalui `update_staff()`.
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

Admin dapat membaca data staf sesuai policy. Perubahan profil/status/role staf melalui jalur administratif harus melewati `update_staff()`; direct UPDATE pada `admin_users` telah dicabut. Perubahan role dan pembuatan user tetap memerlukan Super Admin sesuai authorization RPC.

Direct write ke `user_roles` sekarang juga dibatasi oleh RLS: hanya `super_admin` yang dapat INSERT/UPDATE/DELETE assignment role. Admin tetap dapat SELECT assignment untuk kebutuhan administrasi, tetapi tidak dapat mengubah role secara langsung.

## Catatan legacy

`admin_users.role` masih dipertahankan untuk kompatibilitas dan sinkronisasi. RBAC terpusat menggunakan `roles`, `user_roles`, dan `role_permissions`.


## Workflow status enforcement

Permission checks for `content.review`, `content.publish`, and `content.archive` are not UI-only. The `materi` RLS policies enforce the workflow boundary: `penulis` can only create/update authored `draft` rows; `editor` can create/update authored rows across workflow statuses; `admin` and `super_admin` retain cross-author workflow mutation. All inserts require `author_id = auth.uid()`.
