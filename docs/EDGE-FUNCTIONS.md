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
