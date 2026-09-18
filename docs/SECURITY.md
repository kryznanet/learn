# Security Kryzna Learn

**Tanggal:** 18 September 2026

## Prinsip

- Browser hanya memakai Supabase publishable key.
- Service role/secret key tidak boleh dikirim ke browser.
- RLS adalah enforcement utama untuk data.
- SECURITY DEFINER harus memiliki `search_path` eksplisit dan authorization yang jelas.
- Privileged Auth API menggunakan Edge Function.

## SECURITY DEFINER checkpoint

RPC yang memang menjadi jalur aplikasi tetap dapat executable oleh `authenticated` jika memiliki authorization internal. Function internal/legacy yang tidak diperlukan sebagai RPC langsung harus dicabut dari role API.

### Hardening 18 September 2026

- `snapshot_materi_version()` tetap `SECURITY DEFINER` dengan `search_path = public`, tetapi `EXECUTE` dicabut dari `PUBLIC`, `anon`, dan `authenticated`.
- `set_materi_updated_at()` memiliki `search_path = public` eksplisit.
- Trigger `trg_snapshot_materi_version` tetap aktif untuk `AFTER INSERT OR UPDATE`.
- Pengujian transaksional insert/update menghasilkan dua snapshot versi dan di-rollback.
- `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, dan `get_my_role(uuid)` dicabut dari `PUBLIC`, `anon`, dan `authenticated` karena tidak diperlukan sebagai RPC langsung.

## Remaining Security Advisor findings

Security Advisor sekarang menyisakan **7** application `SECURITY DEFINER` RPC:

- `add_staff_by_email(...)`
- `can_manage_users(uuid)`
- `current_admin_role()`
- `get_my_permissions()`
- `list_staff()`
- `restore_materi_version(uuid)`
- `update_staff(...)`

Ketujuh function hanya executable oleh `authenticated`; `anon` tidak memiliki `EXECUTE`. Function aplikasi memiliki authorization internal. Security Advisor menandai keberadaan `EXECUTE` pada SECURITY DEFINER sebagai warning, sehingga warning tersebut perlu dibaca bersama authorization internal dan kebutuhan jalur aplikasi.

Leaked Password Protection Supabase masih disabled dan menjadi pekerjaan security/auth berikutnya.

## Security review checklist

- [x] RLS aktif pada tabel sensitif.
- [x] Public SELECT hanya pada data yang memang publik.
- [x] Storage write hanya role yang berwenang.
- [x] SECURITY DEFINER yang di-hardening memakai search_path aman.
- [x] Trigger-only function tidak executable publik.
- [x] Internal SECURITY DEFINER helpers yang tidak diperlukan client tidak executable publik.
- [x] Edge Function secret tidak bocor ke client.
- [ ] Auth password protection ditinjau/diaktifkan.
- [x] Security Advisor dijalankan setelah hardening.
