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

- **Website Publik**: area yang dapat digunakan untuk membaca materi yang sudah dipublikasikan.
- **Kelola Materi**: workspace untuk membuat, mengedit, meninjau, menerbitkan, mengarsipkan, dan melihat riwayat materi.
- **Administrasi**: area untuk fungsi administratif dan kontrol sistem.
- Menu ditampilkan sesuai role/permission pengguna.
- Pengguna tidak seharusnya mendapatkan akses ke halaman yang berada di luar hak aksesnya hanya karena mengetahui URL halaman tersebut; validasi akses tetap dilakukan di aplikasi dan database/RLS.

## 2. Website Publik

### Beranda
Halaman utama Kryzna Learn untuk pengunjung.

Fungsi utama:
- menampilkan materi yang berstatus `published`,
- pencarian materi,
- filter kategori,
- navigasi menuju detail materi.

### Materi
Daftar materi publik.

### Detail Materi
Halaman untuk membaca satu materi secara lengkap.

Konten yang ditampilkan ke publik harus mengikuti aturan visibility `published`.

## 3. Kelola Materi

### Daftar Materi
Halaman utama workspace konten.

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

Fungsi yang sudah direncanakan/tersedia:
- rich text formatting,
- heading,
- ukuran teks,
- bold/italic/underline,
- list,
- alignment,
- tabel/link/gambar sesuai kemampuan editor,
- preview,
- slug otomatis,
- simpan Draft,
- Kirim ke Review,
- Riwayat Versi.

Tahap lanjutan:
- autosave,
- indikator penyimpanan,
- draft recovery.

### Riwayat Versi
Menampilkan versi-versi sebelumnya dari satu materi.

Fungsi:
- melihat versi,
- membandingkan/meninjau isi versi,
- memulihkan versi setelah mekanisme restore dinyatakan aman dan terverifikasi.

Setiap perubahan penting harus tetap tercatat melalui version snapshot dan activity log.

### Riwayat Aktivitas Materi
Log khusus untuk aktivitas yang berkaitan dengan materi, misalnya:
- membuat materi,
- mengubah materi,
- mengirim review,
- mengubah status,
- publish,
- archive,
- aktivitas terkait versioning.

Data internal menggunakan tabel `content_activity_logs`.

## 4. Administrasi

### Dashboard
Dashboard administratif sesuai role.

Saat ini terdapat pembagian:
- **Dashboard Admin**: fokus pada operasional dan pengelolaan materi.
- **Dashboard Super Admin**: kontrol pengguna, role, aktivitas sistem, dan akses seluruh materi.

Super Admin diarahkan ke panel Super Admin dan tidak menggunakan Dashboard Admin sebagai panel utama.

### Kelola Pengguna
Fungsi untuk mengelola akun staf dan aksesnya.

Role yang digunakan:
- `Penulis`
- `Editor`
- `Admin`
- `Super Admin`
- `Viewer` — dipertahankan untuk kompatibilitas akun lama.

Fungsi utama:
- melihat staf,
- mencari staf,
- mengubah role,
- mengaktifkan/nonaktifkan akses,
- mengubah display name sesuai hak akses.

Pembuatan akun staff tetap mengikuti mekanisme backend yang aman dan tidak boleh mempercayakan hak administratif hanya pada frontend.

### Riwayat Aktivitas Sistem
Log administratif/sistem yang terpisah dari aktivitas materi.

Contoh aktivitas:
- perubahan data pengguna,
- perubahan role,
- aktivasi/nonaktifkan akun,
- tindakan administratif lainnya.

Data internal menggunakan `system_activity_logs`.

### Import Materi
Halaman untuk memasukkan materi dari file yang didukung, terutama DOCX/PDF.

Setelah import, materi masuk ke workflow Kelola Materi dan dapat diproses sesuai role/permission.

### Pengaturan
Tempat untuk konfigurasi sistem yang akan ditambahkan bertahap.

Akses harus dibatasi menggunakan permission administratif yang sesuai.

## 5. Role dan Hak Akses

### Penulis
- membuat materi,
- mengedit materi yang menjadi tanggung jawabnya sesuai aturan,
- mengirim materi untuk review,
- tidak memiliki hak administratif sistem.

### Editor
- mengelola/review materi sesuai permission,
- memproses materi pada tahap workflow yang diizinkan,
- tidak memiliki kontrol pengguna sistem kecuali diberikan permission khusus.

### Admin
- mengelola operasional materi,
- import dan pengelolaan konten sesuai permission,
- tidak menjadi pengelola utama pengguna/konfigurasi Super Admin.

### Super Admin
- kontrol administratif tingkat sistem,
- mengelola pengguna dan role,
- melihat aktivitas sistem,
- mengakses seluruh materi sesuai permission.

### Viewer
- akses lihat terbatas,
- dipertahankan untuk kompatibilitas akun lama,
- tidak digunakan sebagai role aktif untuk workflow content baru.

## 6. RBAC dan Permission

Role adalah identitas tingkat tinggi pengguna. Permission menjadi sumber aturan akses yang lebih rinci.

Permission yang telah didefinisikan di Supabase mencakup antara lain:

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

### Prinsip implementasi

- `KryznaAuth` digunakan sebagai helper autentikasi/role terpusat di frontend.
- Central permission pada `KryznaAuth` masih dalam tahap implementasi dan belum dianggap selesai.
- Permission final tetap harus ditegakkan oleh backend/database/RLS.
- Menyembunyikan tombol saja bukan mekanisme keamanan.

## 7. Standar Penamaan UI

Gunakan istilah berikut secara konsisten:

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

- Setiap halaman workspace memiliki akses kembali ke area induknya.
- `Kelola Materi` menjadi pusat navigasi untuk fitur content.
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
| Riwayat Versi | Aktif, restore masih perlu verifikasi |
| Riwayat Aktivitas Materi | Aktif |
| Dashboard Admin | Aktif |
| Dashboard Super Admin | Aktif |
| Kelola Pengguna | Aktif |
| Riwayat Aktivitas Sistem | Aktif |
| Import Materi | Aktif |
| Pengaturan | Placeholder / tahap berikutnya |
| Central Role Helper | Aktif |
| Central Permission Helper | Belum selesai |
| Autosave + Draft Recovery | Belum selesai |

## 10. Acuan Pengembangan Berikutnya

Urutan pengembangan yang digunakan:

1. Central Permission pada `KryznaAuth`.
2. Integrasi permission ke seluruh halaman Admin/Content.
3. Verifikasi restore Riwayat Versi.
4. Autosave dan Draft Recovery.
5. Audit navigasi dan konsistensi UI.
6. Audit keamanan frontend dan Supabase/RLS.

Dokumen ini harus diperbarui apabila struktur menu, role, permission, atau status implementasi berubah secara signifikan.
