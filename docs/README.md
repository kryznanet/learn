# 📚 Dokumentasi Kryzna Learn

Selamat datang di pusat dokumentasi **Kryzna Learn**.

Folder `docs/` menjadi titik masuk utama untuk memahami kondisi proyek, struktur UI, arsitektur, database, keamanan, dan workflow pengembangan.

> **Mulai dari:** [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) untuk melihat progres terakhir dan titik pengembangan berikutnya.

## 🚀 Status & Arah Proyek

### [PROJECT-STATUS.md](./PROJECT-STATUS.md)
Catatan utama perkembangan proyek.

Berisi:
- progres terakhir,
- fitur yang sudah selesai,
- fitur yang masih dikerjakan,
- catatan teknis penting,
- masalah yang perlu diperbaiki,
- prioritas pengembangan berikutnya.

**Gunakan file ini sebagai titik awal setiap kali melanjutkan sesi pengembangan.**

## 🎨 UI & UX

### [UI-STRUCTURE.md](./UI-STRUCTURE.md)
Acuan struktur halaman, navigasi, pembagian modul, role, dan standar penamaan UI.

Berisi:
- Website Publik,
- Kelola Materi,
- Administrasi,
- workflow materi,
- role dan permission,
- aturan navigasi,
- status implementasi UI.

## 🏗️ Architecture

### `architecture/ARCHITECTURE.md`
Dokumentasi arsitektur aplikasi dan hubungan antar komponen.

**Status:** akan dibuat ketika arsitektur inti sudah didokumentasikan secara lengkap.

## 🗄️ Database

### `database/DATABASE.md`
Dokumentasi struktur database dan relasi data Supabase.

Rencana isi:
- tabel utama,
- relasi,
- status workflow,
- RBAC,
- activity log,
- version history,
- aturan RLS.

**Status:** akan dibuat pada tahap dokumentasi database.

## 🔐 Security

### `security/SECURITY.md`
Dokumentasi keamanan aplikasi.

Rencana isi:
- autentikasi,
- RBAC,
- permission,
- Row Level Security (RLS),
- aturan akses publik/private,
- keamanan RPC/Edge Function,
- catatan security advisor.

**Status:** akan dibuat pada tahap audit keamanan.

## 🛠️ Development

### `development/DEVELOPMENT.md`
Panduan workflow pengembangan Kryzna Learn.

Rencana isi:
- struktur repository,
- aturan branch,
- pola commit,
- cara melanjutkan pekerjaan,
- aturan perubahan database,
- proses verifikasi setelah perubahan.

**Status:** akan dibuat setelah workflow development distandarkan.

## 🧭 Urutan Membaca

Untuk melanjutkan pengembangan proyek, gunakan urutan berikut:

```text
1. docs/README.md
       ↓
2. docs/PROJECT-STATUS.md
       ↓
3. docs/UI-STRUCTURE.md
       ↓
4. Dokumentasi teknis sesuai pekerjaan
       ├── architecture/
       ├── database/
       ├── security/
       └── development/
```

## 📌 Aturan Dokumentasi

- Dokumentasi harus mencerminkan kondisi repository yang sebenarnya.
- Jangan menandai fitur sebagai selesai sebelum implementasi diverifikasi.
- Perubahan besar pada UI, role, permission, database, keamanan, atau workflow harus diikuti pembaruan dokumentasi terkait.
- `PROJECT-STATUS.md` digunakan untuk **kondisi/progres proyek**.
- `UI-STRUCTURE.md` digunakan untuk **struktur dan aturan UI**.
- Dokumentasi teknis digunakan untuk **detail implementasi**.

## 🔄 Titik Lanjut Saat Ini

Prioritas pengembangan yang tercatat saat ini:

1. Central Permission pada `KryznaAuth`.
2. Integrasi permission ke halaman Admin/Content.
3. Verifikasi mekanisme restore Riwayat Versi.
4. Autosave dan Draft Recovery.
5. Audit navigasi dan konsistensi UI.
6. Audit keamanan frontend dan Supabase/RLS.

Dokumen status utama: [PROJECT-STATUS.md](./PROJECT-STATUS.md)
