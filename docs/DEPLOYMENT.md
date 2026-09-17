# Deployment Kryzna Learn

**Tanggal:** 17 September 2026

## Komponen

- Website: GitHub Pages dari repository `kryznanet/learn`.
- Database/Auth/Storage: Supabase project Kryzna Learn.
- Edge Functions: Supabase Edge Functions.

## Sebelum deploy

- Pastikan perubahan berada di branch target yang benar.
- Jangan commit service-role/secret key.
- Review diff untuk perubahan behavior.
- Untuk schema, gunakan migration.
- Untuk Edge Function, bandingkan source dengan deployment aktif.

## Setelah deploy

### Website

- Buka halaman publik.
- Uji daftar/detail materi published.
- Uji login dan routing role.
- Uji Content/Admin sesuai permission.

### Supabase

- Verifikasi migration berhasil.
- Jalankan query verifikasi RLS/policy/function.
- Jalankan Security Advisor.
- Untuk Edge Function, verifikasi version/status dan source parity.

## Rollback

Rollback aplikasi dilakukan dengan commit/revert yang terkontrol. Rollback database harus menggunakan migration yang membalikkan perubahan secara eksplisit; jangan mengedit production schema secara manual tanpa pencatatan.
