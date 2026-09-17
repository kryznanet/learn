# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Central Permission sudah diimplementasikan pada database dan `KryznaAuth`. Mapping role → permission, RPC permission, helper frontend, dan verifikasi akses fungsi sudah dilakukan.

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

### 2. Central authentication & permission helper
`shared/auth.js` sekarang menjadi helper autentikasi, role, dan permission terpusat.

Fungsi yang tersedia:
- `getUser()`
- `getStaff()`
- `getPermissions()`
- `getSession()` dengan daftar permission aktif
- `requireRole(...)`
- `requirePermission(...)`
- `hasRole(...)`
- `hasPermission(...)`
- helper `isContent`, `isAdmin`, dan `isSuperAdmin`

Permission diambil dari RPC `public.get_my_permissions()` sehingga frontend tidak perlu menentukan mapping role secara manual.

### 3. Role → Permission
Database sekarang memiliki tabel mapping:
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

`role_permissions` sudah diisi untuk role:
- `super_admin`
- `admin`
- `editor`
- `penulis`
- `viewer`

Super Admin mendapat seluruh permission yang tersedia. Role lain mendapat permission sesuai fungsi masing-masing.

### 4. RPC permission
Dibuat `public.get_my_permissions()` sebagai `SECURITY DEFINER` dengan `search_path = public`.

Verifikasi privilege:
- `anon`: tidak memiliki EXECUTE.
- `authenticated`: memiliki EXECUTE.

RPC hanya membaca permission berdasarkan `auth.uid()` dan relasi `user_roles → role_permissions → permissions`.

### 5. Daftar Materi dan workflow
`content/materials.html` mendukung:
- pencarian,
- filter status/kategori,
- Draft → Review → Published → Archived,
- editor,
- Riwayat Versi,
- pencatatan status ke `content_activity_logs`.

### 6. Riwayat Versi
Supabase memiliki:
- `materi_versions`,
- unique `(materi_id, version_number)`,
- trigger snapshot setelah insert/update `materi`,
- RLS untuk role content.

`content/versions.html` sudah terhubung ke editor/Daftar Materi.

**Restore tersedia:**
- RPC `public.restore_materi_version(uuid)` tersedia.
- menggunakan `SECURITY DEFINER` dengan `search_path = public`.
- `anon` tidak memiliki EXECUTE.
- `authenticated` memiliki EXECUTE.
- restore dibatasi untuk role yang sesuai.
- restore memperbarui materi, membuat snapshot versi baru, dan mencatat `version_restored`.

End-to-end browser restore masih perlu pengujian dengan akun role yang sesuai sebelum dinyatakan final.

### 7. Riwayat Aktivitas
Aktivitas dipisahkan menjadi:
- `content_activity_logs` untuk aktivitas materi,
- `system_activity_logs` untuk aktivitas administratif/sistem.

`shared/content-activity.js` digunakan oleh workspace materi.

`content/activity.html` tersedia untuk melihat aktivitas materi dan memfilter berdasarkan aksi.

Aktivitas user management juga dicatat oleh RPC backend seperti `user_added` dan `user_updated` ke `system_activity_logs`.

### 8. Kelola Pengguna
`admin/users.html` tersedia untuk Super Admin.

Fungsi:
- daftar user melalui `list_staff`,
- pencarian nama/email,
- ubah display name,
- ubah role,
- aktif/nonaktif,
- sinkronisasi `admin_users` dengan `user_roles` melalui `update_staff`.

RPC `list_staff`, `update_staff`, dan `add_staff_by_email` telah diverifikasi memiliki kontrol akses backend dan tidak memberikan EXECUTE kepada `anon`.

### 9. Autosave & Draft Recovery
Tahap Autosave & Draft Recovery sudah mulai diimplementasikan.

File:
- `shared/draft-recovery.js`

Fungsi saat ini:
- autosave draft lokal menggunakan `localStorage`,
- debounce sekitar 900 ms setelah perubahan,
- menyimpan judul, deskripsi, kategori, dan isi editor,
- recovery ketika membuka editor kembali,
- konfirmasi sebelum memulihkan draft lokal,
- menghapus draft lokal setelah penyimpanan server berhasil.

Autosave sengaja bersifat lokal agar setiap ketikan tidak membuat row/version baru di Supabase.

## ⚠️ Hal yang masih perlu dilanjutkan

### Prioritas 1 — Integrasi Central Permission
- Terapkan `requirePermission(...)` pada seluruh halaman Admin/Content yang sesuai.
- Ganti pemeriksaan role lokal jika permission yang lebih spesifik sudah tersedia.
- Pastikan tombol/action juga mengikuti permission tanpa menjadikannya satu-satunya lapisan keamanan.

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
RLS tetap menjadi lapisan enforcement utama. `KryznaAuth` digunakan untuk UX dan guard halaman, sedangkan akses final harus ditegakkan oleh database/RLS/RPC.

`get_my_permissions()` dibatasi agar hanya role `authenticated` yang dapat mengeksekusinya; `anon` sudah diverifikasi tidak memiliki EXECUTE.

## 🧭 Aturan kerja
- Fetch file/schema dan gunakan SHA terbaru sebelum update.
- Setelah perubahan GitHub, fetch ulang dan verifikasi.
- Setelah perubahan Supabase, jalankan query verifikasi.
- Jangan menandai fitur selesai sebelum mekanismenya benar-benar teruji.
- Setiap perubahan signifikan harus dicatat kembali ke dokumentasi.

## ▶️ Titik lanjut sesi berikutnya

1. Integrasikan `requirePermission(...)` ke seluruh halaman Admin/Content.
2. Pengujian browser untuk Version Restore.
3. Pengujian Autosave & Draft Recovery.
4. Audit Activity Log dan Kelola Pengguna.
5. Pastikan Website Publik hanya menampilkan `published`.
6. Audit final UI, workflow, dan keamanan.

---

**Catatan sesi:** Progres 17 September 2026 disimpan di dokumen ini agar pekerjaan berikutnya dapat dilanjutkan tanpa kehilangan konteks.
