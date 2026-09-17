# 📚 Dokumentasi Kryzna Learn

Selamat datang di pusat dokumentasi **Kryzna Learn**.

Folder `docs/` menjadi titik masuk utama untuk memahami kondisi proyek, struktur UI, arsitektur, database, keamanan, workflow, deployment, testing, dan keputusan teknis.

> **Mulai dari:** `PROJECT-STATUS.md` untuk progres terakhir dan titik pengembangan berikutnya.

## Status & arah proyek

- `PROJECT-STATUS.md` — checkpoint, progres, temuan audit, dan pekerjaan berikutnya.
- `CHANGELOG.md` — ringkasan perubahan berdasarkan tanggal.

## Arsitektur & keputusan

- `ARCHITECTURE.md` — modul, layer, alur data, dan boundary keamanan.
- `DECISIONS.md` — keputusan arsitektur dan alasan desain yang sudah disepakati.
- `UI-STRUCTURE.md` — struktur halaman, navigasi, penamaan UI, role, dan permission.
- `CODE-STYLE.md` — standar readability dan formatting.

## Security & access

- `RBAC.md` — role, permission, mapping, dan enforcement.
- `SECURITY.md` — model keamanan, RLS, Storage, SECURITY DEFINER, dan checklist audit.
- `SWIFT-API-AUDIT.md` — audit khusus Edge Function `swift-api` dan parity deployment.

## Database & content

- `DATABASE.md` — tabel inti, RPC, trigger, version history, RLS, dan migration discipline.
- `CONTENT-WORKFLOW.md` — Draft → Review → Published → Archived, editor, versioning, dan activity log.

## Operations

- `EDGE-FUNCTIONS.md` — inventory Edge Function, deployment/version, auth, dan parity source.
- `DEPLOYMENT.md` — checklist sebelum/sesudah deployment dan rollback.
- `TESTING.md` — checklist pengujian manual/E2E.
- `LEGACY.md` — inventory object/file legacy dan aturan cleanup.

## Urutan membaca

```text
README
  ↓
PROJECT-STATUS
  ↓
ARCHITECTURE
  ├── RBAC
  ├── SECURITY
  ├── DATABASE
  └── CONTENT-WORKFLOW
        ↓
EDGE-FUNCTIONS / DEPLOYMENT / TESTING
        ↓
DECISIONS / CHANGELOG / LEGACY
```

## Aturan dokumentasi

- Dokumentasi harus mencerminkan kondisi repository dan deployment yang sebenarnya.
- Jangan menandai fitur selesai sebelum implementasi diverifikasi.
- Perubahan besar pada UI, role, permission, database, keamanan, workflow, atau deployment harus diikuti pembaruan dokumentasi.
- `PROJECT-STATUS.md` adalah sumber checkpoint proyek.
- Dokumen teknis menjelaskan kondisi dan aturan implementasi, bukan sekadar rencana.
