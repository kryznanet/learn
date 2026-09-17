# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Audit Edge Function, parity deployment, dan penyelarasan RBAC utama dilanjutkan. Perubahan backend sudah diverifikasi; pekerjaan security hardening berikutnya dicatat sebagai checkpoint.

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
`admin/users.html` menggunakan permission terpusat untuk akses daftar dan aksi pengguna. Backend sekarang diselaraskan dengan pembagian akses: Admin dapat membaca dan memperbarui profil/status staf, sedangkan perubahan role dan jalur penambahan user tetap berada pada Super Admin.

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

### Penyelarasan RBAC terbaru
Policy `system_activity_logs` sekarang mengizinkan Admin dan Super Admin membaca log sistem, sesuai permission `system.view_logs`.

Policy `admin_users` sekarang mengizinkan Admin dan Super Admin membaca serta memperbarui profil/status staf. Pembagian kewenangan role tetap dijaga oleh RPC: perubahan role dan penambahan user melalui jalur administratif tetap memerlukan Super Admin.

### Security Advisor checkpoint
Setelah perubahan RBAC, temuan yang tersisa adalah:
- `set_materi_updated_at()` memiliki mutable `search_path`.
- `snapshot_materi_version()` adalah `SECURITY DEFINER` yang masih executable oleh anon/authenticated dan perlu dibatasi karena dipakai sebagai trigger.
- Beberapa SECURITY DEFINER RPC lain tetap executable oleh authenticated karena merupakan jalur aplikasi dan memiliki authorization internal.
- Leaked Password Protection Supabase masih disabled.

Tidak ada perubahan pada temuan-temuan tersebut pada sesi ini.

## ⚡ Edge Function — `create-staff` dan `swift-api`

### `create-staff`
Baseline source repository dan deployment aktif sudah disamakan.

- deployment aktif **version 3**;
- `verify_jwt=true`;
- menggunakan `withSupabase({ auth: "user" })`;
- pembuatan user tetap dibatasi kepada Super Admin aktif;
- role `editor` diterima;
- role yang diterima: `super_admin`, `admin`, `penulis`, `editor`, `viewer`.

### `swift-api`
Audit parity dilakukan terhadap deployment aktif.

- deployment: **version 1 ACTIVE**;
- `verify_jwt=true`;
- source aktif tidak memiliki counterpart di branch `17-Sep-2026`;
- function merupakan endpoint demo dan tidak memakai tabel/Storage Kryzna Learn;
- tidak ada perubahan deployment dilakukan;
- audit detail dicatat di `docs/SWIFT-API-AUDIT.md`.

Catatan: konfigurasi `verify_jwt=true` perlu ditinjau jika function tersebut benar-benar akan digunakan dengan publishable/secret key melalui `withSupabase`, mengikuti pola autentikasi Edge Functions Supabase saat ini.

## 🛑 Checkpoint sesi ini

Sesi dihentikan setelah:
1. Audit `swift-api` dan parity source/deployment selesai.
2. `system_activity_logs` diselaraskan dengan permission `system.view_logs`.
3. Policy `admin_users` diselaraskan agar Admin dapat membaca dan memperbarui profil/status staf, sementara perubahan role tetap dibatasi melalui RPC Super Admin.
4. Security Advisor dijalankan ulang dan hasil terbaru dicatat.
5. Tidak ada perubahan pada hardening `set_materi_updated_at`, `snapshot_materi_version`, atau leaked password protection.

## ⚠️ Pekerjaan selanjutnya

1. Hardening `snapshot_materi_version()` — revoke `EXECUTE` untuk anon/authenticated tanpa memutus trigger.
2. Hardening `set_materi_updated_at()` dengan `search_path` yang eksplisit.
3. Evaluasi dan, bila sesuai, aktifkan Leaked Password Protection.
4. Verifikasi ulang Security Advisor setelah hardening.
5. Uji browser Version Restore.
6. Uji Autosave & Draft Recovery.
7. Audit final query halaman publik dan sanitasi.
8. Audit final `SECURITY DEFINER`, RLS, Storage, dan index.
9. Audit final formatting seluruh repo.
10. Review apakah `swift-api` memiliki consumer eksternal; jangan hapus sebelum penggunaan dipastikan tidak ada.

## 🧭 Titik lanjut sesi berikutnya

Mulai dari **hardening `snapshot_materi_version()` dan `set_materi_updated_at()`**, lalu jalankan ulang Security Advisor. Setelah itu lanjutkan E2E Version Restore/Autosave dan audit final repo.

---

**Catatan sesi:** parity `create-staff` sudah sinkron dan role `editor` sudah konsisten. `swift-api` sudah diaudit tetapi masih menjadi deployment tanpa source counterpart di repo. RBAC Admin ↔ System Activity Log dan User Management sudah diselaraskan pada layer policy, dengan perubahan role tetap Super Admin-only.
