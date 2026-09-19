# Arsitektur Kryzna Learn

**Tanggal checkpoint:** 18 September 2026  
**Branch aktif:** `18-Sep-2026`

## Tujuan

Dokumen ini menjelaskan batas modul, alur data, autentikasi, RBAC, dan boundary antara website publik, Kelola Materi, Administrasi, Supabase, dan Edge Functions.

## Modul aplikasi

```text
Kryzna Learn
├── Website Publik
│   ├── Beranda
│   └── Materi / Detail Materi
├── Kelola Materi
│   ├── Daftar Materi
│   ├── Tulis / Edit Materi
│   ├── Riwayat Versi
│   └── Riwayat Aktivitas Materi
└── Administrasi
    ├── Dashboard
    ├── Kelola Pengguna
    ├── Riwayat Aktivitas Sistem
    ├── Import Materi
    └── Pengaturan
```

## Layer

```text
Browser
  ↓
shared/auth.js / UI guard
  ↓
Supabase Auth + PostgREST / RPC / Storage
  ↓
RLS + SECURITY DEFINER authorization
  ↓
PostgreSQL

Browser / Admin workflow
  ↓
Edge Function bila membutuhkan privileged Auth API
```

Frontend permission hanya mengatur UX dan navigasi. Enforcement keamanan berada di RLS, RPC, dan Edge Function.

## Data inti

- `admin_users`: identitas staf dan status/role aplikasi.
- `roles`: role RBAC.
- `permissions`: permission terpusat.
- `user_roles`: assignment role ke user.
- `role_permissions`: mapping role → permission.
- `materi`: konten pembelajaran.
- `materi_versions`: snapshot versi materi.
- `content_activity_logs`: audit aktivitas materi.
- `system_activity_logs`: audit aktivitas sistem/administratif.

## Workflow materi

```text
Draft → Review → Published → Archived
  ↑                         │
  └─────────────────────────┘
```

Transisi dikontrol berdasarkan permission dan enforcement backend. Public hanya melihat `published`.

## Authentication dan session

`shared/auth.js` memusatkan pengambilan user, staf, session, role, permission, serta guard halaman. Permission berasal dari `public.get_my_permissions()`.

## Version history

Perubahan `materi` dibuatkan snapshot oleh trigger ke `materi_versions`. Restore menggunakan RPC `restore_materi_version()` dan menghasilkan perubahan baru yang juga dapat tercatat sebagai versi.

## Edge Functions

- `create-staff`: jalur pembuatan akun staf yang membutuhkan Auth Admin API; aktif dan source repo sudah disinkronkan.
- `swift-api`: deployment aktif legacy/demo tanpa source counterpart pada branch ini; lihat `SWIFT-API-AUDIT.md`.

## Prinsip desain

1. Public content boundary harus ditegakkan backend.
2. Role/permission tidak boleh hanya bergantung pada JavaScript.
3. Privileged Auth API hanya melalui server-side/Edge Function.
4. Secret/service-role key tidak boleh berada di browser.
5. Audit log dipisahkan antara content dan system.
6. Perubahan signifikan harus dicatat di dokumentasi proyek.


## Modul Ujian Online & Riwayat Belajar — 19 September 2026

Kryzna Learn memiliki modul learner terpisah untuk akun belajar, riwayat materi, daftar ujian, pengerjaan ujian, dan hasil. Modul admin memiliki halaman `admin/exams.html` untuk bank soal.

```text
Website Publik
├── Materi / Detail Materi
├── Belajar Saya
│   └── Riwayat Belajar
└── Ujian Online
    ├── Daftar Ujian per Kategori
    └── Pengerjaan + Timer + Hasil

Administrasi
└── Kelola Ujian & Bank Soal

Browser
  ↓ Auth JWT
Edge Function exam-api
  ↓ privileged server-side access
PostgreSQL
├── exams / questions / options
├── answer_keys (tidak dibaca browser)
├── attempts / answers
└── material_reading_history
```

Penilaian ujian dilakukan server-side melalui `exam-api`, sehingga `exam_answer_keys` tidak menjadi sumber data yang dapat dibaca pengguna biasa. Riwayat materi memakai RLS berdasarkan `auth.uid()`.


## Learner role boundary — 19 September 2026

Role `user` adalah role learner non-staf. Assignment disimpan di `user_roles`; `admin_users` tetap khusus staf. Auth user baru memperoleh role learner otomatis melalui trigger database.

`shared/auth.js` memprioritaskan role staf aktif dari `admin_users`, lalu fallback ke role RBAC pada `user_roles`. Dengan demikian akun learner dapat dikenali sebagai `user` tanpa dibuat menjadi staf dan tanpa memperoleh akses Admin.

Akses learner ke Belajar Saya, riwayat belajar, dan Ujian Online tetap ditegakkan oleh Auth + RLS + Edge Function; UI hanya menjadi guard UX.