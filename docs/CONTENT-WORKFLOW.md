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


## Pengayaan materi — 18 September 2026

Delapan materi jaringan baru telah ditambahkan untuk menutup topik yang sebelumnya belum tersedia secara memadai: Model OSI, TCP/UDP, NAT, ARP, Ethernet/switching, Wi-Fi, HTTP/HTTPS, dan troubleshooting berlapis. Semua materi berstatus `published`, memiliki deskripsi, kategori, slug unik, author, dan konten pembelajaran. Rincian katalog dicatat di `docs/MATERIAL-CATALOG.md`.


## Materi lanjutan — 18 September 2026

Delapan materi lanjutan jaringan telah ditambahkan: IPv6, VLAN dan inter-VLAN routing, routing table, DHCP relay, DNS troubleshooting, firewall/ACL, VPN/tunneling, serta monitoring/log. Seluruh materi berstatus `published` dan diverifikasi pada `public.materi` dengan konten non-kosong.


## Materi intermediate networking — 18 September 2026

Delapan materi intermediate telah ditambahkan dan diverifikasi: subnetting/VLSM, STP/RSTP, Link Aggregation/LACP, QoS, Wireshark/packet capture, OSPF, network security hardening, serta network automation API/script. Seluruh materi berstatus `published` dan memiliki konten non-kosong.
