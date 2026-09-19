# Struktur UI Kryzna Learn

**Tanggal pembaruan:** 17 September 2026  
**Branch:** `17-Sep-2026`

Dokumen ini menjadi acuan penamaan, struktur navigasi, dan pembagian area aplikasi Kryzna Learn. Istilah teknis database/API boleh tetap menggunakan nama internal yang sudah berjalan; istilah yang dilihat pengguna menggunakan bahasa Indonesia yang konsisten.

## 1. Struktur Utama

```text
Kryzna Learn
│
├── 🌐 Website Publik
│   ├── Beranda
│   └── Materi
│       └── Detail Materi
│
├── 📚 Kelola Materi
│   ├── Daftar Materi
│   ├── Tulis / Edit Materi
│   ├── Riwayat Versi
│   └── Riwayat Aktivitas Materi
│
└── 🛡️ Administrasi
    ├── Dashboard
    ├── Kelola Pengguna
    ├── Riwayat Aktivitas Sistem
    ├── Import Materi
    └── Pengaturan
```

### Prinsip pembagian

- **Website Publik**: area untuk membaca materi yang sudah dipublikasikan.
- **Kelola Materi**: workspace untuk membuat, mengedit, meninjau, menerbitkan, mengarsipkan, dan melihat riwayat materi.
- **Administrasi**: area untuk fungsi administratif dan kontrol sistem.
- Menu dan aksi mengikuti permission aktif pengguna.
- Validasi akses tetap dilakukan ketika halaman dibuka; frontend bukan satu-satunya lapisan keamanan.

## 2. Website Publik

### Beranda
Halaman utama Kryzna Learn untuk pengunjung.

Fungsi utama:
- menampilkan materi berstatus `published`,
- pencarian materi,
- filter kategori,
- navigasi menuju detail materi.

### Materi
Daftar materi publik.

### Detail Materi
Halaman untuk membaca satu materi secara lengkap. Konten publik mengikuti aturan visibility `published`.

## 3. Kelola Materi

### Daftar Materi
Fungsi:
- mencari materi,
- filter status,
- filter kategori,
- membuka editor sesuai `content.update`,
- membuka Riwayat Versi sesuai `content.read`,
- mengubah status sesuai permission workflow.

Workflow konten:

```text
Draft → Review → Published → Archived
  ↑                         │
  └─────────────────────────┘
```

Aksi workflow sekarang memeriksa permission seperti `content.review`, `content.publish`, `content.archive`, dan `content.update`. RLS tetap menjadi enforcement final.

### Tulis / Edit Materi
Editor materi untuk membuat atau mengubah konten.

Fungsi:
- rich text formatting,
- heading,
- ukuran teks,
- bold/italic/underline,
- list,
- alignment,
- preview,
- slug otomatis,
- Simpan Draft,
- Kirim ke Review,
- Riwayat Versi,
- **Autosave lokal & Draft Recovery**.

Permission:
- materi baru → `content.create`,
- edit materi → `content.update`,
- Kirim ke Review → `content.review`.

Autosave lokal menyimpan draft sementara di perangkat dan tidak membuat version snapshot baru di database pada setiap ketikan.

### Riwayat Versi
Menampilkan versi-versi sebelumnya dari satu materi.

Fungsi:
- melihat versi dengan `content.read`,
- meninjau isi versi,
- memulihkan versi dengan `content.update` pada frontend dan RPC terproteksi di backend.

Restore saat ini tersedia untuk role Editor, Admin, dan Super Admin pada backend. Setiap restore memperbarui materi, menghasilkan snapshot melalui trigger, dan mencatat aktivitas `version_restored`.

### Riwayat Aktivitas Materi
Log khusus untuk aktivitas yang berkaitan dengan materi, misalnya:
- membuat materi,
- mengubah materi,
- mengirim review,
- mengubah status,
- publish/archive,
- restore versi.

Data internal menggunakan `content_activity_logs`. Akses halaman menggunakan permission `content.view_logs`.

## 4. Administrasi

### Dashboard
Dashboard administratif sesuai role.

- **Dashboard Admin**: fokus pada operasional dan pengelolaan materi.
- **Dashboard Super Admin**: kontrol pengguna, role, aktivitas sistem, dan akses seluruh materi.

### Kelola Pengguna
Fungsi untuk mengelola akun staf dan aksesnya.

Role:
- `Penulis`
- `Editor`
- `Admin`
- `Super Admin`
- `Viewer` untuk kompatibilitas akun lama.

Permission terkait:
- melihat pengguna → `users.read`,
- mengubah display name → `users.update`,
- mengubah role → `roles.manage`,
- aktif/nonaktif → `users.disable`.

Perubahan role/status dilakukan melalui RPC backend yang memvalidasi hak akses dan menyinkronkan `admin_users` dengan `user_roles`.

### Riwayat Aktivitas Sistem
Log administratif/sistem yang terpisah dari aktivitas materi.

Contoh:
- perubahan data pengguna,
- perubahan role,
- aktivasi/nonaktifkan akun,
- tindakan administratif lainnya.

Data internal menggunakan `system_activity_logs`. Akses halaman menggunakan `system.view_logs`.

### Import Materi
Halaman untuk memasukkan materi dari file yang didukung, terutama DOCX/PDF. Akses menggunakan `content.import`.

### Pengaturan
Tempat untuk konfigurasi sistem yang akan ditambahkan bertahap.

## 5. Role dan Hak Akses

### Penulis
Membuat dan mengelola materi sesuai permission serta mengirim materi untuk review bila memiliki `content.review`.

### Editor
Meninjau dan memproses materi sesuai permission, termasuk restore versi sesuai aturan backend saat ini.

### Admin
Mengelola operasional materi dan fungsi administratif yang diberikan.

### Super Admin
Mengelola pengguna/role, aktivitas sistem, dan kontrol administratif tingkat sistem.

### Viewer
Akses lihat terbatas untuk kompatibilitas akun lama.

## 6. RBAC dan Permission

Permission yang telah didefinisikan di Supabase mencakup:

```text
content.read
content.create
content.update
content.delete
content.import
content.review
content.publish
content.archive
content.manage_categories
content.view_logs
users.read
users.create
users.update
users.disable
roles.manage
system.view_logs
settings.manage
```

### Status implementasi

- `KryznaAuth` menjadi helper role dan permission terpusat.
- Mapping role → permission tersedia melalui `role_permissions`.
- `get_my_permissions()` mengambil permission aktif berdasarkan `auth.uid()`.
- Halaman utama Content/Admin sudah mulai menggunakan `requirePermission(...)` dan `hasPermission(...)`.
- Permission final tetap harus ditegakkan oleh backend/database/RLS.

## 7. Standar Penamaan UI

| Jangan gunakan sebagai label utama | Gunakan |
|---|---|
| Content Workspace | Kelola Materi |
| Materials | Daftar Materi |
| Editor Materi | Tulis / Edit Materi |
| Content Activity Log | Riwayat Aktivitas Materi |
| System Activity Log | Riwayat Aktivitas Sistem |
| Manage Users / Kelola User | Kelola Pengguna |
| Import | Import Materi |
| Version History | Riwayat Versi |
| Restore | Pulihkan Versi |

Nama internal database, RPC, JavaScript API, dan endpoint tidak perlu diubah hanya demi mengikuti label UI.

## 8. Aturan Navigasi

- `Kelola Materi` menjadi pusat navigasi fitur content.
- `Administrasi` menjadi pusat navigasi fungsi sistem.
- `Riwayat Versi` dibuka berdasarkan `materi.id`.
- `Tulis / Edit Materi` dibuka berdasarkan `materi.id` saat mengedit.
- Link/menu dan tombol aksi yang dapat ditentukan di frontend disaring berdasarkan permission.
- Validasi akses tetap dilakukan ketika halaman dibuka.

## 9. Status Implementasi

| Area | Status |
|---|---|
| Website Publik | Aktif, masih perlu audit visibility `published` end-to-end |
| Kelola Materi | Aktif + central permission terintegrasi |
| Daftar Materi | Aktif + permission workflow |
| Tulis / Edit Materi | Aktif + `content.create/update/review` |
| Riwayat Versi | Aktif + `content.read/update`; restore browser E2E masih perlu diuji |
| Riwayat Aktivitas Materi | Aktif + `content.view_logs` |
| Dashboard Admin | Aktif |
| Dashboard Super Admin | Aktif |
| Kelola Pengguna | Aktif + `users.*` / `roles.manage` |
| Riwayat Aktivitas Sistem | Aktif + `system.view_logs` |
| Import Materi | Aktif + `content.import` |
| Pengaturan | Placeholder / tahap berikutnya |
| Central Role Helper | Aktif |
| Central Permission Helper | Aktif |
| Autosave + Draft Recovery | Aktif tahap awal; perlu pengujian recovery lintas skenario |

## 10. Acuan Pengembangan Berikutnya

1. Uji browser untuk Version Restore.
2. Uji Autosave & Draft Recovery.
3. Audit Activity Log dan Kelola Pengguna.
4. Pastikan Website Publik hanya menampilkan `published`.
5. Audit navigasi, workflow, dan keamanan Supabase/RLS.

Dokumen ini harus diperbarui apabila struktur menu, role, permission, atau status implementasi berubah secara signifikan.
\n\n## Kelola Konten, Kategori, dan Dashboard — 19 September 2026\n\n- Dashboard Admin sekarang menampilkan **Kelola Konten / Materi** dan akses **Kategori Materi**.\n- Workspace Kelola Materi memiliki halaman **Kategori Materi** untuk menambah kategori baru.\n- Editor materi mengambil kategori aktif dari `materi_categories`, sehingga pilihan tidak lagi hard-coded pada `Materi/Tutorial`.\n- Dashboard Super Admin sekarang menyediakan akses **Kelola Konten / Materi** dan halaman **Pengaturan**.\n- `admin/settings.html` menjadi titik awal pengaturan administratif; pengelolaan kategori tetap menggunakan permission `content.manage_categories`.\n