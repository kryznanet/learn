-- KRYZNA LEARN - EXTEND MATERI UNTUK MENYIMPAN ISI LENGKAP
-- Jalankan sekali di Supabase SQL Editor.

alter table public.materi
  add column if not exists slug text,
  add column if not exists konten text not null default '';

create unique index if not exists materi_slug_unique
  on public.materi(slug)
  where slug is not null;

-- ============================================================
-- MATERI BARU
-- Materi di bawah ini hanya ditambahkan jika slug belum ada.
-- ============================================================

insert into public.materi
  (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
select
  'Subnet Mask dan Subnetting Dasar',
  'Memahami fungsi subnet mask, prefix CIDR, network address, host address, dan pembagian jaringan IPv4 secara dasar.',
  '',
  'Materi',
  'subnet-mask-dan-subnetting-dasar',
  $md$
# Subnet Mask dan Subnetting Dasar

## Apa itu subnet mask?

Subnet mask digunakan untuk menentukan bagian **network** dan bagian **host** pada sebuah alamat IPv4.

Contoh:

```text
IP Address : 192.168.1.10
Subnet Mask: 255.255.255.0
CIDR       : /24
```

Dengan `/24`, 24 bit pertama digunakan untuk network dan 8 bit sisanya digunakan untuk host.

## Network dan host

Pada jaringan `192.168.1.0/24`:

- Network address: `192.168.1.0`
- Contoh host: `192.168.1.10`
- Broadcast address: `192.168.1.255`
- Host yang dapat digunakan: `192.168.1.1` sampai `192.168.1.254`

## Mengapa subnetting digunakan?

Subnetting membantu membagi jaringan besar menjadi beberapa jaringan yang lebih kecil. Manfaatnya antara lain mengurangi domain broadcast, membuat pengelolaan alamat lebih teratur, dan memudahkan pemisahan segmen jaringan.

## Memahami CIDR

CIDR ditulis dengan tanda garis miring, misalnya `/24`, `/25`, atau `/26`. Semakin besar prefix, semakin sedikit alamat host yang tersedia dalam satu subnet.

### Catatan

Perhitungan subnet yang lebih lanjut membutuhkan pemahaman biner dan tabel ukuran subnet. Mulailah dari `/24`, kemudian lanjutkan ke `/25`, `/26`, `/27`, dan seterusnya.
$md$
where not exists (
  select 1 from public.materi where slug = 'subnet-mask-dan-subnetting-dasar'
);

insert into public.materi
  (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
select
  'DNS dan Cara Kerjanya',
  'Pelajari fungsi DNS dalam menerjemahkan nama domain menjadi alamat IP serta cara memeriksa DNS pada Windows.',
  '',
  'Materi',
  'dns-dan-cara-kerjanya',
  $md$
# DNS dan Cara Kerjanya

## Apa itu DNS?

**Domain Name System (DNS)** adalah sistem yang membantu menerjemahkan nama domain yang mudah dibaca manusia menjadi alamat IP yang digunakan komputer.

Contoh:

```text
example.com → alamat IP server
```

Tanpa DNS, pengguna harus mengingat alamat IP setiap server yang ingin diakses.

## Alur sederhana DNS

1. Pengguna memasukkan nama domain.
2. Perangkat memeriksa cache DNS lokal.
3. Jika belum ditemukan, permintaan diteruskan ke DNS resolver.
4. Resolver mencari informasi domain yang diperlukan.
5. Alamat IP dikembalikan ke perangkat.
6. Browser melanjutkan koneksi ke server tujuan.

## Cara mengecek DNS di Windows

Buka Command Prompt lalu gunakan:

```text
ipconfig /all
```

Untuk menguji resolusi nama domain, gunakan:

```text
nslookup example.com
```

## DNS dan koneksi internet

DNS tidak menggantikan koneksi internet. DNS hanya membantu menemukan alamat tujuan berdasarkan nama domain. Gangguan DNS dapat membuat sebuah situs sulit diakses meskipun koneksi internet secara umum masih aktif.
$md$
where not exists (
  select 1 from public.materi where slug = 'dns-dan-cara-kerjanya'
);

insert into public.materi
  (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
select
  'DHCP: Pemberian IP Otomatis',
  'Memahami fungsi DHCP server, proses pemberian alamat IP otomatis, dan peran lease dalam jaringan.',
  '',
  'Materi',
  'dhcp-pemberian-ip-otomatis',
  $md$
# DHCP: Pemberian IP Otomatis

## Apa itu DHCP?

**Dynamic Host Configuration Protocol (DHCP)** digunakan untuk memberikan konfigurasi jaringan secara otomatis kepada perangkat client.

Biasanya konfigurasi yang diberikan mencakup:

- IP address
- Subnet mask
- Default gateway
- DNS server

## Proses DHCP

Proses umum DHCP sering dijelaskan dengan empat tahap:

1. **Discover** — client mencari DHCP server.
2. **Offer** — server menawarkan konfigurasi.
3. **Request** — client meminta konfigurasi yang ditawarkan.
4. **Acknowledgment** — server mengonfirmasi pemberian konfigurasi.

## Lease

Alamat IP dari DHCP biasanya diberikan untuk periode tertentu yang disebut **lease**. Ketika lease mendekati masa berakhir, client dapat memperbarui penggunaannya sesuai proses DHCP.

## Melihat konfigurasi DHCP di Windows

Gunakan:

```text
ipconfig /all
```

Untuk meminta alamat baru:

```text
ipconfig /release
ipconfig /renew
```

Perintah tersebut sebaiknya digunakan saat troubleshooting dan ketika Anda memahami dampaknya terhadap koneksi yang sedang aktif.
$md$
where not exists (
  select 1 from public.materi where slug = 'dhcp-pemberian-ip-otomatis'
);

insert into public.materi
  (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
select
  'VLAN Dasar untuk Jaringan Lokal',
  'Pengenalan VLAN untuk memisahkan jaringan secara logis dalam satu infrastruktur switch.',
  '',
  'Materi',
  'vlan-dasar-jaringan-lokal',
  $md$
# VLAN Dasar untuk Jaringan Lokal

## Apa itu VLAN?

**Virtual LAN (VLAN)** adalah metode untuk membuat beberapa jaringan logis pada infrastruktur switch yang sama.

Misalnya sebuah switch digunakan oleh:

- VLAN 10 untuk Administrasi
- VLAN 20 untuk Teknisi
- VLAN 30 untuk Tamu

Walaupun perangkat dapat terhubung ke switch fisik yang sama, VLAN membantu memisahkan lalu lintas jaringan secara logis.

## Access port dan trunk

**Access port** biasanya digunakan untuk menghubungkan perangkat endpoint yang berada pada satu VLAN.

**Trunk port** digunakan untuk membawa trafik beberapa VLAN antarperangkat jaringan yang mendukung trunking.

## Manfaat VLAN

- Memisahkan jaringan berdasarkan fungsi.
- Membantu mengatur broadcast domain.
- Memudahkan pengelolaan jaringan.
- Mendukung desain jaringan yang lebih terstruktur.

## Contoh sederhana

```text
Switch
├── Port 1 → VLAN 10 → PC Administrasi
├── Port 2 → VLAN 20 → PC Teknisi
└── Port 3 → VLAN 30 → PC Tamu
```

Konfigurasi VLAN pada perangkat nyata bergantung pada merek dan model switch yang digunakan.
$md$
where not exists (
  select 1 from public.materi where slug = 'vlan-dasar-jaringan-lokal'
);

insert into public.materi
  (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
select
  'Dasar Firewall dan Port Jaringan',
  'Mengenal konsep firewall, port TCP/UDP, dan cara dasar memeriksa koneksi jaringan di Windows.',
  '',
  'Materi',
  'dasar-firewall-dan-port-jaringan',
  $md$
# Dasar Firewall dan Port Jaringan

## Apa itu firewall?

Firewall adalah mekanisme yang membantu mengontrol lalu lintas jaringan berdasarkan aturan tertentu.

Aturan dapat digunakan untuk mengizinkan atau menolak koneksi berdasarkan informasi seperti alamat IP, protokol, port, atau arah trafik.

## Apa itu port?

Port membantu sistem operasi dan aplikasi membedakan layanan jaringan yang berjalan pada sebuah alamat IP.

Contoh port yang umum ditemui:

| Port | Layanan umum |
|---:|---|
| 22 | SSH |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3389 | RDP |

Nomor port di atas adalah contoh penggunaan umum; konfigurasi aktual sebuah aplikasi dapat berbeda.

## Mengecek koneksi pada Windows

Untuk melihat koneksi dan port yang sedang digunakan, salah satu perintah yang dapat dipakai adalah:

```text
netstat -ano
```

Untuk menguji apakah suatu layanan merespons pada port tertentu, metode pengujian dapat berbeda tergantung alat yang tersedia pada sistem.

## Prinsip dasar troubleshooting

Saat sebuah layanan tidak dapat diakses, periksa secara berurutan:

1. Apakah perangkat memiliki alamat IP yang benar?
2. Apakah gateway dan DNS dapat digunakan?
3. Apakah server tujuan dapat dijangkau?
4. Apakah port layanan terbuka dan aplikasi sedang berjalan?
5. Apakah firewall di salah satu sisi memblokir koneksi?
$md$
where not exists (
  select 1 from public.materi where slug = 'dasar-firewall-dan-port-jaringan'
);

-- Dashboard dan viewer menggunakan kolom konten sebagai Markdown.
-- Materi yang sudah ada tidak diubah oleh seed di atas.
