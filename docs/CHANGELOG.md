# Changelog Kryzna Learn

## 18 September 2026

- Integrated `shared/draft-recovery.js` into the material editor and deferred its initialization until the authenticated session/material state is ready, preventing existing-material drafts from being keyed as a new material.
- Browser E2E for autosave/draft recovery remains pending because no browser test runner/runtime is present in the repository connection.

- Restricted internal SECURITY DEFINER helpers `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, and `get_my_role(uuid)` by revoking EXECUTE from `PUBLIC`, `anon`, and `authenticated`.
- Verified the remaining Security Advisor application warning count is 7; these are application/RLS functions with authenticated execution and internal authorization requirements.

- Hardened trigger-only `snapshot_materi_version()` by revoking `EXECUTE` from `PUBLIC`, `anon`, and `authenticated`.
- Set explicit `search_path = public` on `set_materi_updated_at()`.
- Verified `trg_snapshot_materi_version` remains attached to `materi` for `AFTER INSERT OR UPDATE`.
- Verified trigger behavior with a transactional insert/update test; two version snapshots were produced and the transaction was rolled back.
- Reran Supabase Security Advisor: the `snapshot_materi_version()` and mutable-search-path findings are cleared. Remaining findings are the intended review of application `SECURITY DEFINER` RPCs and disabled Leaked Password Protection.

## 17 September 2026

- Merapikan formatting Content/Admin.
- Memusatkan auth dan permission melalui `shared/auth.js`.
- Menambahkan RBAC terpusat dengan `role_permissions` dan `get_my_permissions()`.
- Menambahkan workflow status materi.
- Menambahkan version history dan restore RPC.
- Menambahkan autosave/draft recovery lokal.
- Menyelaraskan Storage policy dengan RBAC.
- Sinkronisasi `create-staff` repo ↔ deployment; deployment aktif v3.
- Menambahkan dukungan role `editor` pada `create-staff`.
- Audit `swift-api`; deployment v1 masih aktif tetapi source tidak ada di repo.
- Menyelaraskan akses `system_activity_logs` dan sebagian user management Admin dengan permission matrix.
- Mencatat Security Advisor findings untuk hardening lanjutan.
- Menetapkan aturan wajib post-commit: setiap commit harus diikuti verifikasi, pembaruan dokumentasi teknis yang relevan, pembaruan `PROJECT-STATUS.md`, dan verifikasi dokumentasi.
- Menambahkan `docs/DEVELOPMENT.md` sebagai acuan workflow pengembangan.
- Menetapkan aturan branch dinamis: branch pengembangan tidak permanen, harus diverifikasi sebelum pekerjaan, dan tidak boleh dikunci berdasarkan nama/tanggal branch sebelumnya.

## Checkpoint akhir sesi — 17 September 2026

- Tidak ada perubahan behavior aplikasi pada checkpoint ini.
- Dokumentasi workflow pengembangan sudah masuk repository.
- Aturan branch dinamis sudah didokumentasikan.
- `PROJECT-STATUS.md` diperbarui untuk mencatat checkpoint dan pekerjaan berikutnya.

## Aturan pencatatan

Setiap perubahan signifikan pada schema, RBAC, security, Edge Function, atau behavior utama harus ditambahkan ke changelog dan `PROJECT-STATUS.md`.

Setiap commit juga wajib melalui siklus dokumentasi: **ubah → commit → verifikasi → update dokumentasi & progres → verifikasi dokumentasi → lanjut**.
