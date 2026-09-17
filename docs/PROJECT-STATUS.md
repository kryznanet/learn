# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Central Permission sudah diimplementasikan dan kini terintegrasi pada workspace Content, editor, version history, activity log, system activity log, dan user administration.

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
`shared/auth.js` menjadi helper autentikasi, role, dan permission terpusat.

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
Database memiliki tabel mapping:
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

Mapping sudah tersedia untuk `super_admin`, `admin`, `editor`, dan `penulis`; role legacy `viewer` tetap tersedia dengan akses `content.read`.

Super Admin mendapat seluruh permission yang tersedia. Role lain mendapat permission sesuai fungsi masing-masing.

### 4. RPC permission
`public.get_my_permissions()` menggunakan `SECURITY DEFINER` dengan `search_path = public` dan membaca permission berdasarkan `auth.uid()` melalui `user_roles → role_permissions → permissions`.

Verifikasi privilege terbaru:
- `anon`: `EXECUTE = false`
- `authenticated`: `EXECUTE = true`

### 5. Integrasi Central Permission pada Content
Permission sekarang dipakai langsung pada halaman:
- `content/index.html` → `content.read` dan penyaringan kartu berdasarkan permission.
- `content/materials.html` → `content.read`, `content.update`, `content.review`, `content.publish`, `content.archive`.
- `content/editor.html` → `content.create` untuk materi baru, `content.update` untuk edit, `content.review` untuk Kirim ke Review.
- `content/versions.html` → `content.read`; tombol dan aksi restore mengikuti `content.update`.
- `content/activity.html` → `content.view_logs`.
- `admin/import.html` → `content.import`.

Permission frontend hanya untuk guard/UX. RLS dan RPC tetap menjadi enforcement backend.

### 6. Daftar Materi dan workflow
`content/materials.html` mendukung:
- pencarian,
- filter status/kategori,
- Draft → Review → Published → Archived,
- editor,
- Riwayat Versi,
- pencatatan status ke `content_activity_logs`.

Aksi workflow sekarang memeriksa permission yang sesuai, bukan hanya nama role di frontend.

### 7. Riwayat Versi
Supabase memiliki:
- `materi_versions`,
- unique `(materi_id, version_number)`,
- trigger snapshot setelah insert/update `materi`,
- RLS untuk role content.

`content/versions.html` sudah terhubung ke editor/Daftar Materi dan menggunakan permission `content.read` serta `content.update` untuk restore.

**Restore tersedia:**
- RPC `public.restore_materi_version(uuid)` tersedia.
- menggunakan `SECURITY DEFINER` dengan `search_path = public`.
- `anon` tidak memiliki EXECUTE.
- `authenticated` memiliki EXECUTE.
- restore dibatasi untuk role yang sesuai di backend.
- restore memperbarui materi, membuat snapshot versi baru, dan mencatat `version_restored`.

End-to-end browser restore masih perlu pengujian dengan akun role yang sesuai sebelum dinyatakan final.

### 8. Riwayat Aktivitas
Aktivitas dipisahkan menjadi:
- `content_activity_logs` untuk aktivitas materi,
- `system_activity_logs` untuk aktivitas administratif/sistem.

`content/activity.html` sekarang menggunakan `content.view_logs` melalui `KryznaAuth`.

`admin/activity.html` sekarang menggunakan `system.view_logs` melalui `KryznaAuth`.

### 9. Kelola Pengguna
`admin/users.html` tersedia untuk pengguna dengan permission `users.read`.

Fungsi:
- daftar user melalui `list_staff`,
- pencarian nama/email,
- ubah display name dengan `users.update`,
- ubah role dengan `roles.manage`,
- aktif/nonaktif dengan `users.disable`,
- sinkronisasi `admin_users` dengan `user_roles` melalui `update_staff`.

RPC backend tetap menjadi enforcement utama.

### 10. Autosave & Draft Recovery
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

### Prioritas 1 — Verifikasi Version Restore
- Uji restore sebagai Editor.
- Uji restore sebagai Admin/Super Admin.
- Pastikan Penulis tidak dapat restore.
- Pastikan snapshot dan `version_restored` tercatat setelah restore.

### Prioritas 2 — Autosave & Draft Recovery
- Uji recovery saat refresh/tab tertutup.
- Uji draft baru dan draft edit materi lama.
- Tambahkan indikator autosave yang tidak menimpa pesan hasil simpan server.
- Pertimbangkan server-side draft recovery jika dibutuhkan lintas perangkat/browser.

### Prioritas 3 — Audit Activity & User Management
- Audit actor visibility agar tidak bergantung pada SELECT `admin_users` yang tidak dimiliki semua role.
- Rapikan label/action agar konsisten dengan event yang benar-benar dicatat.
- Audit permission terhadap setiap action backend RPC.

### Prioritas 4 — Public content
- Pastikan query Website Publik dan Detail Materi secara eksplisit menggunakan `status='published'`.
- Verifikasi sanitasi HTML/Markdown.

### Prioritas 5 — Security audit
- Audit ulang advisory `SECURITY DEFINER`.
- Audit `search_path` semua fungsi.
- Audit RLS dan index.
- Evaluasi leaked password protection.

## 🔐 Catatan keamanan
RLS tetap menjadi lapisan enforcement utama. `KryznaAuth` digunakan untuk UX dan guard halaman, sedangkan akses final harus ditegakkan oleh database/RLS/RPC.

`get_my_permissions()` sudah diverifikasi: `anon` tidak memiliki EXECUTE, sedangkan `authenticated` memiliki EXECUTE.

## 🧭 Aturan kerja
- Fetch file/schema dan gunakan SHA terbaru sebelum update.
- Setelah perubahan GitHub, fetch ulang dan verifikasi.
- Setelah perubahan Supabase, jalankan query verifikasi.
- Jangan menandai fitur selesai sebelum mekanismenya benar-benar teruji.
- Setiap perubahan signifikan harus dicatat kembali ke dokumentasi.

## ▶️ Titik lanjut sesi berikutnya

1. Uji browser Version Restore.
2. Uji Autosave & Draft Recovery.
3. Audit Activity Log dan Kelola Pengguna.
4. Pastikan Website Publik hanya menampilkan `published`.
5. Audit final UI, workflow, dan keamanan.

---

**Catatan sesi:** Pada 17 September 2026, Central Permission telah diterapkan sampai ke halaman Content dan Administrasi utama. Database/RLS/RPC tetap menjadi lapisan keamanan final.
