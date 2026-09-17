# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Struktur dan readability kode Content/Admin dirapikan. Baseline Edge Function `create-staff` sudah disinkronkan dengan deployment aktif dan dukungan role Editor ditambahkan secara konsisten.

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

### 4. RPC permission
`public.get_my_permissions()` menggunakan `SECURITY DEFINER` dengan `search_path = public` dan membaca permission berdasarkan `auth.uid()` melalui `user_roles → role_permissions → permissions`.

Verifikasi privilege terbaru:
- `anon`: `EXECUTE = false`
- `authenticated`: `EXECUTE = true`

### 5. Integrasi Central Permission pada Content
Permission sudah dipakai pada halaman utama Content dan Administrasi, termasuk daftar materi, editor, version history, activity log, import, dan user administration.

Permission frontend hanya untuk guard/UX. RLS dan RPC tetap menjadi enforcement backend.

### 6. Daftar Materi dan workflow
`content/materials.html` mendukung:
- pencarian,
- filter status/kategori,
- Draft → Review → Published → Archived,
- editor,
- Riwayat Versi,
- pencatatan status ke `content_activity_logs`.

### 7. Riwayat Versi
Supabase memiliki:
- `materi_versions`,
- unique `(materi_id, version_number)`,
- trigger snapshot setelah insert/update `materi`,
- RLS untuk role content.

RPC `public.restore_materi_version(uuid)` tersedia, tidak dapat dieksekusi oleh `anon`, dan restore dibatasi di backend. End-to-end browser restore masih perlu pengujian.

### 8. Riwayat Aktivitas
Aktivitas dipisahkan menjadi:
- `content_activity_logs` untuk aktivitas materi,
- `system_activity_logs` untuk aktivitas administratif/sistem.

Halaman activity menggunakan central permission helper.

### 9. Kelola Pengguna
`admin/users.html` menggunakan permission terpusat untuk akses daftar dan aksi pengguna. RPC backend tetap menjadi enforcement utama.

### 10. Autosave & Draft Recovery
`shared/draft-recovery.js` menyediakan autosave lokal berbasis `localStorage`, debounce, recovery draft, konfirmasi restore, dan pembersihan draft setelah penyimpanan server berhasil.

### 11. Code readability / formatting
Batch formatting terbaru dilakukan tanpa sengaja mengubah alur fitur pada halaman dan helper Content/Admin.

Acuan formatting berada di `docs/CODE-STYLE.md`: indentasi 2 spasi, satu ide per baris, query Supabase multiline, CSS satu deklarasi per baris, dan perubahan formatting tidak mengubah behavior.

## 🔐 Checkpoint keamanan publik & Storage/RLS — 17 September 2026

### Public Website
Audit halaman publik dilakukan terhadap alur Website Publik → Detail Materi.

- `index.html` menggunakan query Supabase untuk daftar materi dan dimaksudkan hanya menampilkan materi `published`.
- `materi/view.html` sekarang secara eksplisit memfilter detail dengan `status='published'`.
- RLS `public.materi` juga membatasi SELECT publik ke `status='published'`, sehingga filter frontend bukan satu-satunya lapisan keamanan.
- Rendering konten di detail materi tetap melalui sanitasi HTML setelah parsing HTML/Markdown.

### Storage `materi-files`
Policy Storage telah diselaraskan dengan RBAC:
- Penulis, Editor, Admin, dan Super Admin dapat upload.
- Penulis, Editor, Admin, dan Super Admin dapat update.
- Admin dan Super Admin dapat delete.
- Publik tidak dapat upload/update/delete.
- Publik hanya dapat membaca file jika file tersebut berada di bucket `materi-files`, path-nya cocok dengan `materi.file_path`, dan materi terkait berstatus `published`.

### RLS tabel inti
Audit memastikan RLS aktif pada tabel inti:
- `admin_users`
- `content_activity_logs`
- `materi`
- `materi_versions`
- `permissions`
- `role_permissions`
- `roles`
- `system_activity_logs`
- `user_roles`

### Temuan yang sengaja ditunda
Ditemukan dua area yang perlu diselaraskan sebelum perubahan akses dilakukan:

1. `admin` memiliki permission `system.view_logs`, tetapi policy SELECT `system_activity_logs` saat ini masih membatasi pembacaan kepada `super_admin`.
2. Permission matrix memberikan Admin beberapa permission pengguna, sedangkan policy/RPC pengelolaan `admin_users` masih menggunakan jalur Super Admin untuk operasi staf tertentu.

Keduanya belum diubah agar tidak membuka akses tanpa desain permission/RLS/RPC yang konsisten.

## ⚡ Edge Function — sinkronisasi `create-staff`

Audit deployment menemukan source repository sebelumnya berbeda dari Edge Function aktif. Baseline sekarang sudah disamakan.

`create-staff`:
- deployment aktif sekarang **version 3**;
- `verify_jwt=true`;
- menggunakan `withSupabase({ auth: "user" })`;
- pembuatan user tetap dibatasi kepada Super Admin aktif;
- validasi password minimum 8 karakter dipertahankan;
- proses pembuatan Auth user dan `admin_users` mempertahankan rollback jika penyimpanan staf gagal;
- role `editor` sekarang diterima oleh Edge Function;
- daftar role yang diterima konsisten dengan role aplikasi: `super_admin`, `admin`, `penulis`, `editor`, `viewer`.

Source repo `supabase/functions/create-staff/index.ts` sudah diverifikasi setelah commit sinkronisasi. Perubahan deployment dilakukan ke version 3 dan diverifikasi kembali melalui metadata/source function aktif.

Perubahan ini tidak memperluas siapa yang boleh membuat user: otorisasi tetap Super Admin. Perubahan hanya menyelaraskan role Editor dengan RBAC yang sudah tersedia.

## ⚠️ Pekerjaan berikutnya

1. Uji browser Version Restore.
2. Uji Autosave & Draft Recovery.
3. Selaraskan `system_activity_logs` dengan permission `system.view_logs`.
4. Selaraskan `admin_users`/`update_staff` dengan permission user management yang sebenarnya.
5. Audit final query halaman publik dan sanitasi.
6. Audit final `SECURITY DEFINER`, `search_path`, RLS, Storage, dan index.
7. Audit final formatting seluruh repo.
8. Audit Edge Function lain (`swift-api`) dan source/deployment parity.
9. Update dokumentasi setelah setiap perubahan signifikan.

## 🧭 Titik lanjut sesi berikutnya

Mulai dari **audit Edge Function `swift-api` dan parity source/deployment**, kemudian lanjutkan RBAC Admin ↔ System Activity Log dan User Management. Setelah itu lakukan audit final formatting seluruh repo.

---

**Catatan sesi:** `create-staff` sudah sinkron antara repository dan deployment aktif. Role `editor` sudah diterima oleh Edge Function tanpa mengubah batas otorisasi pembuatan user.
