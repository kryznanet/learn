## Pendalaman pedagogis 35 materi — 19 September 2026

- Audit read-only terhadap seluruh **58 materi published** menemukan struktur lengkap pada 58/58 materi: tujuan pembelajaran, konsep, cara kerja, contoh, verifikasi teknis, troubleshooting, kesalahan umum, latihan, checklist, dan ringkasan.
- Ditemukan pola konten generik pada **35 materi**: 20 Intermediate, 11 Advanced, dan 4 Tutorial. Pola tersebut terutama berada pada hipotesis troubleshooting, kesalahan umum, checklist, dan ringkasan.
- Memperbarui 35 materi tersebut agar bagian yang sebelumnya generik menjadi spesifik terhadap topik masing-masing, tanpa mengubah kategori, status publikasi, schema, RLS, RBAC, atau workflow.
- Verifikasi database setelah perubahan: tetap **58 published**; seluruh marker generik yang diaudit tersisa **0**.
- Perubahan konten dilakukan langsung pada data materi; timestamp pembaruan ikut berubah sesuai perilaku tabel.
- Status pedagogical content audit: **Needs Verification** untuk review visual/browser dan pembacaan manual final; audit struktur dan penghapusan pola generik sudah terverifikasi melalui query.

### Checkpoint berikutnya

Lakukan Browser E2E fresh untuk memastikan rendering 58 materi tetap sehat, lalu review visual/manual beberapa materi per kategori untuk memastikan HTML, heading, list, code block, dan panjang konten tampil baik. Restore UI-to-database tetap **Blocked** sampai environment Supabase terisolasi tersedia.

## Browser E2E default-branch alignment — 19 September 2026

- Repository metadata was verified directly in GitHub: current default branch is `19-Sep-2026`.
- Updated `.github/workflows/browser-e2e.yml` to remove hard-coded `18-Sep-2026` / `19-Sep-2026` branch filters.
- Browser E2E now runs only when the push/manual event is on `github.event.repository.default_branch`), or when a pull request targets that default branch.
- The workflow uses the repository metadata value dynamically, so future changes to the default branch do not require another workflow edit.
- Events from non-default branches may still create a workflow run entry, but the Playwright job is skipped and no E2E test is executed there.
- Manual dispatch on a non-default branch is also skipped by the same job condition.
- Workflow commit: `3b7cdbec26f04a77a1e57f77e08c2b1c521ccf6b`; workflow diff and final file were verified.

### Status

- Browser E2E default-branch execution: **Implemented — Needs Runtime Verification**.
- Automatic runtime result recording: **Verified** on Browser E2E #155.
- Browser E2E delete: **Pending**; destructive production testing remains prohibited.
- Restore UI-to-database: **Blocked** until an isolated Supabase environment is available.

### Checkpoint berikutnya

Run Browser E2E from the current default branch after this workflow change and verify that the Playwright job executes there. Also verify that a push to a non-default development branch does not execute the Playwright job. Keep runtime result documentation on the default branch.

## Public material Browser E2E coverage — 19 September 2026

- Branch `19-Sep-2026` was reverified in GitHub before the change.
- Strengthened `tests/e2e/public.spec.js` to assert the exact published counts: Dasar 22, Intermediate 20, Advanced 12, Tutorial 4; every visible card must carry the expected public label; learning-path activation must match the category; and the first material detail page must render its title and content.
- Test commit: `a75f2de2e5dffc72e044770e2241ce25681acf57`; commit diff and final test file were fetched and verified.
- Updated `docs/TESTING.md` in commit `600b4a80cdbf5e65892f3380d967d4b42ca93324`.
- Updated `docs/CHANGELOG.md` in commit `8151a90bc688af34dd10dc66362611a0c9c81e95`.
- No Supabase data/schema/RLS mutation was performed.
- Runtime Browser E2E remains **Needs Verification** until a fresh GitHub Actions workflow run provides runtime evidence on the current branch.

### Checkpoint berikutnya

Obtain fresh Browser E2E runtime evidence for `19-Sep-2026`. If it passes, close this public material regression item; if it fails, diagnose from the Playwright report. Keep Restore UI-to-database **Blocked** until an isolated Supabase environment exists.

## Browser E2E CI branch alignment — 19 September 2026

- Branch `19-Sep-2026` was reverified in GitHub before the change.
- Found that `.github/workflows/browser-e2e.yml` only triggered automatically for `18-Sep-2026`, so pushes on the current development branch would not receive automatic Browser E2E coverage.
- Updated the workflow to trigger on pushes and pull requests for both `18-Sep-2026` and `19-Sep-2026`; manual `workflow_dispatch` remains enabled.
- Code/CI commit: `47fda485020fbe2e517c563bb83e54eb74560770`; commit diff and workflow contents were fetched and verified.
- Documentation commits: `6399cc2fb8d4225d1dac987d2058c1fc356a7955` (TESTING) and `3244ec13d1b74650e42f17ad134ac9f47c37e6f1` (CHANGELOG).
- Live Supabase catalog was independently re-queried read-only: **58 published** = Dasar 22, Intermediate 20, Advanced 12, Tutorial 4. The previously suspicious `JARINGAN-DASAR-X-2` title is confirmed as an actual published database row, not an inferred replacement.
- No Supabase data/schema/RLS mutation was performed.

### Checkpoint berikutnya

The next useful runtime evidence should come from the Browser E2E workflow triggered by the current `19-Sep-2026` branch. Keep Version Restore UI-to-database blocked until an isolated Supabase environment exists. Continue pedagogical/browser verification only from actual CI evidence; do not claim a new browser pass without a workflow run.

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

## Label kategori UI — 18 September 2026

- Label kartu publik: **Materi · Dasar**, **Materi · Menengah**, **Materi · Lanjutan**.
- Kategori **Tutorial** tetap ditampilkan sebagai **Tutorial**.
- Perubahan hanya pada label presentasi; kategori sumber tetap tidak berubah.

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


## Materi advanced networking — 18 September 2026

Delapan materi advanced telah ditambahkan dan diverifikasi berstatus `published` dengan konten non-kosong: BGP, MPLS, high availability, IDS/IPS, Zero Trust, SD-WAN, cloud networking, dan incident response.


## Perapian kategori & kartu materi — 18 September 2026

Kategori materi published dinormalisasi menjadi empat kategori publik: `Dasar`, `Intermediate`, `Advanced`, dan `Tutorial`. Label sumber data “Supabase” pada kartu materi di halaman publik dihapus; kartu sekarang menampilkan kategori, judul, deskripsi, dan tautan **Baca materi →**.


## Pengayaan jalur belajar tambahan — 18 September 2026

- Ditambahkan 12 materi pelengkap untuk menutup celah konsep dari dasar hingga lanjutan: IP/subnet mask, default gateway, private/public IP, CIDR, static routing, DNS record, port/socket, proxy/reverse proxy, OSPF multi-area, gateway redundancy, PKI/TLS, dan SIEM/centralized logging.
- Verifikasi live `public.materi` setelah penambahan: **Dasar 24**, **Intermediate 20**, **Advanced 12**, **Tutorial 4**; total **60 materi published**.
- Konten baru berstatus `published`, menggunakan author materi yang sudah ada, dan tidak mengubah kategori/data materi lama.
- Katalog diperbarui pada `docs/MATERIAL-CATALOG.md`.
- Jalur belajar kini lebih lengkap untuk urutan konsep: addressing → subnetting → switching/routing → layanan jaringan → security → operasi jaringan.


## Jalur belajar publik — 18 September 2026

- Beranda publik sekarang menampilkan jalur belajar empat tahap: **Materi · Dasar → Materi · Menengah → Materi · Lanjutan → Tutorial**.
- Tahap Dasar, Menengah, dan Lanjutan dapat dipilih langsung untuk memfilter katalog materi berdasarkan kategori.
- Deskripsi tiap tahap menjelaskan fokus pembelajaran agar pengguna tidak hanya melihat daftar materi, tetapi memahami urutan belajar yang disarankan.
- Perubahan hanya pada UI; tidak mengubah schema, RLS, atau data materi.


## Pendalaman seluruh materi published — 18 September 2026

- Seluruh **60 materi published** diperbarui pada kolom konten agar tidak lagi berupa ringkasan satu-dua paragraf.
- Setiap materi sekarang memiliki struktur pembelajaran: tujuan, konteks, konsep inti, cara kerja, contoh kasus, parameter/bukti yang diperiksa, troubleshooting, kesalahan umum, latihan, checklist penguasaan, dan ringkasan.
- Verifikasi live `public.materi`: **Dasar 24**, **Intermediate 20**, **Advanced 12**, **Tutorial 4**; seluruh konten memiliki panjang sekitar 4.5–4.8 ribu karakter setelah pendalaman.
- Tidak ada perubahan schema, RLS, status publikasi, atau jumlah materi.
- Catatan: dua entri berjudul **Test** dan **Test 12** masih memiliki nama placeholder; kontennya sekarang menjelaskan materi pengantar sementara. Keduanya sebaiknya divalidasi/diarsipkan pada cleanup katalog berikutnya.


## Review kualitas materi — 18 September 2026

- Pendalaman konten dilanjutkan dengan isi yang lebih spesifik per topik, termasuk konsep teknis, contoh penerapan, alur kerja, troubleshooting, dan latihan.
- Verifikasi live saat checkpoint: **58 materi published** terdiri dari Dasar 22, Intermediate 20, Advanced 12, Tutorial 4.
- Dua entri placeholder **Test** dan **Test 12** terverifikasi berstatus `archived`, sehingga tidak termasuk katalog published.
- Konten published yang diperbarui memiliki panjang sekitar 3.0–3.5 ribu karakter dan telah diperiksa memiliki bagian konsep dan troubleshooting.
- Status: **Needs Verification** untuk review pedagogis lanjutan; struktur teknis sudah diperbaiki, tetapi contoh dan latihan masih perlu diperdalam per materi pada iterasi berikutnya.


## Pendalaman topik Intermediate/Advanced/Tutorial — 18 September 2026

- Seluruh **36 materi published** pada kategori Intermediate (20), Advanced (12), dan Tutorial (4) diperbarui dengan pembahasan topik-spesifik.
- Contoh teknis kini mencakup addressing/routing, DNS/DHCP, VLAN/STP/LACP, QoS/VPN, OSPF/BGP, PKI/TLS, SIEM/IDS, automation, serta prosedur diagnostik pada tutorial.
- Verifikasi live setelah perubahan: **58 materi published** tetap terdiri dari Dasar 22, Intermediate 20, Advanced 12, Tutorial 4; tidak ada perubahan schema atau status publikasi.
- Verifikasi panjang konten: Intermediate sekitar 1.9–2.0 ribu karakter rata-rata, Advanced sekitar 3.1 ribu, Tutorial sekitar 1.9 ribu; kualitas dinilai berdasarkan relevansi teknis, bukan panjang semata.
- Status: **Needs Verification** — perlu review pedagogis akhir dan pengecekan UI/rendering materi sebelum checkpoint kualitas ditutup.


## Verifikasi UI materi — 18 September 2026

- Review index.html menemukan jalur Tutorial sebelumnya hanya menuju anchor kosong sehingga tidak menerapkan filter katalog.
- Perbaikan UI membuat kartu Tutorial pada learning path menggunakan mekanisme filter kategori yang sama dengan Dasar, Intermediate, dan Advanced.
- Review materi/view.html mengonfirmasi halaman materi mengambil hanya status published, menampilkan konten HTML/Markdown melalui sanitasi client-side, dan menyediakan tampilan dokumen asli bila tersedia.
- Commit UI: b69a0c32bc0e01109c0171c0cc13e4e911901fa8.
- Status: Needs Verification untuk browser/E2E runtime; verifikasi source-level selesai, tetapi eksekusi browser belum tersedia pada checkpoint ini.


## Pendalaman pedagogis seluruh materi published — 18 September 2026

- Seluruh **58 materi published** diperbarui mulai dari kategori **Dasar**, kemudian Intermediate, Advanced, dan Tutorial.
- Konten tidak lagi hanya mengulang template umum: setiap materi diberi fokus konsep, contoh kasus, bukti/perintah verifikasi, skenario troubleshooting, dan latihan yang terkait langsung dengan topiknya.
- Verifikasi live setelah perubahan: **Dasar 22, Intermediate 20, Advanced 12, Tutorial 4 = 58 published**; seluruh konten non-kosong.
- Contoh spesifik mencakup subnet /26, DORA DHCP, DNS resolution, MAC learning, NAT/PAT, VLAN 802.1Q, IPv6 SLAAC, OSPF adjacency, BGP path selection, IPsec SA, PKI/TLS, SIEM correlation, serta prosedur Windows ping/tracert.
- Status kualitas: **Needs Verification** untuk browser/rendering dan review pedagogis akhir. Tidak ada perubahan schema, RLS, status publikasi, atau jumlah materi.


## Rekonsiliasi katalog materi — 19 September 2026

- Katalog `docs/MATERIAL-CATALOG.md` direkonsiliasi terhadap data live `public.materi` menggunakan query read-only.
- Verifikasi live menghasilkan **58 materi published**: Dasar 22, Intermediate 20, Advanced 12, Tutorial 4.
- Seluruh 58 judul yang berstatus `published` sekarang dicatat di katalog dan dikelompokkan berdasarkan kategori aktual database.
- Dua placeholder **Test** dan **Test 12** tetap tidak dimasukkan karena berstatus `archived`.
- Commit katalog: `9a65c0a777b04778b35dd283f1bd077b3f6bf434`; commit diverifikasi setelah push.
- Status kualitas materi tetap **Needs Verification** untuk browser/rendering dan review pedagogis akhir.
- Tidak ada perubahan pada data aplikasi, schema, RLS, atau status publikasi pada checkpoint ini.

### Checkpoint berikutnya

Lanjutkan verifikasi runtime/browser dan review pedagogis akhir untuk 58 materi. Setelah area tersebut diverifikasi, lanjutkan residual project items yang masih pending: Restore UI-to-database pada environment terisolasi, local Supabase authoritative baseline, dan consumer eksternal `swift-api` bila diperlukan.


## Dokumentasi hasil Browser E2E — 19 September 2026

- Ditambahkan `docs/BROWSER-E2E-RESULTS.md` sebagai log khusus hasil runtime Browser E2E.
- Dokumen memisahkan runtime evidence dari checkpoint proyek dan menetapkan bahwa source verification tidak boleh dicatat sebagai runtime pass.
- Histori mencatat Browser E2E run #6 sebagai Passed, Draft Recovery run #43 sebagai Passed, run #35 sebagai Failed dengan diagnosis timing, serta assertion public terbaru sebagai **Needs Verification** sampai fresh workflow run tersedia.
- Commit dokumen: `d24fb59a39130ceb748e56654d34e4891385a4a5`.
- `docs/TESTING.md` kini merujuk ke log hasil runtime khusus tersebut; commit dokumentasi terbaru `f8c7ae01e3617f09eb91199ea9c53396bf35a9a3` diverifikasi.
- Status Browser E2E public terbaru tetap **Needs Verification**; tidak ada hasil runtime baru yang diklaim.
- `docs/CHANGELOG.md` mencatat penambahan log hasil Browser E2E; commit dokumentasi `0c7b94de1ebc74a10bb22d3d18b9ab5ade9736d1`.
- `docs/README.md` kini mengindeks `docs/BROWSER-E2E-RESULTS.md`; commit `2a677d264a3dc398879b2be88e0f8c42f6fce7b3`.

### Checkpoint berikutnya

Perbarui `docs/BROWSER-E2E-RESULTS.md` setelah fresh Browser E2E workflow menghasilkan runtime evidence. Tetap pertahankan Restore UI-to-database sebagai **Blocked** sampai environment Supabase terisolasi tersedia.


## Admin Dashboard + CRUD materi hardening — 19 September 2026

- Branch aktif terverifikasi: `19-Sep-2026`; perubahan dilakukan setelah konfirmasi pengguna.
- Audit source Admin Dashboard dan workspace CRUD menemukan gap bahwa permission `content.delete` sudah tersedia di RBAC tetapi belum memiliki tombol/action DELETE pada `content/materials.html`, dan tabel `materi` belum memiliki policy DELETE.
- UI diperbaiki untuk menampilkan tombol **Hapus** hanya kepada user dengan `content.delete`, meminta konfirmasi, menjalankan DELETE, mencatat aktivitas penghapusan, lalu me-refresh daftar.
- Commit UI: `73d76de076a9ccc799c98d409b17e9f963896eec`; file hasil commit diverifikasi kembali dari GitHub.
- RLS DELETE ditambahkan pada `public.materi` untuk role `admin` dan `super_admin`, selaras dengan mapping `content.delete`.
- Live migration tercatat sebagai `20260919065701_add_materi_delete_policy_20260919_reconcile`; policy diverifikasi melalui `pg_policies` dan repository migration file diselaraskan dengan live migration history.
- Commit migration file awal: `08a2e47b53f54ccce477653ee581790248adc2a6`; commit alignment: `2c5c69884d844bb0391138f659d5ce746f5fe0c7` dan `10c9e429cee2863ea7712ecd6b280d33e7c19c7f`.
- Dokumentasi diperbarui: RBAC `79cf302427d9bff3f938b23c851eb5db33c03c97`, CONTENT-WORKFLOW `4425649a873d71e47e20f7b2228b00e01254372b`, TESTING `67ac9852c62adcc0e42092bc087b1a2d523d6dfa`, CHANGELOG `c583293aedefb0fa6389a7824640ddad7e79d84c`.
- Verifikasi database: policy DELETE aktif; `materi_versions_materi_id_fkey` menggunakan `ON DELETE CASCADE` sehingga snapshot versi terkait ikut terhapus.
- Security Advisor setelah DDL tetap menunjukkan 7 application `SECURITY DEFINER` warnings dan 1 leaked-password warning; tidak ada warning baru akibat policy DELETE.

### Status

- Admin Dashboard + CRUD delete: **Needs Verification** untuk runtime browser/E2E.
- Backend DELETE RLS: **Verified** secara live melalui catalog/policy query.
- Browser E2E delete: **Pending**; jangan menjalankan destructive test terhadap production data.

### Checkpoint berikutnya

Tambahkan/siapkan isolated E2E test data untuk memverifikasi Create → Read → Update → status workflow → Delete dari browser tanpa menyentuh materi production. Restore UI-to-database tetap **Blocked** sampai environment Supabase terisolasi tersedia.


## Automated Browser E2E result recording — 19 September 2026

- Branch `19-Sep-2026` tetap menjadi branch yang dikonfirmasi untuk perubahan ini.
- Browser E2E workflow sekarang menjalankan recorder setelah test dengan `if: always()`, sehingga run **pass maupun fail** tetap dicatat.
- `scripts/record-browser-e2e.mjs` membaca `test-results/results.json` dan menulis runtime evidence ke `docs/BROWSER-E2E-RESULTS.md` serta checkpoint ringkas ke file ini.
- Workflow memiliki `contents: write` hanya untuk kebutuhan commit dokumentasi hasil E2E dan menggunakan commit `[skip ci]` agar commit pencatatan tidak memicu siklus E2E baru.
- Implementasi workflow: `f57fa87230636398a4b991f253454ef4ddce8cbb`.
- Recorder: `d3357e712d98ffe50cb93cdde3b489db5a529eb6`.
- TESTING: `a277227b35bca1af711088b8ec1872e6ec3eaaa8`.
- CHANGELOG: `c7a31ba2afe80580befce87b22e4cc7cac280b5b`.

### Status

- Automatic Browser E2E result recording: **Implemented — Needs Runtime Verification**.
- CRUD Delete browser E2E: **Pending**; tetap tidak boleh dijalankan terhadap production data.
- Restore UI-to-database: **Blocked** sampai environment Supabase terisolasi tersedia.

### Checkpoint berikutnya

Jalankan Browser E2E sekali pada branch `19-Sep-2026` untuk memverifikasi bahwa workflow dapat menjalankan test, membuat `test-results/results.json`, lalu otomatis memperbarui dua dokumen hasil/progres. Setelah run selesai, verifikasi commit otomatis dan isi `docs/BROWSER-E2E-RESULTS.md`.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #155** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35428161841`; commit yang diuji: `ea81d15ab0179b8253a26f7211b250f1503ed1f5`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35428161841.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #159** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35428417008`; commit yang diuji: `e6bf364db00e3497ecf044597c4bc4fcc845ee2a`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35428417008.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #160** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35428502175`; commit yang diuji: `5e6951fb8455593d57aa1650157deeb97b605614`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35428502175.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Browser E2E result retention — 19 September 2026

- Recorder `scripts/record-browser-e2e.mjs` diperbarui agar `docs/BROWSER-E2E-RESULTS.md` hanya menyimpan **satu runtime result terbaru**.
- Saat runtime E2E baru dicatat, bagian `Runtime history` lama diganti dengan hasil terbaru; hasil run sebelumnya tidak lagi menumpuk di dokumen tersebut.
- Runtime terbaru yang saat ini tercatat adalah Browser E2E #160: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Recorder commit: `49217aac93c56afc4e9a219008291fef3d3e3924`; file diverifikasi setelah push.
- Results document commit: `707cd41fa82212772516f4c8625f7cd0e74f2c30`; isi diverifikasi setelah push.

### Status

- Latest-only Browser E2E result recording: **Implemented — Needs Fresh Runtime Verification**.
- Existing latest runtime #160 remains **Passed**.
- Restore UI-to-database: **Blocked** sampai environment Supabase terisolasi tersedia.

### Checkpoint berikutnya

Jalankan Browser E2E berikutnya dan pastikan `docs/BROWSER-E2E-RESULTS.md` otomatis menggantikan hasil #160 dengan hasil run baru, bukan menambahkan entry lama.


## Documentation sync — latest-only Browser E2E results

- `docs/TESTING.md` diperbarui untuk menjelaskan bahwa `docs/BROWSER-E2E-RESULTS.md` hanya menyimpan runtime result terbaru.
- TESTING commit: `0539a07f6334317b89b5cc8e93ad1ba527e160cb`; isi diverifikasi setelah push.


## Documentation sync — latest-only Browser E2E changelog

- `docs/CHANGELOG.md` mencatat perubahan retention latest-only untuk hasil Browser E2E.
- CHANGELOG commit: `e93248ea0513ca99650956261acfd8d6d5a0a7ac`; isi diverifikasi setelah push.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #168** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35428756268`; commit yang diuji: `98dcc61fa1a1baeab4edaa6b11f46ca49f8f123d`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35428756268.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #171** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35429091688`; commit yang diuji: `f75d67c889623a4a9284bf5f43ad7f02cdb01860`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35429091688.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #182** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35429378913`; commit yang diuji: `d0757a17183ecae5669c4509f946f659f4df0fc6`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35429378913.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Modul Ujian Online & Riwayat Belajar — 19 September 2026

- Menambahkan schema terpisah untuk kategori ujian, ujian, bank soal, opsi, answer key, attempt, answer, dan riwayat baca materi.
- Menambahkan 4 ujian published berdasarkan kategori materi: Dasar, Intermediate, Advanced, Tutorial.
- Seed live: 20 soal, masing-masing 5 soal per kategori, dengan 20 answer key.
- Menambahkan learner login/dashboard, riwayat belajar, katalog ujian, pengerjaan dengan timer, serta admin bank soal.
- Menambahkan Edge Function `exam-api` untuk start/submit dan penilaian server-side; deployment aktif dengan `verify_jwt=true`.
- Menambahkan permission `exam.manage` dan `exam.read` untuk Admin/Super Admin.
- Verifikasi database live: seluruh 8 tabel modul memiliki RLS aktif; reading history masih 0 row karena belum ada learner test yang menjalankan pembukaan materi.

### Status

- Schema/RLS/seed/Edge Function: **Verified**.
- UI/source integration: **Needs Verification**.
- Browser E2E learner: **Pending**.
- Restore UI-to-database: **Blocked** sampai environment Supabase terisolasi tersedia.

### Checkpoint berikutnya

Jalankan browser test dengan akun learner khusus untuk memverifikasi login, reading history, start/submit ujian, timer, hasil, dan riwayat attempt. Setelah runtime pass, catat hasil ke dokumentasi E2E seperti mekanisme Browser E2E yang sudah ada.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #192** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35429485400`; commit yang diuji: `b208db77c23d4eb712cc274f8cd91bb53c21a91a`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35429485400.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Learner role / user biasa — 19 September 2026

- Branch: `19-Sep-2026`.
- Commit migration: `43f833613f7b88b88f9d4750c4ef06bc1e892801`.
- Live migration diterapkan dan diverifikasi.
- Role `user` / label Pengguna tersedia dengan `learning.read`, `exam.take`, dan `exam.history.read`.
- Trigger auto-assignment untuk Auth user baru aktif; 4 Auth users saat verifikasi memiliki 4 assignment role `user`.
- Commit helper auth: `134693851f8a87101a003c63f46f98a25d405cbc`; `shared/auth.js` sekarang membaca role learner dari `user_roles` bila user bukan staf.
- Status: **Needs Verification** untuk Browser E2E learner; source dan database sudah diverifikasi.
- Checkpoint berikutnya: uji login learner, Belajar Saya, reading history, Ujian Online, timer, submit, hasil, dan riwayat attempt dengan akun E2E learner khusus.

## Documentation checkpoint — learner architecture — 19 September 2026

- `docs/ARCHITECTURE.md` diperbarui untuk menjelaskan boundary role `user` non-staf dan fallback role pada `shared/auth.js`.
- Commit dokumentasi dibuat setelah verifikasi commit implementasi sebelumnya.
- Status learner tetap **Needs Verification** pada browser karena runtime learner E2E belum dijalankan.

## Testing checkpoint — learner role — 19 September 2026

- `docs/TESTING.md` menambahkan matrix verifikasi role `user`.
- Source/database verification: **Verified**.
- Runtime Browser E2E learner: **Pending**.
- Runtime yang dibutuhkan: login, Belajar Saya, reading history, Ujian Online, timer, submit, hasil, attempt history, dan penolakan area Admin.

## Changelog checkpoint — learner role — 19 September 2026

- `docs/CHANGELOG.md` mencatat penambahan role `user` dan permission learner.
- Seluruh implementasi yang dicatat telah diverifikasi pada branch `19-Sep-2026`.
- Status berikutnya tetap Browser E2E learner.

## Learner role staff isolation — 19 September 2026

- Migration commit `428cdec6a1e4c137eeee18abdb5889c2f0c2099a` membersihkan assignment role `user` dari akun yang memiliki row `admin_users`.
- Migration live diterapkan dan diverifikasi; `staff_with_user_role = 0`.
- Status: **Verified** untuk isolasi role learner dari role staf.
- Checkpoint berikutnya: pastikan jalur pembuatan staf baru tidak meninggalkan role learner otomatis.

## Learner/staff role separation — 19 September 2026

- Migration commit `802f69f3f3f390d978640905524d7dc9ed93d195` menambahkan trigger `trg_remove_learner_role_from_staff` pada `admin_users`.
- Trigger menghapus role `user` saat record staf dibuat atau diperbarui, sehingga akun staf tidak memperoleh permission learner dari auto-assignment.
- Migration live diterapkan dan diverifikasi; `staff_with_user_role = 0` dan trigger aktif.
- Status: **Verified**.
- Checkpoint berikutnya: jalankan Browser E2E learner dengan akun khusus dan verifikasi routing/akses Belajar Saya + Ujian Online tanpa akses Admin.

## RBAC documentation checkpoint — learner/staff separation — 19 September 2026

- `docs/RBAC.md` diperbarui untuk mendokumentasikan pemisahan role learner `user` dari role staf.
- Verifikasi live: 0 staf memiliki role `user`.
- Status role learner: **Verified** pada database/source; Browser E2E learner masih **Pending**.

## Database documentation checkpoint — learner role — 19 September 2026

- `docs/DATABASE.md` diperbarui dengan migration learner dan mekanisme pemisahan role staf.
- Verifikasi database tetap: role/permission learner tersedia dan 0 staf memiliki role learner.
- Status: **Verified** pada database; Browser E2E learner tetap **Pending**.

## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #211** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35430353728`; commit yang diuji: `bf3f26f56e94859d9b67fd4f562b7b05930b5380`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35430353728.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Reading history — end-of-material confirmation — 19 September 2026

- Branch `19-Sep-2026` terverifikasi sebelum perubahan dan tetap menjadi branch yang dikonfirmasi.
- `materi/view.html` diperbarui: membuka materi tidak lagi membuat row riwayat; learner harus mencapai sentinel di bagian paling bawah, mencentang `Saya sudah membaca materi ini sampai bagian paling bawah`, lalu menekan `Tandai sudah dibaca`.
- Commit UI: `8f604b492aeade64bfadfb2530820d037524db40`; file diverifikasi kembali dari GitHub.
- Migration live `20260919130000_require_reading_completion_confirmation` diterapkan. Policy INSERT hanya menerima row milik `auth.uid()` dengan `status = completed` dan `completed_at` terisi; UPDATE langsung dari `authenticated` dicabut.
- Commit migration repository: `1153da087212d5196ec860f374c81e3f487a73a3`; file diverifikasi kembali dari GitHub.
- Verifikasi live: `material_reading_history` memiliki policy SELECT milik sendiri dan policy INSERT completed milik sendiri; privilege `authenticated`: SELECT=true, INSERT=true, UPDATE=false.
- Security Advisor tetap menunjukkan 7 warning `SECURITY DEFINER` yang sudah ada dan 1 warning leaked-password protection; tidak ada warning baru dari perubahan ini.
- Dokumentasi diperbarui: `DATABASE.md` commit `da50c34084bfa592ab34c36be646c82f617ac92e`, `TESTING.md` commit `9f2c0fd6c47ba09d24afb6243d9e7d301dca9d18`, `ARCHITECTURE.md` commit `390dfba2710c6f215bd216edd2d09ec56e54e570`, `CHANGELOG.md` commit `3904025607d96ef87e5d76160b72cffad72ec5b6`.

### Status

- Reading history completion flow: **Implemented — Needs Runtime Verification**.
- RLS/privilege boundary: **Verified** live.
- Browser E2E learner: **Pending** untuk login, buka materi, pastikan belum tercatat sebelum bottom, konfirmasi setelah bottom, dan verifikasi Riwayat Belajar.

### Checkpoint berikutnya

Jalankan Browser E2E dengan akun learner khusus untuk memverifikasi alur end-to-end. Hasil runtime harus dicatat otomatis di `docs/BROWSER-E2E-RESULTS.md`. Jangan melakukan destructive test terhadap materi production.


## Main web login + learner profile — 19 September 2026

- `index.html` sekarang menampilkan menu `Masuk` untuk pengunjung. Saat sesi Supabase aktif, menu berubah menjadi nama/email pengguna dan mengarah ke `belajar/profile.html`.
- `belajar/profile.html` ditambahkan sebagai profile khusus learner, terpisah dari profile Admin. Fitur: nama tampilan, avatar, ganti password, ganti email, logout, serta shortcut Riwayat Belajar dan Ujian Online.
- `belajar/index.html` menambahkan tautan Profile pada area Belajar Saya.
- Commit main web: `945d86e86c00b38620805453bf9ac0275187eedd`.
- Commit learner profile: `6b35e55d8277e825ff3cdacbc248120c06947128`.
- Commit Belajar Saya: `489a2bb3ac9a712c2ec5a00ad1104cbc45308159`.
- Source verification: ketiga file berhasil di-fetch kembali dari branch `19-Sep-2026`.

### Status

- Menu login web utama: **Implemented — Needs Browser Verification**.
- Learner profile: **Implemented — Needs Browser Verification**.
- Browser E2E untuk login/profile: **Pending**.

### Checkpoint berikutnya

Verifikasi runtime: pengunjung melihat `Masuk`; learner login melihat nama/profile; profile dapat dibuka; update nama/password/email/avatar mengikuti auth/storage policy; logout mengembalikan menu menjadi `Masuk`. Hasil E2E dicatat di `docs/BROWSER-E2E-RESULTS.md`.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #225** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35430654801`; commit yang diuji: `bc306350a70c05910b13184b030a04279d2cd206`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35430654801.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Admin + Super Admin learner user management — 19 September 2026

- Branch `19-Sep-2026` diverifikasi sebelum perubahan dan tetap digunakan.
- `admin/users.html` sekarang memiliki bagian `Pengguna Belajar`: tambah akun baru dan edit akun learner.
- Admin dan Super Admin memiliki `users.read`, `users.create`, `users.update`, `users.disable` untuk akun learner. Permission ini tidak mengubah batasan staff management.
- Edge Function `manage-users` dibuat dan dideploy dengan `verify_jwt=true`; version 2 aktif. Endpoint `list/create/update` hanya menerima caller Admin/Super Admin aktif dan menolak target yang merupakan staff.
- Migration `20260919140000_allow_admin_learner_user_management` diterapkan dan diverifikasi live.
- Commit migration: `e370e92bedfb32f03724ec3fae47b0325d9205f9`.
- Commit UI: `d3da7b50af387be366f447e58724965eae420ce9`.
- Commit Edge Function source: `689a94365b13acf10b31ac5e59d88afad55d90e7`.
- Edge Function deployment: `manage-users` version 2, status ACTIVE, `verify_jwt=true`.
- Runtime E2E create/edit learner: **Pending**.

### Status

- RBAC Admin/Super Admin learner management: **Verified** live.
- UI + Edge Function: **Implemented — Needs Browser Verification**.

### Checkpoint berikutnya

Jalankan Browser E2E menggunakan akun Admin dan Super Admin untuk create/edit learner, termasuk memastikan Admin tidak dapat mengedit akun staff melalui endpoint learner. Hasil dicatat di `docs/BROWSER-E2E-RESULTS.md`.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #235** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35430758926`; commit yang diuji: `12b25075370d77887315590e8d201c5f0ede8f54`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35430758926.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.
\n\n## Dashboard konten + kategori materi dinamis — 19 September 2026\n\n- Branch `19-Sep-2026` terverifikasi dan digunakan untuk perubahan ini.\n- Menambahkan migration `20260919150000_add_materi_categories` dan menerapkannya ke Supabase live.\n- Verifikasi live: tabel `materi_categories` tersedia, RLS aktif, dan 4 kategori existing tersinkronisasi: Advanced, Dasar, Intermediate, Tutorial.\n- Editor materi sekarang memuat kategori aktif dari database dan menyediakan tautan Kelola Kategori.\n- Workspace Kelola Materi menambahkan halaman Kategori Materi untuk menambah kategori baru.\n- Dashboard Admin diperluas dengan Kelola Konten / Materi dan Kategori Materi.\n- Dashboard Super Admin diperluas dengan Kelola Konten / Materi dan halaman Pengaturan.\n- Security Advisor setelah migration tetap pada baseline: 7 warning application `SECURITY DEFINER` dan 1 leaked-password; tidak ada warning baru dari tabel kategori.\n\n### Commit dan verifikasi\n\n- Migration repository: `bbd22061373370c74247563c79058b02274dfda6`.\n- Editor kategori dinamis: `22d1c4548df75784b9a75efcf424b1cc4ecaf565`.\n- Halaman kategori: `8decec2bd067d45a251030deef1791fdc144170a`.\n- Workspace kategori: `8f5afdc8eb32387f050b7b4d91728c32403a56c2`.\n- Dashboard Admin: `2e06faf9c44b7181bf6cfaa2c960a7109d7c45eb`.\n- Dashboard Super Admin: `5e8967ec957ecfdde580d4344d1b31ddb71dbffc`.\n- Pengaturan: `7f8e3fec1384aa89ae8e4d22e6c18f2d269be4c7`.\n\n### Status\n\n- Database kategori: **Verified**.\n- Source UI/dashboard: **Verified**.\n- Browser E2E kategori + fresh deployment: **Pending / Needs Verification**.\n- Learner E2E: **Pending**.\n- Restore UI-to-database: **Blocked** sampai environment Supabase terisolasi tersedia.\n\n### Checkpoint berikutnya\n\nJalankan Browser E2E fresh pada branch `19-Sep-2026` untuk memverifikasi dashboard Admin/Super Admin, tambah kategori baru, pilihan kategori pada editor, dan rendering Kelola Konten. Catat hasil otomatis ke `docs/BROWSER-E2E-RESULTS.md`.\n

## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #248** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35431123800`; commit yang diuji: `0170a36f2ca63c2dbb93d8a4c9bd8593aa6b5316`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35431123800.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Kategori Materi — full management — 19 September 2026

- Branch: `19-Sep-2026`.
- Migration `20260919160000_allow_materi_category_management` diterapkan ke Supabase live.
- RLS UPDATE dan DELETE kategori diverifikasi; keduanya membutuhkan `content.manage_categories`.
- Halaman kategori sekarang mendukung tambah, ubah nama, aktif/nonaktif, dan hapus.
- Rename/delete kategori yang masih digunakan materi diblokir agar referensi `materi.kategori` tidak rusak.
- Migration commit: `7c7cc664fa1bf8ead23f86e1db0b16291b00de1c`.
- UI commit: `a2f8499223c8d6f0c3ed38f024a0325ce47563f2`.
- Rename protection fix commit: `7abce5eaebee9543aaefabcd1ac5b47eef4f38d9`.
- Supabase Security Advisor setelah perubahan tetap baseline: 7 application `SECURITY DEFINER` warnings + 1 leaked-password warning; tidak ada warning kategori baru.

### Status

- Category schema/RLS: **Verified**.
- Category management source: **Verified**.
- Browser E2E kategori: **Pending** sesuai keputusan untuk menunda E2E sampai seluruh feature request selesai.


## Riwayat Ujian learner — 19 September 2026

- Menambahkan `belajar/ujian-riwayat.html` untuk menampilkan attempt milik learner: kategori, judul, waktu, status, nilai, dan hasil lulus/tidak lulus.
- Menambahkan shortcut Riwayat Ujian dari Belajar Saya dan Profile.
- Menyelaraskan copy Riwayat Belajar dengan aturan completion baru.
- Source verification: file baru dan perubahan navigasi telah di-fetch kembali dari branch `19-Sep-2026`.

### Status

- Learner exam history source: **Verified**.
- Browser E2E learner: **Pending** sesuai keputusan menunda E2E sampai seluruh feature request selesai.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #264** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35431412907`; commit yang diuji: `917f53110d6ab39f668aefa897879de2d3a292c7`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35431412907.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Administrasi Ujian diperluas — 19 September 2026

- `admin/exams.html` diperluas untuk create/edit ujian, publish/draft, kategori, durasi, nilai lulus, tambah soal, dan hapus soal.
- Source UI diverifikasi kembali dari branch `19-Sep-2026`.
- RLS live pada tabel ujian/soal/kunci/pilihan tetap menggunakan permission `exam.manage` untuk operasi manajemen.
- Browser E2E masih **Pending** sampai seluruh feature request selesai.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #268** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35434786696`; commit yang diuji: `060262ecee21f2d2d6aa677e8de9d678a48cbd53`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35434786696.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Pengaturan & learner UX — 19 September 2026

- Branch `19-Sep-2026` tetap digunakan.
- Commit Pengaturan Super Admin: `4ea04ba22b5d6912bc12d841e3ce3216da258dd3` — hub diperluas ke Pengguna Belajar, Konten/Materi, Kategori, Ujian, dan Aktivitas Sistem; tidak membuat tabel konfigurasi global baru.
- Commit dashboard learner: `93bc6a8ac4eacf988aef9deafeb479d9183e0f59` — ringkasan materi selesai, percobaan ujian, ujian lulus, dan navigasi.
- Commit Riwayat Belajar: `cb72d639064197e7555a2947fe8018a953238544` — pencarian dan filter status.
- Commit Riwayat Ujian: `1c2896d6de94230eacf09f73101747f1a38821db` — ringkasan dan filter hasil.
- Commit katalog Ujian: `d7686fe30b862e4f879e4c83b18999d0de2d97d7` — pencarian dan filter kategori.
- Commit pengerjaan Ujian: `39b11978544812594659af3f2b3397dd8c580406` — pencegahan submit ganda, konfirmasi soal kosong, peringatan lima menit, dan penghentian timer.
- Source verification: seluruh file perubahan telah di-fetch kembali dari branch.
- Dokumentasi testing: `6711713ed4bb0d96d81304fff5583c0cdf52cb15`.
- Dokumentasi changelog: `b20439e0dbb594cfc1884f5cbae77526a5176ed5`.

### Status

- Pengaturan Super Admin: **Implemented — Needs Browser Verification**.
- Learner UX: **Implemented — Needs Browser Verification**.
- Browser E2E tetap **Pending** sesuai keputusan menunggu seluruh feature request selesai.
- Restore UI-to-database: **Blocked** sampai environment Supabase terisolasi tersedia.

### Checkpoint berikutnya

Lanjutkan feature request yang masih pending, terutama pendalaman administrasi Ujian bila diperlukan. Setelah seluruh fitur selesai, jalankan fresh Browser E2E learner/admin dan catat setiap hasil pada `docs/BROWSER-E2E-RESULTS.md`, kemudian lakukan final security/deployment audit.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #277** pada branch `19-Sep-2026` selesai dengan hasil **Passed**.
- Run ID: `35435609307`; commit yang diuji: `16c38b3f2efc6a5c93d97cfed65e4c54f5b2ce1b`.
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35435609307.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.


## Feature expansion batch 1 — 19 September 2026

- Branch terverifikasi: 19-Sep-2026.
- Commit migration foundation: 8b662eb6c65401d0996bee5fcc31f6dafe1e735b.
- Commit exam category activation migration: 2cb12da0cf9e9aded6dca96f31920cca56704508.
- Commit administrasi ujian: 6aee4e7a643ed88908651bf7702f25580da07c6e, lalu bugfix archive attempt detection cc4a51795be84bcd6de5e6a701585b5a9660f447.
- Database verification: exams.archived_at, exam_categories.is_active, materi_bookmarks, materi_feedback, dan learner_notifications tersedia; RLS aktif pada tiga tabel learner baru.
- Security Advisor tetap baseline: 7 application SECURITY DEFINER warnings + 1 leaked-password warning.

### Status fitur tambahan

- Admin Ujian edit/reorder/archive/category: Implemented — Needs Browser Verification.
- Bookmark/feedback/notifikasi database foundation: Implemented — UI Pending.
- Detail hasil ujian: Pending.
- Dashboard progres learner: Pending.
- Statistik admin: Pending.
- Filter pengguna lanjutan: Pending.
- Notifikasi UI: Pending.
- Bookmark UI: Pending.
- Feedback UI: Pending.
- Sertifikat: Deferred setelah aturan kelulusan final.
- Browser E2E: Pending sampai seluruh feature request selesai.
- Restore UI-to-database: Blocked sampai environment Supabase terisolasi tersedia.

### Checkpoint berikutnya

Lanjutkan implementasi UI learner dan admin untuk bookmark, feedback, notifikasi, dashboard progres/statistik, filter pengguna, serta detail hasil ujian. Setelah semua feature request selesai, jalankan fresh Browser E2E dan final security/deployment audit.


## Feature expansion batch 2 — 19 September 2026

- Commit learner material engagement UI: f8d40c3ffd62d3478858ccb792a63181657ab67c.
- Commit Bookmark learner page: 3fa7a9306e0a89ad99e733827af44265643ccbd3.
- Commit Notification learner page: f40c6f58198dfaca62cecfca815ecdcf5bb4b48c.
- Commit learner dashboard: 14ef12f7b2895775f280ff89f2405b9a7a4344f7.
- Commit user status filters: 86f08aa80f5cd60af7f18014a492874c21771aab.
- Commit admin statistics: bf9e551bf5ccc3769bb3b3a6f704256c8335976b.
- Commit exam result API: f3e072b45d79ee4c06e1491fb7d0c5aa95325cf3; deployed `exam-api` version 2 ACTIVE with `verify_jwt=true`.
- Commit exam result page: f40ebf413269fed34c767b2881c9cae3090ae999.
- Commit exam history detail-link fix: cb430f17b6d432a0a4ce4a53883139e9673a463b.
- Commit notification permission migration: 6e341ffd082bbac5fbdfedc1ba7b2e3dcf334d0c.
- Commit notification center: eb7d8affc8af1ff2e5ffb9714dddc0bfc75c5269.
- Commit feedback policy migration: 5e11ee210b06c604922bf0af101d8cada4164f1c.
- Commit feedback review page: 0ab2082a9ef48e16bbe91b466575b24abdd63ad2.
- Commit admin dashboard links: d9e83fc3f7e8814d6487e38d2f2090fa2232f682.

### Live verification

- `notifications.manage` exists and is mapped to Admin + Super Admin.
- RLS policies verified for bookmarks, feedback, and learner notifications.
- Published exams remain 4 and archive column is available.
- Security Advisor remains at baseline 7 application SECURITY DEFINER warnings + 1 leaked-password warning.

### Status

- Bookmark: **Implemented — Needs Browser Verification**.
- Feedback: **Implemented — Needs Browser Verification**.
- Notifications: **Implemented — Needs Browser Verification**.
- Learner progress: **Implemented — Needs Browser Verification**.
- Admin statistics: **Implemented — Needs Browser Verification**.
- Advanced user filters: **Implemented — Needs Browser Verification**.
- Exam result detail: **Implemented — Needs Browser Verification**.
- Certificate: **Deferred**.
- Browser E2E: **Pending** until feature requests are complete.
- Restore UI-to-database: **Blocked** until isolated Supabase environment exists.

### Checkpoint berikutnya

Lanjutkan feature completion yang masih tersisa: verify/fix public archive filtering, inspect UI links and source parity, then final security/deployment audit. Setelah feature freeze, jalankan fresh Browser E2E dan catat hasil di `docs/BROWSER-E2E-RESULTS.md`.


## Feature expansion batch 3 — 19 September 2026

- Commit certificate page: af49e7d288b5a7eea655b49bd13438207b8e44f3.
- Commit certificate link: 577a7e9bdd30f9d356312a0c395a2fa0e2a1b84b.
- Commit exam result payload title fix: a0ddc93cfabecdcaf8e159bc7f1f118711086791.
- `exam-api` redeployed version 4 ACTIVE with `verify_jwt=true`.

### Feature request status

- Admin Ujian edit/reorder/archive/category: **Implemented — Needs Browser Verification**.
- Learner progress dashboard: **Implemented — Needs Browser Verification**.
- Exam result detail: **Implemented — Needs Browser Verification**.
- Certificate kelulusan: **Implemented — Needs Browser Verification**.
- Bookmark materi: **Implemented — Needs Browser Verification**.
- Feedback materi + admin review: **Implemented — Needs Browser Verification**.
- Notifikasi learner + admin sender: **Implemented — Needs Browser Verification**.
- Statistik admin: **Implemented — Needs Browser Verification**.
- Filter pengguna: **Implemented — Needs Browser Verification**.

### Feature freeze candidate

Seluruh fitur tambahan yang disepakati pada batch ini sudah memiliki source implementation atau database foundation. Belum boleh dinyatakan final sebelum Browser E2E fresh, source/deployment parity, dan final security audit dilakukan.

Restore UI-to-database tetap **Blocked** karena belum ada environment Supabase terisolasi.

### Checkpoint berikutnya

Lakukan source review final untuk semua feature batch, verifikasi deployment parity, lalu jalankan fresh Browser E2E setelah feature freeze. Catat setiap hasil runtime di `docs/BROWSER-E2E-RESULTS.md`, kemudian lakukan final Security Advisor/RLS/Storage/deployment audit.


## Feature expansion final source checkpoint — 19 September 2026

- Final archive filter commits: f2a2928c1ea88d4221f7302f915a3571aa5b53b1 and a2d7401b2cfa1e99d83a7a5f5ddef00d51238605.
- Bookmark toggle fix: b602737fdc2f2802b9c319f4603bfe48d3ef60f5.
- Certificate title/result payload fixes: af49e7d288b5a7eea655b49bd13438207b8e44f3 and a0ddc93cfabecdcaf8e159bc7f1f118711086791.
- exam-api deployed version 4 ACTIVE with verify_jwt=true; deployment was refreshed after the final source changes.
- All feature-request source files and docs were fetched again from branch 19-Sep-2026 and expected feature markers were present.
- Security Advisor remains baseline: 7 application SECURITY DEFINER warnings + 1 leaked-password warning.

### Feature freeze status

Source implementation is complete for the agreed feature set: exam administration improvements, learner progress, exam result detail, printable certificate, bookmarks, feedback/review, notifications, admin statistics, and user status filters.

Runtime verification remains **Pending**. Per project decision, fresh Browser E2E should now be the next execution step because feature work is complete.

Restore UI-to-database remains **Blocked** until an isolated Supabase environment exists.

### Next checkpoint

1. Run fresh Browser E2E from the current default branch.
2. Record the runtime result automatically in docs/BROWSER-E2E-RESULTS.md.
3. Diagnose any failures before claiming feature completion.
4. Perform final Security Advisor/RLS/Storage/deployment audit.
5. Verify documentation and final checkpoint again.


## Automated Browser E2E runtime record — 2026-09-19

- Workflow **Browser E2E #322** pada branch `19-Sep-2026` selesai dengan hasil **Failed**.
- Run ID: `35436176556`; commit yang diuji: `03f6850e9df39a30b70f96997ffcad6d02e9b4ab`.
- Playwright summary: **8 passed, 1 failed, 0 skipped, 0 flaky**.
- Runtime evidence dicatat otomatis ke `docs/BROWSER-E2E-RESULTS.md`; detail run: https://github.com/kryznanet/learn/actions/runs/35436176556.
- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.
