# Security Kryzna Learn

**Tanggal:** 18 September 2026

## Prinsip

- Browser hanya memakai Supabase publishable key.
- Service role/secret key tidak boleh dikirim ke browser.
- RLS adalah enforcement utama untuk data.
- SECURITY DEFINER harus memiliki `search_path` eksplisit dan authorization yang jelas.
- Privileged Auth API menggunakan Edge Function.

## Public content

Public hanya boleh membaca materi berstatus `published`. Detail materi juga melakukan filter `published`; RLS menjadi lapisan enforcement kedua.

## Storage

Bucket `materi-files` menggunakan policy RBAC untuk upload/update/delete. Public read dibatasi pada file yang terhubung ke materi `published`.

## Audit log

`content_activity_logs` mencatat aktivitas materi. `system_activity_logs` mencatat aktivitas administratif/sistem. Akses dibatasi melalui RBAC/RLS.

## SECURITY DEFINER checkpoint

RPC yang memang menjadi jalur aplikasi tetap dapat executable oleh `authenticated` jika memiliki authorization internal. Function yang hanya dipanggil sebagai trigger tidak boleh diekspos ke anon/authenticated.

### Hardening 18 September 2026

- `snapshot_materi_version()` sekarang tetap `SECURITY DEFINER` dan memiliki `search_path = public`, tetapi `EXECUTE` telah dicabut dari `PUBLIC`, `anon`, dan `authenticated` karena function hanya digunakan oleh trigger.
- `set_materi_updated_at()` sekarang memiliki `search_path = public` eksplisit.
- Trigger `trg_snapshot_materi_version` pada `materi` tetap aktif untuk `AFTER INSERT OR UPDATE`.
- Pengujian transaksional insert/update menghasilkan dua snapshot versi dan kemudian di-rollback, sehingga tidak meninggalkan data uji.

## Remaining Security Advisor findings

- Beberapa application RPC `SECURITY DEFINER` masih executable oleh `authenticated`; masing-masing perlu review authorization dan kebutuhan API sebelum privilege diubah.
- Leaked Password Protection Supabase masih disabled dan perlu dievaluasi/diaktifkan melalui konfigurasi Auth.

## Security review checklist

- [x] RLS aktif pada tabel sensitif.
- [x] Public SELECT hanya pada data yang memang publik.
- [x] Storage write hanya role yang berwenang.
- [x] SECURITY DEFINER yang di-hardening memakai search_path aman.
- [x] Trigger-only function tidak executable publik.
- [x] Edge Function secret tidak bocor ke client.
- [ ] Auth password protection ditinjau/diaktifkan.
- [x] Security Advisor dijalankan setelah hardening.
