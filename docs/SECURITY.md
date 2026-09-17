# Security Kryzna Learn

**Tanggal:** 17 September 2026

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

RPC yang memang menjadi jalur aplikasi tetap dapat executable oleh `authenticated` jika memiliki authorization internal. Function yang hanya dipanggil sebagai trigger seharusnya tidak diekspos ke anon/authenticated.

Temuan terakhir yang perlu dikerjakan:
- `snapshot_materi_version()` masih executable dan perlu revoke EXECUTE untuk role publik.
- `set_materi_updated_at()` perlu `search_path` eksplisit.
- Leaked Password Protection Supabase masih disabled dan perlu evaluasi.

## Security review checklist

- [ ] RLS aktif pada tabel sensitif.
- [ ] Public SELECT hanya pada data yang memang publik.
- [ ] Storage write hanya role yang berwenang.
- [ ] SECURITY DEFINER memakai search_path aman.
- [ ] Trigger-only function tidak executable publik.
- [ ] Edge Function secret tidak bocor ke client.
- [ ] Auth password protection ditinjau.
- [ ] Security Advisor dijalankan setelah hardening.
