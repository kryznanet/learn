# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Riwayat Versi, Riwayat Aktivitas, Kelola Pengguna, serta Autosave & Draft Recovery sudah diperiksa/dilanjutkan. Pekerjaan berikutnya kembali ke central permission dan audit workflow.

## ✅ Progres terbaru — 17 September 2026

### 1. Struktur UI dan dokumentasi
Struktur aplikasi menggunakan tiga area utama:

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
    ├── Import Materi
    └── Pengaturan
```

Documentation hub tersedia di `docs/README.md`. Acuan UI tersedia di `docs/UI-STRUCTURE.md`.

### 2. Central authentication helper
`shared/auth.js` menjadi helper autentikasi/role terpusat.

Saat ini mencakup:
- user aktif,
- data `admin_users`,
- role aktif,
- `requireRole(...)`,
- helper role content/admin/Super Admin.

**Catatan:** central permission belum selesai. Struktur database saat ini memiliki `roles`, `permissions`, dan `user_roles`, tetapi tabel mapping `role_permissions` belum tersedia. Karena itu permission belum boleh dianggap terhubung penuh ke `KryznaAuth`.

### 3. Daftar Materi dan workflow
`content/materials.html` mendukung:
- pencarian,
- filter status/kategori,
- Draft → Review → Published → Archived,
- editor,
- Riwayat Versi,
- pencatatan status ke `content_activity_logs`.

### 4. Riwayat Versi
Supabase memiliki:
- `materi_versions`,
- unique `(materi_id, version_number)`,
- trigger snapshot setelah insert/update `materi`,
- RLS untuk role content.

`content/versions.html` sudah terhubung ke editor/Daftar Materi.

**Restore sudah diverifikasi tersedia:**
- RPC `public.restore_materi_version(uuid)` ada.
- RPC menggunakan `SECURITY DEFINER` dengan `search_path = public`.
- akses fungsi untuk `anon` = `false`.
- akses `authenticated` = `true`.
- fungsi hanya mengizinkan `editor`, `admin`, dan `super_admin`.
- restore memperbarui materi,
- trigger snapshot membuat versi baru,
- restore mencatat `version_restored` ke `content_activity_logs`.

End-to-end browser restore tetap perlu pengujian dengan akun role yang sesuai sebelum dinyatakan final.

### 5. Riwayat Aktivitas
Aktivitas dipisahkan menjadi:
- `content_activity_logs` untuk aktivitas materi,
- `system_activity_logs` untuk aktivitas administratif/sistem.

`shared/content-activity.js` digunakan oleh workspace materi.

`content/activity.html` tersedia untuk melihat aktivitas materi dan memfilter berdasarkan aksi.

Aktivitas user management juga sudah dicatat oleh RPC backend seperti `user_added` dan `user_updated` ke `system_activity_logs`.

### 6. Kelola Pengguna
`admin/users.html` tersedia untuk Super Admin.

Fungsi:
- daftar user melalui `list_staff`,
- pencarian nama/email,
- ubah display name,
- ubah role,
- aktif/nonaktif,
- sinkronisasi `admin_users` dengan `user_roles` melalui `update_staff`.

RPC `list_staff`, `update_staff`, dan `add_staff_by_email` telah diverifikasi:
- `SECURITY DEFINER`,
- `search_path` dikunci,
- `anon` tidak memiliki EXECUTE,
- `authenticated` memiliki EXECUTE,
- validasi hak akses dilakukan di database.

### 7. Autosave & Draft Recovery
Tahap Autosave & Draft Recovery sudah mulai diimplementasikan.

File baru:
- `shared/draft-recovery.js`

Integrasi dilakukan melalui `shared/auth.js` khusus ketika membuka `content/editor.html`.

Fungsi saat ini:
- autosave draft lokal menggunakan `localStorage`,
- debounce sekitar 900 ms setelah perubahan,
- menyimpan judul, deskripsi, kategori, dan isi editor,
- recovery ketika membuka editor kembali,
- konfirmasi sebelum memulihkan draft lokal,
- menghapus draft lokal setelah data server sudah sama/penyimpanan berhasil.

Autosave ini sengaja bersifat lokal agar setiap ketikan tidak membuat row/version baru di Supabase. Penyimpanan server tetap melalui tombol `Simpan Draft` atau `Kirim ke Review`.

## ⚠️ Hal yang masih perlu dilanjutkan

### Prioritas 1 — Central Permission
- Tentukan/implementasikan mapping role → permission.
- Hubungkan mapping tersebut ke `KryznaAuth`.
- Tambahkan `getPermissions(...)`, `hasPermission(...)`, dan `requirePermission(...)`.
- Integrasikan permission ke halaman Admin/Content.

### Prioritas 2 — Verifikasi Version Restore
- Uji restore sebagai Editor.
- Uji restore sebagai Admin/Super Admin.
- Pastikan Penulis tidak dapat restore.
- Pastikan snapshot dan `version_restored` tercatat setelah restore.

### Prioritas 3 — Penyempurnaan Activity & User Management
- Samakan `KryznaAuth` pada halaman activity/users yang masih menggunakan pemeriksaan role lokal.
- Audit actor visibility agar tidak bergantung pada SELECT `admin_users` yang tidak dimiliki semua role.
- Rapikan label/action agar konsisten dengan event yang benar-benar dicatat.

### Prioritas 4 — Autosave & Draft Recovery
- Uji recovery saat refresh/tab tertutup.
- Uji draft baru dan draft edit materi lama.
- Tambahkan indikator autosave yang tidak menimpa pesan hasil simpan server.
- Pertimbangkan server-side draft recovery jika dibutuhkan lintas perangkat/browser.

### Prioritas 5 — Public content
- Pastikan query Website Publik dan Detail Materi secara eksplisit menggunakan `status='published'`.
- Verifikasi sanitasi HTML/Markdown.

### Prioritas 6 — Security audit
- Audit ulang advisory `SECURITY DEFINER`.
- Audit `search_path` semua fungsi.
- Audit RLS dan index.
- Evaluasi leaked password protection.

## 🔐 Catatan keamanan
Supabase mendokumentasikan bahwa RLS harus tetap menjadi lapisan enforcement utama untuk tabel yang terekspos, dan fungsi `SECURITY DEFINER` harus dibatasi secara hati-hati. Karena itu helper frontend hanya berfungsi sebagai UX/guard tambahan; hak akses final tetap di database/RLS/RPC.

## 🧭 Aturan kerja
- Fetch file/schema dan gunakan SHA terbaru sebelum update.
- Setelah perubahan GitHub, fetch ulang dan verifikasi.
- Setelah perubahan Supabase, jalankan query verifikasi.
- Jangan menandai fitur selesai sebelum mekanismenya benar-benar teruji.
- Setiap perubahan signifikan harus dicatat kembali ke dokumentasi.

## ▶️ Titik lanjut sesi berikutnya

1. Implementasi central permission dan mapping role → permission.
2. Integrasi permission ke seluruh halaman Admin/Content.
3. Pengujian browser untuk Version Restore.
4. Pengujian Autosave & Draft Recovery.
5. Audit Activity Log dan Kelola Pengguna.
6. Audit final UI, workflow, dan keamanan.

---

**Catatan sesi:** Progres sesi 17 September 2026 disimpan di dokumen ini agar pekerjaan berikutnya dapat dilanjutkan tanpa kehilangan konteks.
