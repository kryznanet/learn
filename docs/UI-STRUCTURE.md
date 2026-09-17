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
- Menu ditampilkan sesuai role/permission pengguna.
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
- membuka editor,
- membuka Riwayat Versi,
- melihat dan mengubah status sesuai permission.

Workflow konten:

```text
Draft → Review → Published → Archived
  ↑                         │
  └─────────────────────────┘
```

Transisi status harus dikendalikan oleh permission/RLS, bukan hanya tombol frontend.

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

Autosave lokal menyimpan draft sementara di perangkat dan tidak membuat version snapshot baru di database pada setiap ketikan.

### Riwayat Versi
Menampilkan versi-versi sebelumnya dari satu materi.

Fungsi:
- melihat versi,
- meninjau isi versi,
- memulihkan versi melalui RPC terproteksi.

Restore saat ini tersedia untuk role Editor, Admin, dan Super Admin pada backend. Setiap restore memperbarui materi, menghasilkan snapshot melalui trigger, dan mencatat aktivitas `version_restored`.

### Riwayat Aktivitas Materi
Log khusus untuk aktivitas yang berkaitan dengan materi, misalnya:
- membuat materi,
- mengubah materi,
- mengirim review,
- mengubah status,
- publish/archive,
- restore versi.

Data internal menggunakan `content_activity_logs`.

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

Fungsi:
- melihat staf,
- mencari staf,
- mengubah role,
- mengaktifkan/nonaktifkan akses,
- mengubah display name sesuai hak akses.

Perubahan role/status dilakukan melalui RPC backend yang memvalidasi hak akses dan menyinkronkan `admin_users` dengan `user_roles`.

### Riwayat Aktivitas Sistem
Log administratif/sistem yang terpisah dari aktivitas materi.

Contoh:
- perubahan data pengguna,
- perubahan role,
- aktivasi/nonaktifkan akun,
- tindakan administratif lainnya.

Data internal menggunakan `system_activity_logs`.

### Import Materi
Halaman untuk memasukkan materi dari file yang didukung, terutama DOCX/PDF.

### Pengaturan
Tempat untuk konfigurasi sistem yang akan ditambahkan bertahap.

## 5. Role dan Hak Akses

### Penulis
Membuat dan mengelola materi sesuai hak akses serta mengirim materi untuk review.

### Editor
Meninjau dan memproses materi sesuai hak akses, termasuk restore versi sesuai aturan backend saat ini.

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

- `KryznaAuth` sudah menjadi helper role terpusat.
- Central permission frontend **belum selesai**.
- Database saat ini memiliki `roles`, `permissions`, dan `user_roles`, tetapi mapping role → permission belum tersedia sebagai tabel `role_permissions`.
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
- Link menuju halaman yang tidak sesuai role/permission tidak ditampilkan bila dapat ditentukan di frontend.
- Validasi akses tetap dilakukan ketika halaman dibuka.

## 9. Status Implementasi

| Area | Status |
|---|---|
| Website Publik | Aktif, masih perlu audit visibility `published` end-to-end |
| Kelola Materi | Aktif |
| Daftar Materi | Aktif |
| Tulis / Edit Materi | Aktif |
| Riwayat Versi | Aktif; restore RPC tersedia, browser E2E masih perlu diuji |
| Riwayat Aktivitas Materi | Aktif |
| Dashboard Admin | Aktif |
| Dashboard Super Admin | Aktif |
| Kelola Pengguna | Aktif |
| Riwayat Aktivitas Sistem | Aktif |
| Import Materi | Aktif |
| Pengaturan | Placeholder / tahap berikutnya |
| Central Role Helper | Aktif |
| Central Permission Helper | Belum selesai |
| Autosave + Draft Recovery | Aktif tahap awal; perlu pengujian recovery lintas skenario |

## 10. Acuan Pengembangan Berikutnya

1. Implementasi mapping role → permission dan central permission pada `KryznaAuth`.
2. Integrasi permission ke seluruh halaman Admin/Content.
3. Uji browser untuk Version Restore.
4. Uji Autosave & Draft Recovery.
5. Audit Activity Log dan Kelola Pengguna.
6. Audit navigasi, workflow, dan keamanan Supabase/RLS.

Dokumen ini harus diperbarui apabila struktur menu, role, permission, atau status implementasi berubah secara signifikan.
