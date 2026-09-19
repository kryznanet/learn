# Katalog Materi Pembelajaran

**Tanggal:** 19 September 2026  
**Branch:** 19-Sep-2026

Dokumen ini mencatat katalog materi pembelajaran yang terverifikasi pada database Supabase terhubung. Katalog mengikuti kategori publik yang digunakan aplikasi: **Dasar**, **Intermediate**, **Advanced**, dan **Tutorial**.

## Ringkasan katalog

| Kategori | Jumlah published |
|---|---:|
| Dasar | 22 |
| Intermediate | 20 |
| Advanced | 12 |
| Tutorial | 4 |
| **Total** | **58** |

## Materi Dasar

1. **ARP dan Hubungan IP dengan MAC Address**
2. **CIDR dan Perhitungan Subnet Dasar**
3. **Dasar Firewall dan Port Jaringan**
4. **Default Gateway dan Alur Paket**
5. **DHCP: Pemberian IP Otomatis**
6. **DNS dan Cara Kerjanya**
7. **Ethernet dan Dasar Switching**
8. **HTTP dan HTTPS Dasar**
9. **IP Address dan Subnet Mask Dasar**
10. **JARINGAN-DASAR-X-2**
11. **Mengenal IP Address**
12. **Mengenal IPv4**
13. **Mengenal MAC Address**
14. **Model OSI dan Fungsi Setiap Layer**
15. **NAT dan Port Forwarding Dasar**
16. **Perbedaan Router dan Switch**
17. **Private IP dan Public IP**
18. **Subnet Mask dan Subnetting Dasar**
19. **TCP dan UDP: Perbedaan dan Kapan Digunakan**
20. **Urutan Kabel LAN (Crimping)**
21. **VLAN Dasar untuk Jaringan Lokal**
22. **Wi-Fi Dasar: SSID, Band, Channel, dan Keamanan**

## Materi Intermediate

1. **DHCP Lanjutan dan DHCP Relay**
2. **DNS Lanjutan dan DNS Troubleshooting**
3. **DNS Record A AAAA CNAME MX dan TXT**
4. **Firewall dan Access Control List**
5. **IPv6 dan Dasar Pengalamatan**
6. **Link Aggregation dan LACP**
7. **Monitoring Jaringan dan Analisis Log**
8. **Network Automation Dasar dengan API dan Script**
9. **Network Security Dasar dan Hardening**
10. **OSPF Dasar dan Routing Dinamis**
11. **Port Socket dan Layanan Jaringan**
12. **Proxy dan Reverse Proxy**
13. **QoS dan Manajemen Traffic Jaringan**
14. **Routing dan Routing Table**
15. **Static Routing dan Routing Table**
16. **STP dan RSTP pada Jaringan Switching**
17. **Subnetting Lanjutan dan VLSM**
18. **VLAN dan Inter-VLAN Routing**
19. **VPN dan Konsep Tunneling**
20. **Wireshark dan Analisis Packet Capture**

## Materi Advanced

1. **BGP Dasar dan Konsep Autonomous System**
2. **Cloud Networking Dasar dan Hybrid Connectivity**
3. **High Availability dan Redundansi Jaringan**
4. **IDS IPS dan Network Detection**
5. **Incident Response untuk Insiden Jaringan**
6. **MPLS dan Konsep Label Switching**
7. **OSPF Multi-Area dan Area Design**
8. **PKI TLS dan Sertifikat Digital**
9. **SD-WAN dan Software Defined Networking**
10. **SIEM dan Centralized Network Logging**
11. **VRRP HSRP dan Gateway Redundancy**
12. **Zero Trust untuk Infrastruktur Jaringan**

## Tutorial

1. **Cara Cek IP di Windows 11**
2. **Cara Tes Koneksi (Ping)**
3. **Melacak Rute Data (Traceroute)**
4. **Troubleshooting Jaringan dengan Metode Berlapis**

## Catatan integritas data

- Daftar di atas disusun berdasarkan query read-only terhadap `public.materi` dengan filter `status = 'published'`, lalu dikelompokkan berdasarkan nilai `kategori`.
- Verifikasi live pada 19 September 2026 menghasilkan **58 materi published**: Dasar 22, Intermediate 20, Advanced 12, dan Tutorial 4.
- Dua materi placeholder **Test** dan **Test 12** tidak masuk katalog karena telah diverifikasi berstatus `archived`.
- Katalog ini tidak mengubah data aplikasi. Perubahan pada dokumen hanya menyelaraskan dokumentasi repository dengan keadaan database yang terverifikasi.
- Konten materi tetap menjadi data aplikasi di Supabase dan bukan pengganti migration baseline schema.

## Catatan kualitas materi

Seluruh 58 materi published telah diverifikasi memiliki konten non-kosong dan struktur pembelajaran yang mencakup tujuan, troubleshooting, latihan, dan checklist. Review browser/rendering serta review pedagogis akhir tetap berstatus **Needs Verification** sampai verifikasi runtime dan pemeriksaan akhir dilakukan.
