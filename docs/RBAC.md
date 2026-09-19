# RBAC Kryzna Learn

**Tanggal:** 19 September 2026

## Role

| Role | Fungsi |
|---|---|
| `super_admin` | Kontrol penuh, termasuk role dan user management |
| `admin` | Administrasi dan pengelolaan materi sesuai permission |
| `editor` | Review, publish, archive, dan pengelolaan materi |
| `penulis` | Membuat dan memperbarui materi |
| `user` | Pengguna biasa: Belajar Saya, riwayat belajar, dan Ujian Online miliknya sendiri |
| `viewer` | Role legacy dengan akses baca konten |

## Permission utama

`content.read`, `content.create`, `content.update`, `content.delete`, `content.import`, `content.review`, `content.publish`, `content.archive`, `content.manage_categories`, `content.view_logs`, `users.read`, `users.create`, `users.update`, `users.disable`, `roles.manage`, `system.view_logs`, `settings.manage`, `exam.manage`, `exam.read`, `learning.read`, `exam.take`, `exam.history.read`.

## Mapping

- `super_admin`: seluruh permission.
- `admin`: permission content penuh sesuai matrix aplikasi, `users.read`, `system.view_logs`, `exam.manage`, dan `exam.read`; perubahan profil/status/role staf tetap khusus Super Admin melalui `update_staff()`.
- `editor`: content read/create/update/review/publish/archive/manage_categories/view_logs.
- `penulis`: content read/create/update/view_logs.
- `user`: `learning.read`, `exam.take`, dan `exam.history.read`. Tidak mendapat permission administrasi atau content-management.
- `viewer`: content.read.

## Learner / pengguna biasa

Migration `20260919120000_add_user_role_learner_access.sql` menambahkan role `user` dengan label **Pengguna** dan permission learner:

- `learning.read` — Akses Belajar Saya.
- `exam.take` — Mengikuti ujian online.
- `exam.history.read` — Melihat riwayat ujian.

Setiap user Auth baru otomatis mendapat role `user` melalui trigger `on_auth_user_created_assign_default_role`. User Auth yang sudah ada juga direkonsiliasi ke role tersebut saat migration diterapkan.

Role learner tidak disimpan sebagai staf di `admin_users`; identitas learner ditentukan melalui `user_roles`. Karena itu helper autentikasi harus dapat membaca role RBAC learner tanpa menganggap user sebagai staf.

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

Admin dapat membaca data staf sesuai policy. Perubahan profil/status/role staf melalui jalur administratif harus melewati `update_staff()`; RPC tersebut hanya menerima eksekusi efektif dari Super Admin. Direct UPDATE pada `admin_users` telah dicabut. Perubahan role dan pembuatan user tetap memerlukan Super Admin sesuai authorization RPC.

Direct write ke `user_roles` sekarang juga dibatasi oleh RLS: hanya `super_admin` yang dapat INSERT/UPDATE/DELETE assignment role. Admin tetap dapat SELECT assignment untuk kebutuhan administrasi, tetapi tidak dapat mengubah role secara langsung.

## Catatan legacy

`admin_users.role` masih dipertahankan untuk kompatibilitas dan sinkronisasi staf. RBAC terpusat menggunakan `roles`, `user_roles`, dan `role_permissions`. Role `user` bukan role staf dan tidak memerlukan row `admin_users`.

## Workflow status enforcement

Permission checks for `content.review`, `content.publish`, and `content.archive` are not UI-only. The `materi` RLS policies enforce the workflow boundary: `penulis` can only create/update authored `draft` rows; `editor` can create/update their own material across workflow statuses; `admin` and `super_admin` retain cross-author workflow mutation. All inserts require `author_id = auth.uid()`.

## Penghapusan materi — 19 September 2026

- Permission `content.delete` memiliki enforcement database pada tabel `public.materi`.
- RLS policy `Content admins can delete materi` membatasi DELETE kepada role `admin` dan `super_admin`.
- UI hanya menampilkan tombol Hapus kepada user yang memiliki `content.delete`.
- Penghapusan versi terkait mengikuti foreign key dengan `ON DELETE CASCADE`.

## Ujian Online — 19 September 2026

Permission `exam.manage` dan `exam.read` diberikan kepada `admin` dan `super_admin`. Pengguna `user` tidak membutuhkan permission staf untuk mengikuti ujian; akses learner ditentukan oleh Auth + role learner + RLS + Edge Function.

`exam-api` membuat attempt dan melakukan penilaian server-side. `exam_answer_keys` tidak dibaca oleh browser melalui Data API. Attempt dan answer hanya dapat dibaca oleh pemiliknya melalui RLS.


## Isolasi role learner dari staf — 19 September 2026

Role `user` hanya untuk akun learner non-staf. Trigger `trg_remove_learner_role_from_staff` pada `admin_users` menghapus assignment `user` ketika akun menjadi staf atau record staf diperbarui. Verifikasi live menunjukkan tidak ada staf yang masih memiliki role `user`.