# Legacy & Cleanup Inventory

**Tanggal:** 17 September 2026

## `swift-api`

Deployment Supabase masih ACTIVE v1, tetapi tidak memiliki source counterpart pada branch `17-Sep-2026`. Function diaudit sebagai demo/legacy. Jangan hapus sebelum consumer eksternal dipastikan tidak ada.

## `supabase-config-legacy.js`

Masih ada di repository. Sebelum dihapus, cari seluruh referensi runtime/build dan pastikan tidak dibutuhkan.

## Legacy helper RPC

Beberapa helper lama seperti `is_admin`, `can_manage_materi`, dan `can_delete_materi` masih tercatat di database. Sebagian sudah tidak menjadi jalur policy utama. Penghapusan harus didahului pencarian referensi repo, policy, trigger, function, dan consumer.

## Legacy activity path

`admin/profile.html` masih memiliki jalur logging lama yang menggunakan `activity_logs`. Jangan dihapus/diubah hanya berdasarkan nama; lakukan audit schema dan runtime reference terlebih dahulu.

## Cleanup rule

Legacy code/database object hanya boleh dihapus setelah:
1. semua consumer ditemukan;
2. pengganti sudah aktif dan terverifikasi;
3. tidak ada dependency database tersembunyi;
4. rollback/restore path dipahami;
5. perubahan dicatat di changelog dan status proyek.
