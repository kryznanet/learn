# Katalog Materi Pembelajaran

**Tanggal:** 18 September 2026  
**Branch:** 18-Sep-2026

Dokumen ini mencatat penambahan materi pembelajaran yang dilakukan langsung pada database Supabase terhubung. Konten baru berstatus `published` dan menggunakan author sistem materi yang sudah ada.

## Materi yang ditambahkan

1. **Model OSI dan Fungsi Setiap Layer** — tujuh layer OSI dan troubleshooting berlapis.
2. **TCP dan UDP: Perbedaan dan Kapan Digunakan** — transport layer, reliabilitas, port, dan perbandingan TCP/UDP.
3. **NAT dan Port Forwarding Dasar** — private/public IP, PAT, port forwarding, dan keamanan.
4. **ARP dan Hubungan IP dengan MAC Address** — ARP request/reply, cache, dan troubleshooting.
5. **Ethernet dan Dasar Switching** — frame, MAC address table, forwarding, flooding, dan masalah switch.
6. **Wi-Fi Dasar: SSID, Band, Channel, dan Keamanan** — SSID, radio band, channel, access point, dan keamanan.
7. **HTTP dan HTTPS Dasar** — request/response, method, status code, TLS, dan batasan keamanan HTTPS.
8. **Troubleshooting Jaringan dengan Metode Berlapis** — physical, IP, gateway, routing, DNS, port, dan aplikasi.

## Cakupan materi saat ini

Katalog materi kini mencakup dasar IP/MAC, IPv4, subnetting, DHCP, DNS, VLAN, Ethernet/switching, router, NAT, ARP, Wi-Fi, TCP/UDP, HTTP/HTTPS, firewall/port, traceroute, ping, crimping kabel LAN, pengecekan IP Windows, serta troubleshooting jaringan.

## Catatan integritas data

Penambahan diverifikasi dengan query terhadap `public.materi`: seluruh delapan slug baru ditemukan dengan status `published` dan konten non-kosong. Tidak ada materi lama yang ditimpa; insert menggunakan pemeriksaan slug agar tidak membuat duplikasi.

Konten ini merupakan data aplikasi, bukan pengganti migration baseline schema. Untuk reproducibility database dari nol, baseline migration tetap mengikuti checkpoint local Supabase pada `PROJECT-STATUS.md`.


## Materi lanjutan

9. **IPv6 dan Dasar Pengalamatan** — alamat, prefix, jenis alamat, dan troubleshooting.
10. **VLAN dan Inter-VLAN Routing** — segmentasi, access/trunk, gateway, dan routing antar-VLAN.
11. **Routing dan Routing Table** — connected/static route, next-hop, dan longest prefix match.
12. **DHCP Lanjutan dan DHCP Relay** — lease, scope, reservation, dan relay antar-subnet.
13. **DNS Lanjutan dan DNS Troubleshooting** — record, resolver, cache, TTL, dan diagnosis.
14. **Firewall dan Access Control List** — rule, stateful filtering, ACL, dan least privilege.
15. **VPN dan Konsep Tunneling** — remote access, site-to-site, endpoint, route, dan troubleshooting.
16. **Monitoring Jaringan dan Analisis Log** — latency, packet loss, throughput, interface error, dan korelasi log.


## Materi intermediate networking

17. **Subnetting Lanjutan dan VLSM** — perancangan prefix berbeda dan efisiensi alamat.
18. **STP dan RSTP pada Jaringan Switching** — root bridge, port role, loop prevention, dan konvergensi.
19. **Link Aggregation dan LACP** — logical bundle, redundansi, kapasitas agregat, dan troubleshooting.
20. **QoS dan Manajemen Traffic Jaringan** — classification, marking, queueing, shaping/policing, dan metrik.
21. **Wireshark dan Analisis Packet Capture** — capture, filter, stream, latency, retransmission, dan privasi.
22. **OSPF Dasar dan Routing Dinamis** — neighbor, area, cost, topology, dan troubleshooting.
23. **Network Security Dasar dan Hardening** — least privilege, segmentasi, patching, MFA, logging, defense in depth.
24. **Network Automation Dasar dengan API dan Script** — inventory, API, idempotensi, validasi, secret management, dan rollout.


## Materi advanced networking — 18 September 2026

25. **BGP Dasar dan Konsep Autonomous System**
26. **MPLS dan Konsep Label Switching**
27. **High Availability dan Redundansi Jaringan**
28. **IDS IPS dan Network Detection**
29. **Zero Trust untuk Infrastruktur Jaringan**
30. **SD-WAN dan Software Defined Networking**
31. **Cloud Networking Dasar dan Hybrid Connectivity**
32. **Incident Response untuk Insiden Jaringan**
