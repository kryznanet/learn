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
