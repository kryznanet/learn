# Security Kryzna Learn

**Tanggal:** 18 September 2026

### Public material content sanitization — 18 September 2026
- `materi/view.html` sanitizes rendered Markdown/HTML before assigning to `innerHTML`.
- Inline `style` and event-handler attributes are removed.
- `href`/`src` are restricted to HTTP(S), root/relative, fragment, or `mailto:` schemes; `data:`, `javascript:`, `vbscript:`, and `file:` are rejected.
- External links opened in a new tab use `noopener noreferrer`.

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
- Direct write ke `user_roles` dibatasi RLS kepada `super_admin`; Admin hanya memiliki akses baca assignment role.
- Direct UPDATE ke `admin_users` melalui PostgREST dicabut. Perubahan profil, role, dan active state harus melewati `update_staff()` agar authorization dan sinkronisasi `admin_users`/`user_roles` tidak dapat dilewati.

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
- [x] Direct user-role writes dibatasi ke Super Admin.
- [x] Edge Function secret tidak bocor ke client.
- [ ] Auth password protection ditinjau/diaktifkan.
- [x] Security Advisor dijalankan setelah hardening.


### Direct staff-update hardening — 18 September 2026

Migration `restrict_direct_admin_users_updates_20260918` mencabut policy UPDATE langsung pada `admin_users`. Verifikasi `pg_policies` menunjukkan tabel hanya memiliki policy SELECT untuk authenticated; jalur perubahan staf tetap melalui `update_staff(...)`.
