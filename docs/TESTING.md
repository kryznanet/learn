# Testing Kryzna Learn

**Tanggal:** 18 September 2026

## Authentication

- [ ] Login valid.
- [ ] Login invalid.
- [ ] Session persistence.
- [ ] Logout.
- [ ] Routing per role.
- [ ] Inactive staff ditolak.

## RBAC

- [ ] Viewer hanya membaca konten.
- [ ] Penulis dapat create/update sesuai ownership.
- [ ] Editor dapat review/publish/archive.
- [ ] Admin mendapat akses administratif sesuai matrix.
- [ ] Super Admin dapat role management.
- [ ] Permission UI tidak menggantikan RLS/RPC.

## Content

- [ ] Create draft.
- [ ] Edit draft.
- [ ] Submit review.
- [ ] Publish.
- [ ] Archive.
- [ ] Search/filter.
- [ ] Slug otomatis.
- [ ] Public hanya melihat published.
- [ ] Regression: authenticated content role dapat UPDATE materi ke `review` menggunakan editor yang memakai `UPDATE ... SELECT`.

## Versioning

- [ ] Snapshot dibuat saat insert/update.
- [ ] Riwayat versi tampil.
- [ ] Restore hanya role yang berwenang.
- [ ] Restore membuat snapshot baru.
- [ ] Activity log restore tercatat.

## Autosave

Implementasi sudah diintegrasikan ke `content/editor.html` melalui `shared/draft-recovery.js`. Inisialisasi dilakukan setelah session dan materi selesai dimuat agar draft memakai key user + material yang benar.

- [ ] Browser E2E: draft lokal tersimpan setelah perubahan.
- [ ] Browser E2E: draft dipulihkan setelah reload.
- [ ] Browser E2E: user mendapat konfirmasi recovery.
- [ ] Browser E2E: draft lokal dibersihkan setelah save/review berhasil.
- [ ] Browser E2E: recovery untuk materi baru tidak tertukar dengan recovery materi existing.

## Storage

- [ ] Role content dapat upload/update sesuai policy.
- [ ] Hanya Admin/Super Admin dapat delete.
- [ ] Public hanya membaca file materi published.

## Security

- [ ] Anon tidak dapat menjalankan RPC privileged.
- [ ] SECURITY DEFINER memiliki authorization yang sesuai.
- [ ] Security Advisor diperiksa setelah migration.
- [ ] Secret/service-role key tidak ada di browser/source.
