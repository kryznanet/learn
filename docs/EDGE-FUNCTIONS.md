# Edge Functions Kryzna Learn

**Tanggal:** 18 September 2026

| Function | Deployment | JWT | Source repo |
|---|---:|---|---|
| `create-staff` | v3 ACTIVE | `true` | `supabase/functions/create-staff/index.ts` |
| `swift-api` | v1 ACTIVE | `true` | Tidak ada di branch `18-Sep-2026` |

## create-staff

Menggunakan `withSupabase({ auth: "user" })`. Pembuatan user dibatasi Super Admin aktif. Role yang diterima: `super_admin`, `admin`, `penulis`, `editor`, `viewer`. Proses Auth user dan `admin_users` memiliki rollback jika penyimpanan staf gagal.

Source repo dan deployment aktif sudah diverifikasi parity setelah deployment version 3.

## swift-api

Merupakan endpoint demo/legacy yang aktif di Supabase tetapi tidak memiliki counterpart source di branch ini. Audit deployment v1 menunjukkan JWT verification aktif dan tidak terlihat akses database/Storage Kryzna Learn. Consumer eksternal belum dapat dibuktikan tidak ada; jangan hapus sebelum diverifikasi. Detail audit berada di `SWIFT-API-AUDIT.md`.

Jangan menghapus function aktif sebelum consumer eksternal dipastikan tidak ada.

## Deployment checklist

1. Bandingkan source repo dengan source deployment aktif.
2. Pastikan auth mode dan `verify_jwt` sesuai desain.
3. Pastikan secret tidak berada di source/browser.
4. Deploy.
5. Verifikasi version/status.
6. Fetch source deployment kembali untuk parity check.
7. Catat hasil di dokumentasi.


## exam-api — 19 September 2026

Edge Function baru untuk Ujian Online. Endpoint hanya menerima user JWT (`verify_jwt=true`) dan memakai `withSupabase({ auth: 'user' })`.

- `start`: membuat/melanjutkan attempt aktif dan mengembalikan soal + opsi tanpa answer key.
- `submit`: memvalidasi attempt milik user, membaca answer key server-side, menghitung nilai, menyimpan answer dan hasil attempt.
- Source: `supabase/functions/exam-api/index.ts`.
- Deployment live: ACTIVE, version 1, JWT verification enabled.
- Secret/service-role credential tidak berada di source browser.


## manage-users — 19 September 2026
`manage-users` menyediakan action `list`, `create`, dan `update` untuk akun learner. Authorization hanya Admin/Super Admin aktif. Function dideploy dengan `verify_jwt=true`; create menggunakan Auth Admin API dan trigger database otomatis memberikan role `user` kepada akun baru. Update mendukung display name, email, password opsional, dan active/disabled.
