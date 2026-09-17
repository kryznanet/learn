# Workflow Materi

**Tanggal:** 17 September 2026

## Siklus status

```text
Draft → Review → Published → Archived
  ↑                         │
  └─────────────────────────┘
```

## Makna status

- `draft`: materi sedang ditulis/disunting.
- `review`: materi menunggu proses review.
- `published`: materi tersedia untuk public.
- `archived`: materi tidak lagi tampil sebagai konten public.

## Aksi umum

- Penulis dapat membuat dan memperbarui materi sesuai permission.
- Editor dapat melakukan review, publish, archive, dan pengelolaan materi sesuai permission.
- Admin/Super Admin memiliki akses administratif yang lebih luas sesuai RBAC.
- Public hanya membaca `published`.

## Editor

`content/editor.html` menyediakan rich text editing, sanitasi output, slug otomatis, penyimpanan draft, dan pengiriman ke Review. Draft recovery lokal berada di `shared/draft-recovery.js`.

## Version history

Perubahan tersimpan sebagai snapshot di `materi_versions`. Restore menggunakan RPC backend agar authorization tidak hanya bergantung pada frontend.

## Activity log

Perubahan status dan aktivitas editor dicatat pada `content_activity_logs` dengan metadata transisi jika tersedia.
