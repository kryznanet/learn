# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 16 September 2026  
**Status sesi:** Pekerjaan hari ini selesai. Dilanjutkan besok.

## ✅ Yang sudah dikerjakan

### 1. Struktur aplikasi dan dashboard admin
- Dashboard admin sudah tersedia dengan menu:
  - 📊 Dashboard
  - 📥 Import Materi
  - 📚 Kelola Materi
  - ✏️ Editor Materi
  - 👥 Kelola User (Super Admin)
- Akses dashboard menggunakan autentikasi login.
- Hak akses berbasis role sudah diterapkan pada antarmuka admin:
  - `super_admin`: pengelolaan user/role dan seluruh materi.
  - `admin`: kelola/import/edit/delete materi.
  - `penulis`: tambah/import/edit materi, tanpa delete.
  - `viewer`: akses lihat saja.

### 2. Fitur materi
- Import file `.docx` dan `.pdf` sudah tersedia.
- File PDF asli disimpan di Supabase Storage.
- File DOCX asli disimpan dan kontennya dapat dikonversi ke HTML dengan Mammoth.
- Editor materi sudah mendukung kebutuhan dasar seperti format teks, tabel, link, gambar, dan live preview.
- CRUD materi terhubung ke Supabase.

### 3. Autentikasi dan akun admin
- Login admin menggunakan Supabase Auth.
- Persistensi session dan auto refresh token sudah dikonfigurasi.
- Reset password/request reset sudah tersedia.
- Halaman profile admin sudah tersedia, termasuk:
  - ubah nama/profile,
  - verifikasi password lama sebelum perubahan password,
  - perubahan email,
  - upload avatar,
  - session management.
- MFA/TOTP untuk Super Admin sudah diimplementasikan.

### 4. Pengelolaan user dan aktivitas
- Edge Function `create-staff` sudah dibuat dan aktif untuk membuat akun staff.
- Fitur Kelola User menggunakan RPC untuk daftar dan perubahan data staff.
- Activity log dan halaman `activity.html` sudah tersedia untuk Super Admin.
- Kolom kompatibilitas `title`, `detail`, dan `user_email` sudah ditambahkan pada tabel `activity_logs` untuk menyesuaikan kebutuhan kode aplikasi.

### 5. Kerapian kode
- File HTML, JavaScript, TypeScript, JSON, dan README yang relevan sudah dirapikan menggunakan Prettier.
- Workflow formatter sementara sudah berhasil dijalankan dan kemudian dihapus kembali dari repository.
- File utama yang telah dirapikan mencakup dashboard, import, preview, login, profile, activity, reset password, reset request, users, `index.html`, `supabase-config.js`, dan Edge Function `create-staff`.

## ⚠️ Temuan yang masih perlu ditindaklanjuti

Audit sebelumnya menemukan beberapa advisory keamanan/performa Supabase yang **belum dinyatakan selesai**:

- Beberapa fungsi `SECURITY DEFINER` masih perlu diaudit hak aksesnya terhadap `anon` dan `authenticated`.
- Fungsi tertentu masih perlu memastikan `search_path` aman/fixed.
- Perlindungan terhadap password yang pernah bocor di Supabase Auth masih perlu diperiksa/diaktifkan bila sesuai kebutuhan.
- `activity_logs.user_id` perlu memastikan index yang sesuai tersedia.
- Beberapa RLS policy masih memiliki potensi perbaikan pada penggunaan `auth.*()` dan struktur policy.
- Terdapat beberapa policy permissive yang perlu diaudit agar tidak memberikan akses lebih luas dari yang diperlukan.

> Temuan di atas adalah daftar audit/hardening yang perlu diverifikasi ulang sebelum perubahan diterapkan. Tidak ada perubahan tambahan yang dijalankan pada sesi penutupan hari ini.

## ▶️ Rencana berikutnya — 17 September 2026

### Prioritas 1 — Audit keamanan Supabase
1. Audit seluruh RLS policy pada `admin_users`, `materi`, dan `activity_logs`.
2. Audit fungsi `SECURITY DEFINER` dan hak execute untuk `anon`/`authenticated`.
3. Audit `search_path` fungsi database.
4. Verifikasi index foreign key `activity_logs.user_id`.
5. Verifikasi konfigurasi leaked password protection.
6. Periksa kembali hasil Security Advisor setelah kondisi aktual dipetakan.

### Prioritas 2 — Audit aplikasi
1. Uji alur login + MFA.
2. Uji RBAC untuk semua role.
3. Uji import PDF/DOCX.
4. Uji editor dan penyimpanan materi.
5. Uji Kelola User.
6. Uji profile, reset password, session management, dan activity log.

### Prioritas 3 — Audit keamanan frontend
- Periksa potensi XSS pada materi/editor/preview.
- Periksa validasi upload dan ukuran/tipe file.
- Periksa penggunaan URL/link yang berasal dari input user.
- Periksa pembatasan akses halaman admin dan konsistensi validasi role.

### Prioritas 4 — Perbaikan terkontrol
- Setelah audit selesai, setiap temuan diklasifikasikan menjadi:
  - **Aman / tidak perlu tindakan**
  - **Perlu diperbaiki**
  - **Prioritas tinggi**
- Perubahan hanya diterapkan setelah ditinjau dan diputuskan.

## 🔒 Aturan kerja sesi berikutnya
- Audit/read-only terlebih dahulu.
- **Jangan menjalankan perubahan Supabase atau kode secara langsung tanpa persetujuan untuk eksekusi.**
- Simpan perubahan secara bertahap dengan commit yang jelas.
- Verifikasi hasil setiap perubahan sebelum lanjut ke bagian berikutnya.

---

**Catatan penutupan:** Sesi 16 September 2026 dihentikan pada tahap dokumentasi progres. Pekerjaan dilanjutkan dari bagian **Audit & Hardening** pada sesi berikutnya.
