# 📌 Status Proyek — Kryzna Learn

**Tanggal checkpoint:** 18 September 2026  
**Branch aktif saat checkpoint:** `18-Sep-2026`  
**Status sesi:** Security hardening database terverifikasi dan integrasi autosave/draft recovery sudah diperbaiki. Trigger-only function dan internal helper yang tidak perlu sebagai RPC sudah dibatasi; direct write `user_roles` kini juga dibatasi ke Super Admin. Tersisa 7 application `SECURITY DEFINER` RPC yang memang dipakai jalur aplikasi/RLS dan masih ditandai Security Advisor karena executable oleh `authenticated`. Leaked Password Protection tetap disabled karena keterbatasan plan Free; Browser E2E masih `Needs Verification` karena repository belum memiliki browser test runner/runtime.

## 🔁 Aturan branch aktif

Branch pengembangan Kryzna Learn **dinamis** dan tidak permanen. Nama branch dapat berubah berdasarkan tanggal atau checkpoint update proyek.

- Branch aktif harus diverifikasi dari GitHub sebelum pekerjaan dimulai.
- `PROJECT-STATUS.md` pada branch yang telah diverifikasi menjadi acuan checkpoint dan branch aktif.
- Jangan mengasumsikan branch dari sesi sebelumnya masih aktif.
- Jika pengguna menentukan branch secara eksplisit, branch tersebut menjadi acuan.
- Pola seperti `17-Sep-2026`, `18-Sep-2026`, dan seterusnya hanya merupakan konvensi; nama branch aktual wajib diverifikasi.

## 📚 Dokumentasi teknis

Dokumentasi sekarang mencakup:

- `ARCHITECTURE.md` — arsitektur, modul, layer, data flow, dan security boundary.
- `RBAC.md` — role, permission, mapping, dan enforcement.
- `SECURITY.md` — model keamanan dan checklist hardening.
- `DATABASE.md` — tabel, RPC, trigger, versioning, RLS, dan migration discipline.
- `CONTENT-WORKFLOW.md` — lifecycle Draft → Review → Published → Archived.
- `EDGE-FUNCTIONS.md` — inventory Edge Function dan parity source/deployment.
- `DEPLOYMENT.md` — checklist deployment dan rollback.
- `TESTING.md` — checklist authentication, RBAC, content, versioning, autosave, storage, dan security.
- `CHANGELOG.md` — histori perubahan dan checkpoint sesi.
- `DECISIONS.md` — keputusan arsitektur dan alasannya.
- `LEGACY.md` — inventory legacy dan aturan cleanup.
- `SWIFT-API-AUDIT.md` — audit khusus `swift-api`.
- `DEVELOPMENT.md` — aturan branch dinamis, siklus pengembangan, dan dokumentasi setelah commit.
- `README.md` — documentation index.

`PROJECT-STATUS.md` tetap menjadi sumber checkpoint/progres, sedangkan dokumen teknis menjadi sumber detail implementasi.

## ✅ Progres terbaru — 18 September 2026

### 1. Struktur UI dan dokumentasi
Struktur aplikasi menggunakan tiga area utama:

```text
Kryzna Learn
├── 🌐 Website Publik
│   ├── Beranda
│   └── Materi
├── 📚 Kelola Materi
│   ├── Daftar Materi
│   ├── Tulis / Edit Materi
│   ├── Riwayat Versi
│   └── Riwayat Aktivitas Materi
└── 🛡️ Administrasi
    ├── Dashboard
    ├── Kelola Pengguna
    ├── Riwayat Aktivitas Sistem
    ├── Import Materi
    └── Pengaturan
```

### 2. Central authentication & permission helper
`shared/auth.js` menjadi helper autentikasi, role, dan permission terpusat. Permission diambil dari `public.get_my_permissions()`.

### 3. Role → Permission
Database memiliki `roles`, `permissions`, `user_roles`, dan `role_permissions`. Mapping tersedia untuk `super_admin`, `admin`, `editor`, dan `penulis`; `viewer` dipertahankan sebagai legacy dengan `content.read`.

### 4. Workflow dan version history
Workflow materi, `materi_versions`, snapshot trigger, restore RPC, activity logging, autosave, dan draft recovery sudah tersedia. `shared/draft-recovery.js` sekarang dimuat oleh `content/editor.html` dan diinisialisasi setelah session/materi siap agar key draft tidak salah untuk materi existing. Browser E2E restore/autosave masih pending.

### 5. Storage dan RLS
RLS tabel inti aktif. Storage `materi-files` sudah diselaraskan dengan RBAC dan public read dibatasi pada file materi `published`.

### 6. RBAC terbaru
`system_activity_logs` sekarang dapat dibaca Admin dan Super Admin sesuai `system.view_logs`. `admin_users` sekarang dapat dibaca dan diperbarui Admin/Super Admin sesuai pembagian user management; perubahan role dan penambahan user tetap Super Admin-only melalui jalur RPC. Direct INSERT/UPDATE/DELETE ke `user_roles` juga sekarang hanya dapat dilakukan oleh `super_admin`; Admin tetap dapat membaca assignment role.

### 7. Edge Functions
`create-staff` aktif version 3 dan source repo parity dengan deployment. Role `editor` sudah didukung. `swift-api` aktif version 1 tetapi tidak memiliki source counterpart di branch; tidak diubah dan tidak dihapus.

### 8. Security hardening database — 18 September
- `snapshot_materi_version()` tetap `SECURITY DEFINER` untuk kebutuhan trigger, dengan `search_path = public`, dan `EXECUTE` dicabut dari `PUBLIC`, `anon`, serta `authenticated`.
- `set_materi_updated_at()` sekarang memiliki `search_path = public` eksplisit.
- `trg_snapshot_materi_version` terverifikasi tetap `AFTER INSERT OR UPDATE` pada `public.materi`.
- Pengujian transaksional insert/update menghasilkan `2` snapshot `materi_versions` dan di-rollback tanpa meninggalkan data uji.
- `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, dan `get_my_role(uuid)` tidak lagi executable oleh `PUBLIC`, `anon`, atau `authenticated`.
- Policy `user_roles` untuk direct role management diperketat dari Admin/Super Admin menjadi Super Admin-only.

## 🔐 Security Advisor checkpoint — 18 September 2026

Temuan yang sudah terselesaikan:
- `function_search_path_mutable` untuk `set_materi_updated_at()`.
- `anon_security_definer_function_executable` untuk `snapshot_materi_version()`.
- `authenticated_security_definer_function_executable` untuk `snapshot_materi_version()`.

Temuan yang masih pending:
- 7 application `SECURITY DEFINER` RPC masih executable oleh `authenticated`: `add_staff_by_email`, `can_manage_users`, `current_admin_role`, `get_my_permissions`, `list_staff`, `restore_materi_version`, dan `update_staff`. Ketujuhnya sudah direview secara fungsi; masing-masing memiliki kebutuhan jalur aplikasi atau authorization/RLS internal. Warning Security Advisor tetap tercatat karena linter menandai EXECUTE pada SECURITY DEFINER.
- Leaked Password Protection Supabase masih disabled.

## 🛑 Checkpoint 18 September 2026

- Database migrations sebelumnya berhasil diterapkan dan diverifikasi.
- Migration `20260918011836_restrict_user_role_management_to_super_admin_20260918` diterapkan ke Supabase dan diverifikasi.
- Policy hasil akhir `Super admins manage user roles` terverifikasi `FOR ALL TO authenticated` dengan `USING/WITH CHECK current_admin_role() = 'super_admin'`.
- Security Advisor direrun setelah perubahan; warning tetap 7 application SECURITY DEFINER + 1 leaked-password.
- `docs/RBAC.md`, `docs/SECURITY.md`, `docs/DATABASE.md`, `docs/CHANGELOG.md`, dan file migration diperbarui melalui commit terpisah dan diverifikasi.
- Browser E2E belum dapat dinyatakan lulus karena tidak ada browser test runner/runtime di repository connection.

## ⚠️ Pekerjaan selanjutnya

### Prioritas 1 — Security/Auth
1. Leaked Password Protection: tetap `Pending/Accepted Plan Limitation` pada Free plan; tidak ada upgrade/pay yang dilakukan.
2. Security Advisor: sudah direrun; 7 application SECURITY DEFINER warnings dan 1 leaked-password warning tetap tercatat.
3. Lanjut Browser E2E Version Restore dan Autosave/Draft Recovery.

### Prioritas 2 — Browser E2E
4. Uji Version Restore dari UI sampai database.
5. Uji Autosave & Draft Recovery.

### Prioritas 3 — Final audit
6. Audit final query halaman publik dan sanitasi.
7. Audit final seluruh `SECURITY DEFINER`, RLS, Storage policy, privilege, dan index.
8. Audit final formatting seluruh repo.
9. Review consumer eksternal `swift-api` sebelum keputusan retirement.

## 🧭 Titik lanjut sesi berikutnya

Mulai dengan **Browser E2E Version Restore dan Autosave/Draft Recovery**. Sebelum mengklaim lulus, diperlukan browser runtime/test runner nyata. Jika runtime belum tersedia, pertahankan status `Needs Verification` dan lanjutkan audit final yang bisa diverifikasi statis/database.

## 🔁 Siklus wajib setiap sesi

```text
verifikasi branch aktif
 ↓
baca PROJECT-STATUS
 ↓
ubah
 ↓
commit
 ↓
verifikasi
 ↓
update dokumentasi & PROJECT-STATUS
 ↓
verifikasi dokumentasi
 ↓
lanjut
```
