# Swift API Audit

**Tanggal audit:** 18 September 2026  
**Branch audit:** `18-Sep-2026`

## Status deployment

Supabase project `wtmkudojxenkjkoegibf` memiliki Edge Function `swift-api`:

- Status: `ACTIVE`
- Version: `1`
- JWT verification: `true`
- Source repository counterpart: **tidak ditemukan** pada branch `18-Sep-2026`
- Deployment source hash: `6ccb86e9607420d75fcd790e0cd86de168ef8ec12ed4724f0cb496be59646a2e`

Repository search untuk `swift-api`, `swift_api`, dan referensi endpoint tidak menemukan source/configuration counterpart. Karena itu parity source repository ↔ deployment tidak dapat dibuktikan.

## Source deployment yang terverifikasi

Deployment version 1 berisi satu file `index.ts` dengan pola:

- menggunakan `withSupabase({ auth: ["publishable", "secret"] })`;
- menerima JSON payload dengan field `name`;
- mode `secret` mengembalikan pesan admin;
- mode `publishable` mengembalikan pesan biasa;
- tidak terlihat query database, Storage access, atau operasi terhadap tabel Kryzna Learn pada source yang terambil.

Komentar source menyebut secret mode sebagai jalur privileged/RLS-bypass. Hal ini membuat endpoint tetap perlu dianggap privileged surface walaupun source saat ini hanya melakukan operasi respons sederhana.

## Temuan

### 1. Source parity — Needs Verification

Tidak ada counterpart source `swift-api` di repository branch `18-Sep-2026`. Deployment aktif dapat dibaca dan hash deployment sudah dicatat, tetapi tidak ada source repository untuk dibandingkan.

### 2. Authentication — Verified

`verify_jwt = true`. Runtime source menggunakan auth mode `publishable` dan `secret`.

### 3. Data access — No application-data access observed

Source deployment yang terambil tidak melakukan akses ke database/Storage Kryzna Learn. Ini adalah observasi terhadap version 1 yang aktif, bukan jaminan bahwa consumer eksternal tidak ada.

### 4. External consumer — Needs Verification

Belum ada bukti dari repository bahwa `swift-api` dipanggil oleh aplikasi Kryzna Learn. Namun repository tidak cukup untuk membuktikan tidak adanya consumer eksternal. Karena function masih ACTIVE, jangan menghapus atau mengganti deployment sebelum consumer eksternal diverifikasi.

## Keputusan audit

**Status: Pending / Needs Verification.**

Tidak ada perubahan atau penghapusan terhadap `swift-api` pada checkpoint ini.

Langkah sebelum retirement:

1. Identifikasi consumer eksternal yang menggunakan endpoint.
2. Pastikan tidak ada dependency deployment, automation, atau dokumentasi eksternal.
3. Jika tidak ada consumer, siapkan retirement plan dan rollback path.
4. Setelah retirement dilakukan, verifikasi function tidak lagi ACTIVE dan catat hasilnya.

## Evidence

- Supabase Edge Function inventory: `swift-api`, ACTIVE, version 1, JWT verification enabled.
- Deployment source `index.ts` berhasil diambil dari Supabase.
- GitHub branch `18-Sep-2026` tidak memiliki path `swift-api` dan repository search tidak menemukan source/config counterpart.
