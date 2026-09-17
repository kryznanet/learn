# Changelog Kryzna Learn

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

## Checkpoint akhir sesi — 17 September 2026

- Tidak ada perubahan behavior aplikasi pada checkpoint ini.
- Dokumentasi workflow pengembangan sudah masuk repository.
- `PROJECT-STATUS.md` diperbarui untuk mencatat checkpoint dan pekerjaan berikutnya.

## Aturan pencatatan

Setiap perubahan signifikan pada schema, RBAC, security, Edge Function, atau behavior utama harus ditambahkan ke changelog dan `PROJECT-STATUS.md`.

Setiap commit juga wajib melalui siklus dokumentasi: **ubah → commit → verifikasi → update dokumentasi & progres → verifikasi dokumentasi → lanjut**.
