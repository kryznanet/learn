# Architecture Decisions Kryzna Learn

## ADR-001 — Pisahkan Kelola Materi dan Administrasi

**Tanggal:** 17 September 2026

Kelola Materi fokus pada lifecycle konten. Administrasi fokus pada user, system log, import, dan pengaturan. Pemisahan menjaga boundary fitur dan permission lebih jelas.

## ADR-002 — Gunakan central permission mapping

Role tidak dipetakan hanya di frontend. `roles`, `permissions`, `user_roles`, dan `role_permissions` menjadi sumber RBAC database; frontend membaca permission melalui RPC.

## ADR-003 — Public hanya published

Materi `draft`, `review`, dan `archived` tidak menjadi konten public. Boundary ini ditegakkan di query frontend dan RLS.

## ADR-004 — Pertahankan `viewer`

`viewer` dipertahankan untuk kompatibilitas akun lama. Permission-nya dibatasi pada `content.read`.

## ADR-005 — Role Editor terpisah dari Penulis

Editor memiliki permission review/publish/archive yang lebih luas. Dukungan Editor harus konsisten antara DB, frontend, dan Edge Function.

## ADR-006 — Perubahan role tetap Super Admin

Admin dapat melakukan user management non-role sesuai permission, tetapi perubahan role memerlukan Super Admin untuk mengurangi risiko privilege escalation.

## ADR-007 — Pisahkan content log dan system log

Aktivitas materi dan aktivitas administratif memiliki konteks audit berbeda sehingga disimpan pada tabel terpisah.

## ADR-008 — Autosave lokal

Editor menggunakan localStorage untuk draft recovery sementara agar kehilangan input akibat reload/navigation dapat dipulihkan tanpa membuat setiap perubahan menjadi row database baru.

## ADR-009 — Jangan hapus `swift-api` tanpa consumer check

`swift-api` aktif tetapi tidak terlacak di source branch. Deployment tidak dihapus sampai consumer eksternal dipastikan tidak ada.
