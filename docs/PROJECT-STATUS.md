# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Checkpoint dokumentasi dan workflow pengembangan selesai. Tidak ada perubahan behavior aplikasi pada checkpoint ini. Sesi dihentikan dengan pekerjaan berikutnya tercatat pada security hardening database.

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
- `DEVELOPMENT.md` — aturan wajib siklus pengembangan dan dokumentasi setelah commit.
- `README.md` — documentation index.

`PROJECT-STATUS.md` tetap menjadi sumber checkpoint/progres, sedangkan dokumen teknis menjadi sumber detail implementasi.

## ✅ Progres terbaru — 17 September 2026

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
Workflow materi, `materi_versions`, snapshot trigger, restore RPC, activity logging, autosave, dan draft recovery sudah tersedia. Browser E2E restore/autosave masih pending.

### 5. Storage dan RLS
RLS tabel inti aktif. Storage `materi-files` sudah diselaraskan dengan RBAC dan public read dibatasi pada file materi `published`.

### 6. RBAC terbaru
`system_activity_logs` sekarang dapat dibaca Admin dan Super Admin sesuai `system.view_logs`. `admin_users` sekarang dapat dibaca dan diperbarui Admin/Super Admin sesuai pembagian user management; perubahan role dan penambahan user tetap Super Admin-only melalui jalur RPC.

### 7. Edge Functions
`create-staff` aktif version 3 dan source repo parity dengan deployment. Role `editor` sudah didukung. `swift-api` aktif version 1 tetapi tidak memiliki source counterpart di branch; tidak diubah dan tidak dihapus.

### 8. Aturan workflow pengembangan
Aturan resmi sekarang terdokumentasi di `docs/DEVELOPMENT.md`: setiap perubahan mengikuti **ubah → commit → verifikasi → update dokumentasi & progres → verifikasi dokumentasi → lanjut**. Setiap commit wajib diikuti pembaruan dokumentasi teknis yang relevan dan `PROJECT-STATUS.md`.

## 🔐 Security Advisor checkpoint

Temuan yang masih dicatat:
- `set_materi_updated_at()` memiliki mutable `search_path`.
- `snapshot_materi_version()` adalah `SECURITY DEFINER` yang masih executable oleh anon/authenticated dan perlu dibatasi karena trigger-only.
- SECURITY DEFINER RPC yang menjadi jalur aplikasi tetap perlu ditinjau satu per satu berdasarkan kebutuhan execute/authorization.
- Leaked Password Protection Supabase masih disabled.

## 🛑 Checkpoint akhir sesi — 17 September 2026

- Aturan post-commit dan dokumentasi sudah ditambahkan ke repository.
- `docs/README.md`, `docs/CHANGELOG.md`, dan `docs/PROJECT-STATUS.md` sudah diperbarui.
- Tidak ada perubahan behavior aplikasi pada checkpoint dokumentasi ini.
- Checkpoint sesi berikutnya ditetapkan pada hardening database/security.

## ⚠️ Pekerjaan selanjutnya

### Prioritas 1 — Security hardening database
1. Hardening `snapshot_materi_version()` — revoke `EXECUTE` untuk anon/authenticated tanpa memutus trigger.
2. Hardening `set_materi_updated_at()` dengan `search_path` eksplisit.
3. Evaluasi dan, bila sesuai, aktifkan Leaked Password Protection.
4. Jalankan ulang Security Advisor dan dokumentasikan hasil terbaru.

### Prioritas 2 — Browser E2E
5. Uji Version Restore dari UI sampai database.
6. Uji Autosave & Draft Recovery.

### Prioritas 3 — Final audit
7. Audit final query halaman publik dan sanitasi.
8. Audit final seluruh `SECURITY DEFINER`, RLS, Storage policy, privilege, dan index.
9. Audit final formatting seluruh repo.
10. Review consumer eksternal `swift-api` sebelum keputusan retirement.

## 🧭 Titik lanjut sesi berikutnya

Mulai langsung dari **audit dan hardening `snapshot_materi_version()`**, pastikan trigger insert/update tetap bekerja setelah pembatasan `EXECUTE`. Lanjutkan dengan `search_path` `set_materi_updated_at()`, rerun Security Advisor, lalu dokumentasikan hasil sebelum masuk ke E2E.

## 🔁 Aturan sesi berikutnya

Untuk setiap perubahan setelah checkpoint ini tetap gunakan siklus:

```text
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
