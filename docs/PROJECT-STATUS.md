# 📌 Status Proyek — Kryzna Learn

**Tanggal:** 17 September 2026  
**Branch:** `17-Sep-2026`  
**Status sesi:** Audit Edge Function, parity deployment, penyelarasan RBAC, dan dokumentasi teknis utama sudah diperbarui. Checkpoint berikutnya tetap security hardening database.

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
- `CHANGELOG.md` — histori perubahan.
- `DECISIONS.md` — keputusan arsitektur dan alasannya.
- `LEGACY.md` — inventory legacy dan aturan cleanup.
- `SWIFT-API-AUDIT.md` — audit khusus `swift-api`.
- `README.md` — documentation index yang sudah diperbarui.

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

## 🔐 Security Advisor checkpoint

Temuan yang masih dicatat:
- `set_materi_updated_at()` memiliki mutable `search_path`.
- `snapshot_materi_version()` adalah `SECURITY DEFINER` yang masih executable oleh anon/authenticated dan perlu dibatasi karena trigger-only.
- SECURITY DEFINER RPC yang menjadi jalur aplikasi tetap perlu ditinjau satu per satu berdasarkan kebutuhan execute/authorization.
- Leaked Password Protection Supabase masih disabled.

## 🛑 Checkpoint sesi

Dokumentasi proyek sudah diperluas dan index dokumentasi diperbarui. Tidak ada perubahan code aplikasi pada pekerjaan dokumentasi ini.

## ⚠️ Pekerjaan selanjutnya

1. Hardening `snapshot_materi_version()` — revoke `EXECUTE` untuk anon/authenticated tanpa memutus trigger.
2. Hardening `set_materi_updated_at()` dengan `search_path` eksplisit.
3. Evaluasi dan, bila sesuai, aktifkan Leaked Password Protection.
4. Jalankan ulang Security Advisor.
5. Uji browser Version Restore.
6. Uji Autosave & Draft Recovery.
7. Audit final query halaman publik dan sanitasi.
8. Audit final `SECURITY DEFINER`, RLS, Storage, dan index.
9. Audit final formatting seluruh repo.
10. Review consumer eksternal `swift-api` sebelum keputusan retirement.

## 🧭 Titik lanjut sesi berikutnya

Mulai dari **hardening `snapshot_materi_version()` dan `set_materi_updated_at()`**, lalu verifikasi ulang Security Advisor. Setelah itu lanjut E2E Version Restore/Autosave dan audit final.
