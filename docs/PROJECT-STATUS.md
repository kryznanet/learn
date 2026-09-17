# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Progres sesi sudah dicatat. Pekerjaan dapat dilanjutkan dari tahap RBAC, navigasi, dan penyempurnaan workspace.

## ✅ Progres terbaru — 17 September 2026

### 1. Struktur UI dan penamaan
Struktur aplikasi diseragamkan menjadi:

```text
Kryzna Learn
├── 🌐 Website Publik
│   ├── Beranda
│   └── Materi
├── 📚 Kelola Materi
│   ├── Daftar Materi
│   ├── Tulis / Edit Materi
│   ├── Riwayat Versi
│   └── Riwayat Aktivitas Materi
└── 🛡️ Administrasi
    ├── Dashboard
    ├── Kelola Pengguna
    ├── Riwayat Aktivitas Sistem
    └── Pengaturan
```

Istilah UI utama yang digunakan:
- `Kelola Materi`
- `Daftar Materi`
- `Tulis / Edit Materi`
- `Riwayat Versi`
- `Riwayat Aktivitas Materi`
- `Kelola Pengguna`
- `Riwayat Aktivitas Sistem`
- `Import Materi`

Dokumentasi struktur UI tersedia di `docs/UI-STRUCTURE.md`.

### 2. Central authentication helper
File `shared/auth.js` sudah dibuat sebagai helper autentikasi/otorisasi terpusat.

Fungsi yang tersedia saat ini mencakup:
- mengambil user aktif,
- mengambil data `admin_users`,
- membaca role aktif,
- `requireRole(...)`,
- helper `isContent`, `isAdmin`, dan `isSuperAdmin`.

Halaman yang sudah mulai menggunakan helper ini:
- `content/index.html`
- `content/materials.html`
- `admin/index.html`
- `admin/dashboard.html`

**Catatan:** centralisasi role sudah berjalan, tetapi centralisasi permission database belum selesai. `permissions` pada helper masih perlu dihubungkan dengan RBAC Supabase secara penuh.

### 3. Dashboard dan navigasi
Dashboard Super Admin dan Admin sudah dirapikan agar menggunakan nama UI baru dan navigasi yang konsisten.

Perubahan penting:
- Super Admin menggunakan `KryznaAuth.requireRole(['super_admin'])`.
- Admin menggunakan `KryznaAuth.requireRole(['admin','super_admin'])` dan Super Admin diarahkan ke panel Super Admin.
- Import Materi dari Dashboard Admin diarahkan langsung ke `admin/import.html`.
- Navigasi menuju Website Publik, Kelola Materi, dan panel administrasi sudah diseragamkan.

### 4. Daftar Materi
`content/materials.html` sekarang:
- menggunakan `KryznaAuth`,
- memiliki filter pencarian, status, dan kategori,
- mendukung workflow Draft → Review → Published → Archived,
- menampilkan tombol `Tulis / Edit`,
- menampilkan tombol `Riwayat Versi`,
- mencatat perubahan status ke `content_activity_logs`.

### 5. Editor Materi
`content/editor.html` sudah memiliki:
- rich text editor,
- bold/italic/underline,
- heading,
- ukuran font,
- list,
- alignment,
- preview,
- sanitasi HTML,
- slug otomatis,
- simpan Draft,
- Kirim ke Review,
- integrasi Riwayat Versi,
- pencatatan aktivitas materi.

Perbaikan penting sebelumnya: saat mengedit materi, `author_id` tidak lagi ditimpa dengan user editor. `author_id` hanya diisi ketika membuat materi baru.

### 6. Riwayat Versi
Supabase sudah memiliki `materi_versions` dan trigger snapshot versi pada perubahan materi.

Frontend `content/versions.html` sudah tersedia dan terintegrasi dari editor serta daftar materi.

**Catatan:** mekanisme restore versi masih perlu diverifikasi kembali apakah RPC restore yang aman sudah tersedia sebelum fitur restore dinyatakan selesai.

### 7. Activity Log
Aktivitas sudah dipisahkan menjadi:
- `content_activity_logs` untuk aktivitas materi,
- `system_activity_logs` untuk aktivitas administratif/sistem.

Helper `shared/content-activity.js` sudah tersedia dan digunakan oleh workspace materi.

### 8. RBAC Supabase
Role yang digunakan:
- `penulis`
- `editor`
- `admin`
- `super_admin`
- `viewer` untuk kompatibilitas akun lama

Permission yang sudah didefinisikan mencakup operasi content, user management, role management, system logs, dan settings.

RLS untuk materi, log, role, permission, dan user role sudah diperketat pada migration sebelumnya.

## ⚠️ Hal yang masih perlu dilanjutkan

### Prioritas 1 — Central Permission
- Hubungkan `shared/auth.js` dengan `roles`, `permissions`, dan `user_roles`.
- Tambahkan helper seperti `hasPermission(...)` dan `requirePermission(...)`.
- Pastikan UI menggunakan permission, bukan hanya nama role.
- Verifikasi assignment permission untuk seluruh role.

### Prioritas 2 — Penyempurnaan halaman workspace
- Terapkan `KryznaAuth` ke seluruh halaman Admin dan Content yang masih menggunakan pemeriksaan role lokal.
- Rapikan `admin/users.html`, `admin/activity.html`, `admin/profile.html`, `admin/import.html`, `content/versions.html`, dan `content/activity.html`.
- Samakan header, breadcrumb/navigasi, label, dan tombol antarhalaman.

### Prioritas 3 — Workflow dan versioning
- Verifikasi restore versi secara end-to-end.
- Tambahkan kontrol akses restore berdasarkan permission.
- Pastikan setiap restore menghasilkan version snapshot dan activity log yang benar.

### Prioritas 4 — Autosave
- Implementasikan autosave editor.
- Tambahkan indikator status: menyimpan, tersimpan, gagal.
- Tambahkan recovery draft apabila browser/tab tertutup sebelum penyimpanan selesai.

### Prioritas 5 — Public content
- Pastikan query website publik dan halaman materi secara eksplisit hanya meminta `status='published'`.
- Verifikasi kembali sanitasi HTML/Markdown dan keamanan konten yang ditampilkan.

## 🔐 Catatan keamanan
Audit/hardening Supabase sebelumnya menemukan beberapa advisory yang tetap perlu diverifikasi ulang, termasuk:
- hak execute fungsi `SECURITY DEFINER`,
- `search_path` fungsi database,
- leaked password protection,
- index foreign key/activity log,
- dan struktur RLS policy.

Perbaikan hardening yang sudah diterapkan antara lain pembatasan akses `current_admin_role()`, RLS visibility untuk materi published, pembatasan insert/update/delete materi, serta pembatasan actor pada activity log.

## 🧭 Aturan kerja
- Perubahan dilakukan bertahap.
- Fetch file/schema dan gunakan SHA terbaru sebelum melakukan update.
- Setelah perubahan, fetch/verifikasi kembali hasilnya.
- Untuk perubahan Supabase, lakukan verifikasi query setelah migration.
- Jangan menganggap central permission, restore, atau hardening selesai sebelum benar-benar diverifikasi.

## ▶️ Titik lanjut sesi berikutnya

**Mulai dari:**
1. Central permission pada `shared/auth.js`.
2. Integrasi permission ke seluruh halaman Admin/Content.
3. Verifikasi dan penyempurnaan Riwayat Versi + Restore.
4. Autosave dan Draft Recovery.
5. Audit final UI, workflow, dan keamanan.

---

**Catatan sesi:** Progres sesi 17 September 2026 telah disimpan di dokumen ini agar pekerjaan berikutnya dapat dilanjutkan tanpa kehilangan konteks.