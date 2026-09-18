# 📌 Status Proyek — Kryzna Learn

**Tanggal checkpoint:** 18 September 2026  
**Branch aktif saat checkpoint:** `18-Sep-2026`  
**Status sesi:** Security hardening database terverifikasi, bug RLS saat mengirim edit materi ke Review sudah diperbaiki, dan integrasi autosave/draft recovery sudah diperbaiki. Harness Playwright + Chromium untuk Browser E2E sudah ditambahkan dan workflow CI terverifikasi sukses, termasuk authenticated Super Admin editor test dan Draft Recovery dengan dedicated E2E secrets. Trigger-only function dan internal helper yang tidak perlu sebagai RPC sudah dibatasi; direct write `user_roles` kini juga dibatasi ke Super Admin. Tersisa 7 application `SECURITY DEFINER` RPC yang memang dipakai jalur aplikasi/RLS dan masih ditandai Security Advisor karena executable oleh `authenticated`. Leaked Password Protection tetap disabled karena keterbatasan plan Free.

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
Workflow materi, `materi_versions`, snapshot trigger, restore RPC, activity logging, autosave, dan draft recovery sudah tersedia. `shared/draft-recovery.js` sekarang dimuat oleh `content/editor.html` dan diinisialisasi setelah session/materi siap agar key draft tidak salah untuk materi existing. Browser E2E Restore execution tetap pending karena membutuhkan environment terisolasi; Draft Recovery CI sudah terverifikasi lulus pada run #43 setelah perbaikan readiness dan polling persistence.

### 5. Storage dan RLS
RLS tabel inti aktif. Storage `materi-files` sudah diselaraskan dengan RBAC dan public read dibatasi pada file materi `published`.

### 6. RBAC terbaru
`system_activity_logs` sekarang dapat dibaca Admin dan Super Admin sesuai `system.view_logs`. `admin_users` sekarang dapat dibaca Admin/Super Admin sesuai pembagian user management; direct UPDATE telah dicabut. Perubahan profil/status/role staf harus melalui `update_staff()`, sedangkan perubahan role dan penambahan user tetap Super Admin-only melalui jalur RPC. Direct INSERT/UPDATE/DELETE ke `user_roles` juga sekarang hanya dapat dilakukan oleh `super_admin`; Admin tetap dapat membaca assignment role.

### 7. Edge Functions
`create-staff` aktif version 3 dan source repo parity dengan deployment. Role `editor` sudah didukung. `swift-api` aktif version 1, JWT verification aktif, tetapi tidak memiliki source counterpart di branch. Deployment source version 1 berhasil diaudit; tidak terlihat akses database/Storage Kryzna Learn. Consumer eksternal belum dapat dibuktikan tidak ada, sehingga function tidak diubah/dihapus.

### 8. Public query & sanitization audit — 18 September 2026
- Public index queries only `materi` rows with `status = 'published'` and escapes dynamic text before rendering.
- Public material detail also requires `status = 'published'` and sanitizes rendered Markdown/HTML before `innerHTML`.
- Sanitizer hardening removes inline `style`/event attributes, rejects unsafe URL schemes, and uses `noopener noreferrer` for new-tab links.

### 9. Browser E2E harness — 18 September 2026
- Added Playwright 1.55.0 with Chromium project configuration.
- Added public smoke tests for homepage and admin login.
- Added authenticated editor reachability test, gated by KRYZNA_E2E_EMAIL and KRYZNA_E2E_PASSWORD.
- Added GitHub Actions workflow `.github/workflows/browser-e2e.yml` to install Chromium and upload reports.
- Dedicated E2E repository secrets `KRYZNA_E2E_EMAIL` and `KRYZNA_E2E_PASSWORD` are configured.
- GitHub Actions Browser E2E run #6 (`35296715443`) completed successfully with all 3 tests passed, including authenticated Super Admin editor reachability.
- Authenticated version-history UI coverage is verified; destructive Restore execution remains pending because the connected Supabase project has no isolated staging/branch environment.
- `restore_materi_version` has been verified transactionally at the database/RPC layer with the dedicated Super Admin identity; the temporary material, snapshots, and restore mutation were rolled back completely.
- Authenticated Autosave/Draft Recovery: autosave-to-localStorage and recovery/reload tests are present, including existing-material recovery. CI run #35 (`35298200046`) completed with 4 passed and 2 failed due to editor boot timing; readiness synchronization was added in the editor and E2E tests. Draft Recovery CI run #43 (`35298946197`) succeeded on commit `2ec49859a5fffd793a721d257eaac0b122fd31b8`; new/existing material reload and recovery flows are verified. Cleanup remains pending.

### 10. Security hardening database — 18 September
- `snapshot_materi_version()` tetap `SECURITY DEFINER` untuk kebutuhan trigger, dengan `search_path = public`, dan `EXECUTE` dicabut dari `PUBLIC`, `anon`, serta `authenticated`.
- `set_materi_updated_at()` sekarang memiliki `search_path = public` eksplisit.
- `trg_snapshot_materi_version` terverifikasi tetap `AFTER INSERT OR UPDATE` pada `public.materi`.
- Pengujian transaksional insert/update menghasilkan `2` snapshot `materi_versions` dan di-rollback tanpa meninggalkan data uji.
- `can_manage_materi(uuid)`, `can_delete_materi(uuid)`, dan `get_my_role(uuid)` tidak lagi executable oleh `PUBLIC`, `anon`, atau `authenticated`.
- Policy `user_roles` untuk direct role management diperketat dari Admin/Super Admin menjadi Super Admin-only.
- Direct UPDATE policy pada `admin_users` dicabut; perubahan staf sekarang harus melalui `update_staff()` yang memiliki authorization internal.
- Policy SELECT `materi` ditambahkan untuk authenticated content roles agar editor dapat membaca draft/review/archived dan menggunakan `UPDATE ... SELECT` tanpa ditolak RLS.

## 🔐 Security Advisor checkpoint — 18 September 2026

Temuan yang sudah terselesaikan:
- `function_search_path_mutable` untuk `set_materi_updated_at()`.
- `anon_security_definer_function_executable` untuk `snapshot_materi_version()`.
- `authenticated_security_definer_function_executable` untuk `snapshot_materi_version()`.

Temuan yang masih pending:
- 7 application `SECURITY DEFINER` RPC masih executable oleh `authenticated`: `add_staff_by_email`, `can_manage_users`, `current_admin_role`, `get_my_permissions`, `list_staff`, `restore_materi_version`, dan `update_staff`. Ketujuhnya sudah direview secara fungsi; masing-masing memiliki kebutuhan jalur aplikasi atau authorization/RLS internal. Warning Security Advisor tetap tercatat karena linter menandai EXECUTE pada SECURITY DEFINER.
- Leaked Password Protection Supabase masih disabled.

## 🛑 Checkpoint 18 September 2026

### Final database security audit — 18 September 2026
- Final jalur `materi` audit menemukan dan memperbaiki bypass workflow: `penulis` sebelumnya dapat menulis status non-draft melalui direct API karena `content.update` RLS belum membatasi nilai `status`. RLS kini membatasi `penulis` ke authored draft dan memastikan semua insert memiliki `author_id = auth.uid()`; `editor` dapat mengelola authored workflow, Admin/Super Admin tetap lintas author.
- Applied migrations `20260918025136_enforce_materi_status_permissions_20260918` dan `20260918025144_tighten_materi_insert_author_20260918`; live policy verification berhasil.
- Audited all 12 public `SECURITY DEFINER` functions; all have explicit `search_path`. Only the 7 application RPCs remain executable by `authenticated`; internal/trigger-only functions are not executable by API roles.
- Audited RLS on all 10 core public tables: RLS is enabled throughout and public material visibility remains published-only.
- Audited Storage policies for `materi-files` and `avatars`, core triggers, API table grants, and public indexes. No additional concrete security defect requiring code/schema change was identified.
- API grant hardening applied through migrations `20260918020624_restrict_api_table_privileges_20260918`, `20260918020632_tighten_api_table_dml_privileges_20260918`, and `20260918020637_restore_rbac_write_privileges_20260918` and verified directly in Supabase.


- Database migrations sebelumnya berhasil diterapkan dan diverifikasi.
- Migration `20260918012129_allow_authenticated_content_users_to_view_materi_20260918` diterapkan ke Supabase dan policy SELECT `materi` diverifikasi.
- Migration `20260918011836_restrict_user_role_management_to_super_admin_20260918` diterapkan ke Supabase dan diverifikasi.
- Policy hasil akhir `Super admins manage user roles` terverifikasi `FOR ALL TO authenticated` dengan `USING/WITH CHECK current_admin_role() = 'super_admin'`.
- Security Advisor direrun setelah perubahan; warning tetap 7 application SECURITY DEFINER + 1 leaked-password.
- `docs/RBAC.md`, `docs/SECURITY.md`, `docs/DATABASE.md`, `docs/CHANGELOG.md`, dan file migration diperbarui melalui commit terpisah dan diverifikasi.
- `docs/SWIFT-API-AUDIT.md` sekarang dibuat berdasarkan audit deployment version 1 dan diverifikasi.\n- Browser E2E harness dan authenticated editor reachability sudah terverifikasi lulus melalui GitHub Actions run #6. Version Restore execution UI-to-database tetap pending; Draft Recovery CI run #43 (`35298946197`) sukses setelah readiness synchronization and persistence polling; Draft Recovery covered flows are verified.

## ⚠️ Pekerjaan selanjutnya

### Prioritas 1 — Security/Auth
1. Leaked Password Protection: tetap `Pending/Accepted Plan Limitation` pada Free plan; tidak ada upgrade/pay yang dilakukan.
2. Security Advisor: sudah direrun; 7 application SECURITY DEFINER warnings dan 1 leaked-password warning tetap tercatat.
3. Lanjut Browser E2E Version Restore execution terisolasi.

### Prioritas 2 — Browser E2E
4. Version Restore E2E dari UI sampai database pada environment terisolasi.
5. Sediakan/konfirmasi environment Supabase staging atau branch untuk Restore execution E2E; jangan gunakan produksi.
6. Draft Recovery/reload CI sudah diverifikasi pada run #43; cleanup ketergantungan fixture existing-material sudah dilakukan dan diverifikasi pada Browser E2E push run #77 (`35302746397`) yang sukses.

### Prioritas 3 — Final audit
8. Audit final query halaman publik dan sanitasi.
9. Audit final seluruh `SECURITY DEFINER`, RLS, Storage policy, privilege, dan index.
10. Audit final formatting seluruh repo — formatting guidance dan legacy config audit sudah ditindaklanjuti pada checkpoint ini.
11. Review consumer eksternal `swift-api` sebelum keputusan retirement; audit deployment/source sudah diulang dan tetap tidak menemukan consumer repo, tetapi consumer eksternal belum dapat dibuktikan.

## 🔎 Source → database contract audit — 18 September 2026

Audit final menemukan satu mismatch authorization pada `update_staff()`: role `admin` masih diterima di dalam function untuk perubahan profil/active state, walaupun permission `users.update` dan `users.disable` sudah dicabut dari mapping Admin. Migration `20260918030000_restrict_update_staff_to_super_admin_20260918` memperbaiki guard menjadi Super Admin-only. Live function definition dan EXECUTE privilege sudah diverifikasi.

Storage, content activity logs, version history, system activity logs, dan RPC application paths telah diaudit terhadap source dan live RLS/grants. Tidak ditemukan mismatch authorization tambahan yang memerlukan perubahan pada checkpoint ini. Temuan konsistensi Storage import tetap dicatat sebagai reliability concern: upload file terjadi sebelum INSERT `materi`, sehingga kegagalan INSERT dapat meninggalkan orphan file; belum diubah karena memerlukan desain cleanup yang aman.

## 🧭 Titik lanjut sesi berikutnya

RBAC staff mutation telah diselaraskan: Admin hanya `users.read`, sedangkan perubahan profil/status/role staf tetap khusus Super Admin melalui `update_staff()`. Live verification sudah dilakukan.

Audit konsistensi dokumentasi memperbaiki metadata branch stale pada `docs/ARCHITECTURE.md` dan menandai lima root SQL bootstrap/data lama sebagai non-authoritative agar tidak dijalankan ulang terhadap production. Final `materi` workflow audit juga memperketat RLS agar permission status tidak dapat dibypass lewat direct API. Final source audit juga menemukan `admin/import.html` belum mengirim `author_id`, sehingga kini diselaraskan dengan RLS insert.

Restore UI-to-database tetap **Blocked** karena environment terisolasi berbayar tidak disetujui. Review consumer `swift-api` pada repository/GitHub/public sources selesai tanpa menemukan consumer yang relevan; consumer eksternal di luar sumber tersebut tetap **Needs Verification**. Final formatting/repository audit non-mutating selesai tanpa defect baru. Jalur `materi` workflow permission/RLS sudah diaudit dan hardening diterapkan; jalur import juga sudah diselaraskan dengan author ownership RLS. Draft Recovery covered flows sudah terverifikasi; jangan gunakan produksi untuk Restore UI-to-database.

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


## Draft Recovery E2E fixture cleanup — 18 September 2026

- Existing-material Draft Recovery dan Version History Browser E2E tidak lagi bergantung pada judul fixture `Test 12`.
- Test memilih materi pertama yang tersedia dan mengambil judul aktual dari UI sebelum assertion.
- Commit test terverifikasi: `54d291161fd6318923876e165ef7c0f960f2939a`.
- Ini menyelesaikan cleanup ketergantungan fixture; tidak mengubah data production dan tidak menjalankan Restore mutation.

## Final SECURITY DEFINER / index audit — 18 September 2026

Final read-only audit completed for application SECURITY DEFINER functions and core public indexes/constraints. All remaining SECURITY DEFINER functions have explicit search_path; client-exposed application RPCs are limited to authenticated, while internal/trigger helpers have EXECUTE revoked from API roles. The remaining seven Security Advisor application warnings are therefore documented as intentional application RPC warnings, subject to periodic authorization review. Core primary keys, foreign keys, workflow checks, role uniqueness, material slug uniqueness, version uniqueness, and version-history indexes were verified live. No additional database hardening change was required at this checkpoint.

Repository hygiene spot-check found no remaining TODO, FIXME, or obvious debug console.log/alert() matches in the searched repository paths. No formatting change was made because no concrete repository-wide formatting defect was identified by this non-mutating audit.


## Checkpoint penutupan security/hardening — 18 September 2026

- Final repository/formatting audit: **Verified**, non-mutating; tidak ditemukan TODO/FIXME atau debug pattern yang memerlukan perubahan.
- `swift-api` consumer review: **Needs Verification**; tidak ditemukan consumer relevan pada repository, connected GitHub search, atau public web sources. Function tetap ACTIVE.
- Security/hardening area yang dapat diverifikasi telah ditutup. Residual items tetap tercatat: 7 intentional application SECURITY DEFINER warnings, leaked-password plan limitation, dan Restore UI-to-database E2E blocked tanpa isolated staging.
- Commit audit dokumentasi `swift-api`: `32fc52f0b8296d60de5b903c20a7f26563325b0b`.
- Checkpoint berikutnya: hanya pekerjaan residual di atas atau perubahan baru yang diminta; jangan mengulang audit yang sudah terverifikasi.

## Local Supabase readiness audit — 18 September 2026

- Branch `18-Sep-2026` reverified before this checkpoint.
- Supabase production was queried read-only only; no migration, data mutation, branch creation, or paid resource was performed.
- Live PostgreSQL version is **17.6**.
- Live migration history contains required schema/RBAC/storage migrations from 16–17 September plus the 18 September hardening migrations.
- Repository `supabase/migrations/` currently contains only the 18 September hardening subset and therefore cannot yet recreate the live database from zero.
- `supabase/config.toml` is absent. This is intentional for now: adding it before a complete baseline would create a local stack that cannot reproduce the live schema safely.
- Legacy root SQL bootstrap files remain explicitly non-authoritative and are not suitable as the current baseline.
- Restore UI-to-database E2E remains **Blocked** until the complete local baseline is prepared and local reset can be verified.
- No production mutation was performed and no paid Supabase resource was created.

### Next checkpoint
Prepare a reviewed, complete local schema baseline from the existing live schema/migration history, add `supabase/config.toml`, then verify local migrations before enabling Restore E2E. Do not connect Restore execution to production.


## Live schema baseline audit — 18 September 2026

- Branch 18-Sep-2026 and repository were reverified before the audit.
- Connected Supabase was inspected read-only; no production migration/data mutation, branch creation, or paid resource was performed.
- Live PostgreSQL is 17.6.1.
- Catalog verification found 10 application tables with RLS, current constraints/indexes, 14 public application functions, material/version/activity triggers, two Storage buckets, and 4 roles + 17 permissions + 41 role-permission mappings.
- Function definitions for the current application/RLS paths were captured read-only, including the 7 intentional application SECURITY DEFINER RPCs and trigger/helper functions.
- The result is sufficient to design the local baseline, but not sufficient to safely hand-author a complete migration because the branch is missing the 16–17 September migration history and Supabase-managed Auth/Storage dependencies.
- Supabase CLI/Docker is not available in this execution environment, so supabase db pull and local db reset were not claimed or simulated.
- Status: **Blocked — authoritative local baseline generation/validation requires Supabase CLI + Docker runtime.**

### Checkpoint berikutnya
Generate the authoritative baseline using the supported Supabase CLI/database-pull workflow in a machine with Docker + Supabase CLI, review it against the captured live schema, then add supabase/config.toml with PostgreSQL major version 17 and verify supabase db reset locally. Only after that enable Restore UI-to-database E2E against local Supabase.


## Pengayaan materi — 18 September 2026

- Ditambahkan 8 materi pembelajaran jaringan yang sebelumnya belum tersedia: Model OSI, TCP/UDP, NAT/Port Forwarding, ARP, Ethernet/Switching, Wi-Fi, HTTP/HTTPS, dan Troubleshooting Berlapis.
- Verifikasi live `public.materi` mengonfirmasi seluruh 8 slug baru berstatus `published` dan memiliki konten non-kosong.
- Tidak ada materi lama yang ditimpa; penambahan hanya dilakukan untuk slug yang belum ada.
- Katalog materi dicatat di `docs/MATERIAL-CATALOG.md`.
- Status local Supabase baseline tetap **Blocked**; pengayaan data ini tidak menggantikan kebutuhan baseline migration yang reproducible.


## Materi lanjutan — 18 September 2026

Delapan materi lanjutan jaringan telah ditambahkan: IPv6, VLAN dan inter-VLAN routing, routing table, DHCP relay, DNS troubleshooting, firewall/ACL, VPN/tunneling, serta monitoring/log. Seluruh materi berstatus `published` dan diverifikasi pada `public.materi` dengan konten non-kosong.


## Materi intermediate networking — 18 September 2026

Delapan materi intermediate telah ditambahkan dan diverifikasi: subnetting/VLSM, STP/RSTP, Link Aggregation/LACP, QoS, Wireshark/packet capture, OSPF, network security hardening, serta network automation API/script. Seluruh materi berstatus `published` dan memiliki konten non-kosong.
