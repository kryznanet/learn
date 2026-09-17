# Testing Kryzna Learn

**Tanggal:** 17 September 2026

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

## Versioning

- [ ] Snapshot dibuat saat insert/update.
- [ ] Riwayat versi tampil.
- [ ] Restore hanya role yang berwenang.
- [ ] Restore membuat snapshot baru.
- [ ] Activity log restore tercatat.

## Autosave

- [ ] Draft lokal tersimpan setelah perubahan.
- [ ] Draft dipulihkan setelah reload.
- [ ] User mendapat konfirmasi recovery.
- [ ] Draft lokal dibersihkan setelah save/review berhasil.

## Storage

- [ ] Role content dapat upload/update sesuai policy.
- [ ] Hanya Admin/Super Admin dapat delete.
- [ ] Public hanya membaca file materi published.

## Security

- [ ] Anon tidak dapat menjalankan RPC privileged.
- [ ] SECURITY DEFINER memiliki authorization yang sesuai.
- [ ] Security Advisor diperiksa setelah migration.
- [ ] Secret/service-role key tidak ada di browser/source.
