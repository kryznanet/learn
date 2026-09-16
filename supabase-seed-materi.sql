-- KRYZNA LEARN - IMPORT 8 MATERI LAMA KE SUPABASE
-- Jalankan SETELAH supabase-schema.sql dan supabase-content-migration.sql.

insert into public.materi (judul, deskripsi_singkat, link_halaman, kategori, slug, konten)
values
('Mengenal IP Address','Penjelasan lengkap mengenai pengertian, fungsi, perbedaan IPv4 & IPv6, serta cara mengecek IP perangkat Anda.','materi/mengenal-ip-address.html','Materi','mengenal-ip-address', $html$
<h2>Mengenal IP Address secara Mendalam</h2>
<p><strong>Internet Protocol Address (IP Address)</strong> adalah identitas angka unik yang dimiliki oleh setiap perangkat (komputer, HP, router) agar bisa saling berkomunikasi di dalam jaringan.</p>
<h3>Fungsi Utama IP Address</h3>
<ul><li><strong>Alamat Identifikasi Alat (Host):</strong> Mengetahui identitas spesifik suatu perangkat di jaringan.</li><li><strong>Alamat Lokasi Jaringan:</strong> Menunjukkan rute atau jalur mana yang harus dilewati data agar sampai ke perangkat tujuan.</li></ul>
<h3>Perbedaan IPv4 vs IPv6</h3>
<ul><li><strong>IPv4:</strong> Terdiri dari 32-bit angka desimal yang dipisahkan titik. Contoh: <code>192.168.1.1</code>.</li><li><strong>IPv6:</strong> Generasi baru dengan 128-bit kombinasi angka dan huruf heksadesimal. Contoh: <code>2001:db8::ff00:42:8329</code>.</li></ul>
<h3>Cara Cek IP Address di Windows</h3><ol><li>Tekan <code>Windows + R</code>, ketik <code>cmd</code>, lalu Enter.</li><li>Ketik <code>ipconfig</code>.</li><li>Cari adapter jaringan aktif dan lihat bagian <strong>IPv4 Address</strong>.</li></ol>
$html$),
('Cara Tes Koneksi (Ping)','Pelajari perintah dasar CMD untuk menganalisis kualitas jaringan internet, membaca status time out, dan delay ping.','tutorial/cara-tes-koneksi-ping.html','Tutorial','cara-tes-koneksi-ping', $html$
<h2>Panduan Lengkap Tes Koneksi (Ping)</h2>
<p><strong>PING (Packet Internet Groper)</strong> adalah perintah utilitas yang digunakan untuk mengecek integritas atau kualitas koneksi antara perangkat Anda dengan server target di internet.</p>
<h3>Cara Melakukan Ping</h3><ol><li>Buka Command Prompt (Windows) atau Terminal (Mac/Linux).</li><li>Ketik <code>ping google.com</code> atau <code>ping 8.8.8.8</code>, lalu Enter.</li><li>Sistem secara default akan mengirimkan paket data uji coba dan menunggu balasan.</li></ol>
<h3>Cara Membaca Hasil Respon Ping</h3><ul><li><strong>Reply from ...:</strong> Koneksi berjalan normal dan nilai <strong>time</strong> menunjukkan delay/latensi.</li><li><strong>Request Timed Out:</strong> Paket tidak mendapatkan balasan. Penyebabnya dapat berupa gangguan fisik, sinyal buruk, atau firewall.</li><li><strong>Destination Host Unreachable:</strong> Komputer tidak menemukan jalur menuju IP target, biasanya akibat konfigurasi jaringan atau gateway.</li></ul>
$html$),
('Urutan Kabel LAN (Crimping)','Panduan teknis langkah demi langkah menyusun warna kabel standar Straight dan Cross menggunakan tang crimping.','materi/urutan-kabel-lan-crimping.html','Materi','urutan-kabel-lan-crimping', $html$
<h2>Urutan Kabel LAN (Crimping) — Panduan Lengkap</h2>
<p>Halaman ini menjelaskan urutan warna kabel LAN (kabel UTP) untuk standar T568A dan T568B, langkah crimping, pengujian, serta troubleshooting.</p>
<h3>Tipe Kabel</h3><ul><li><strong>Cat5e:</strong> Umum untuk jaringan 1 Gbps hingga jarak 100 meter.</li><li><strong>Cat6:</strong> Mendukung 1–10 Gbps pada jarak pendek dan cocok untuk instalasi berperforma lebih tinggi.</li></ul>
<h3>T568A (pin 1 → 8)</h3><pre>1: Putih - Hijau
2: Hijau
3: Putih - Oranye
4: Biru
5: Putih - Biru
6: Oranye
7: Putih - Cokelat
8: Cokelat</pre>
<h3>T568B (pin 1 → 8)</h3><pre>1: Putih - Oranye
2: Oranye
3: Putih - Hijau
4: Biru
5: Putih - Biru
6: Hijau
7: Putih - Cokelat
8: Cokelat</pre>
<h3>Langkah Crimping</h3><ol><li>Siapkan kabel UTP, tang crimping, RJ45, cutter/stripper, dan LAN tester.</li><li>Kupas sekitar 2,5–3 cm kulit luar kabel.</li><li>Susun kabel sesuai T568A atau T568B.</li><li>Ratakan ujung kabel.</li><li>Masukkan kabel ke RJ45 dan periksa urutan.</li><li>Crimp dengan tang.</li><li>Uji menggunakan LAN tester.</li></ol>
<h3>Troubleshooting</h3><ul><li>Periksa urutan warna jika ada pin tidak terhubung.</li><li>Pastikan pasangan kabel tidak tertukar.</li><li>Untuk jarak panjang, perhatikan kualitas kabel dan perangkat jaringan.</li></ul>
$html$),
('Perbedaan Router dan Switch','Pahami perbedaan fungsi kedua alat jaringan ini dalam membagikan internet dan menghubungkan komputer lokal.','materi/perbedaan-router-dan-switch.html','Materi','perbedaan-router-dan-switch', $html$
<h2>Perbedaan Fungsi Router dan Switch</h2>
<p>Router dan Switch sama-sama digunakan dalam jaringan, tetapi memiliki fungsi utama dan lapisan kerja yang berbeda.</p>
<h3>Switch</h3><p>Switch menghubungkan banyak komputer atau perangkat dalam satu jaringan lokal (LAN) dan meneruskan data berdasarkan MAC Address. Switch umumnya bekerja pada Layer 2 model OSI.</p>
<h3>Router</h3><p>Router menghubungkan jaringan lokal ke jaringan luar atau internet menggunakan IP Address. Router bekerja pada Network Layer (Layer 3) dan meneruskan paket antarjaringan.</p>
<h3>Perbandingan</h3><table><thead><tr><th>Fitur</th><th>Switch</th><th>Router</th></tr></thead><tbody><tr><td>Fungsi</td><td>Menghubungkan perangkat dalam LAN</td><td>Menghubungkan jaringan berbeda</td></tr><tr><td>Layer OSI</td><td>Layer 2</td><td>Layer 3</td></tr><tr><td>Basis</td><td>MAC Address</td><td>IP Address</td></tr><tr><td>Internet</td><td>Tidak membagikan internet secara mandiri</td><td>Dapat mengatur dan membagikan akses internet</td></tr></tbody></table>
$html$),
('Mengenal MAC Address','Materi tentang alamat fisik permanen pada perangkat keras jaringan yang membedakannya dengan IP Address.','materi/mengenal-mac-address.html','Materi','mengenal-mac-address', $html$
<h2>Mengenal MAC Address (Alamat Fisik Perangkat)</h2>
<p><strong>Media Access Control Address (MAC Address)</strong> adalah identitas fisik unik sepanjang 48-bit yang ditanamkan pada kartu jaringan atau Network Interface Card.</p>
<h3>Perbedaan dengan IP Address</h3><ul><li><strong>IP Address:</strong> Alamat logis yang dapat berubah tergantung jaringan.</li><li><strong>MAC Address:</strong> Umumnya statis dan unik untuk perangkat serta terikat pada hardware.</li></ul>
<h3>Struktur MAC Address</h3><p>MAC Address ditulis dalam 12 digit heksadesimal, misalnya <code>00:1A:2B:3C:4D:5E</code>. Tiga blok pertama merupakan OUI yang menunjukkan vendor.</p>
<h3>Cara Cek di Windows</h3><ol><li>Buka Command Prompt.</li><li>Ketik <code>getmac</code> atau <code>ipconfig /all</code>.</li><li>Lihat bagian Physical Address.</li></ol>
<h3>Tips Keamanan</h3><ul><li>Beberapa jaringan menggunakan MAC filtering.</li><li>MAC Address dapat dipalsukan (spoofing) pada sistem operasi tertentu.</li></ul>
$html$),
('Melacak Rute Data (Traceroute)','Tutorial menggunakan perintah tracert untuk melacak jalur perjalanan paket data internet Anda ke server tujuan.','tutorial/cara-melacak-rute-data-traceroute.html','Tutorial','cara-melacak-rute-data-traceroute', $html$
<h2>Melacak Rute Perjalanan Paket Data (Traceroute)</h2>
<p><strong>Traceroute</strong> (Windows: <code>tracert</code>) membantu memetakan setiap hop atau lompatan router yang dilalui paket data.</p>
<h3>Fungsi Utama</h3><ul><li>Mengetahui jalur paket dari sumber ke tujuan.</li><li>Mendeteksi titik latensi tinggi atau kegagalan rute.</li><li>Membantu analisis masalah jaringan.</li></ul>
<h3>Cara Menjalankan</h3><ol><li>Buka Command Prompt atau Terminal.</li><li>Windows: <code>tracert google.com</code>.</li><li>Mac/Linux: <code>traceroute google.com</code>.</li></ol>
<h3>Contoh Output</h3><pre>1  192.168.1.1  1 ms  1 ms  1 ms
2  10.10.10.1   10 ms  9 ms  11 ms
3  203.0.113.5  30 ms  28 ms  31 ms</pre>
<h3>Cara Membaca</h3><ul><li>Nomor pertama adalah nomor hop.</li><li>Nilai waktu menunjukkan RTT dalam ms.</li><li>Alamat akhir menunjukkan IP atau nama host.</li><li>Tanda * menunjukkan timeout atau tidak ada balasan.</li></ul>
<h3>Troubleshooting</h3><ul><li>Lonjakan waktu dapat menunjukkan masalah pada router atau rute.</li><li>Timeout tidak selalu berarti gangguan karena router dapat memblokir atau membatasi ICMP.</li><li>Jika gateway lokal tidak merespon, periksa koneksi lokal.</li></ul>
$html$),
('Mengenal IPv4','Memahami struktur alamat IPv4, kelas jaringan (A, B, C), subnet mask, dan konsep dasar pengalamatan logika pada jaringan.','materi/mengenal-ipv4.html','Materi','mengenal-ipv4', $html$
<h2>Mengenal IPv4</h2>
<p><strong>IPv4 (Internet Protocol version 4)</strong> adalah protokol pengalamatan yang memberikan identitas bagi perangkat agar dapat terhubung dalam jaringan.</p>
<h3>Struktur IPv4</h3><p>IPv4 terdiri dari 32-bit yang dibagi menjadi 4 oktet. Setiap oktet bernilai 0 sampai 255. Contoh: <code>192.168.1.1</code>.</p>
<h3>Kelas IPv4</h3><ul><li><strong>Kelas A:</strong> untuk jaringan skala besar (0–127).</li><li><strong>Kelas B:</strong> untuk jaringan skala menengah (128–191).</li><li><strong>Kelas C:</strong> umum untuk jaringan rumah/kantor kecil (192–223).</li></ul>
$html$),
('Cara Cek IP di Windows 11','Panduan praktis mengecek alamat IP di Windows 11 melalui Settings, Command Prompt (CMD), dan PowerShell secara cepat.','tutorial/cara-cek-ip-windows11.html','Tutorial','cara-cek-ip-windows11', $html$
<h2>Cara Cek IP di Windows 11</h2>
<p>Ada beberapa cara mengecek alamat IP perangkat di Windows 11, mulai dari Command Prompt hingga Settings.</p>
<h3>1. Melalui Command Prompt</h3><ol><li>Buka Start, ketik <code>cmd</code>, lalu Enter.</li><li>Ketik <code>ipconfig</code>.</li><li>Cari <strong>IPv4 Address</strong> pada adapter Wi-Fi atau Ethernet.</li></ol>
<h3>2. Melalui Settings</h3><ol><li>Buka <strong>Settings</strong> dengan <code>Win + I</code>.</li><li>Pilih <strong>Network & internet</strong>.</li><li>Pilih koneksi Wi-Fi atau Ethernet.</li><li>Informasi IP Address akan tampil pada properti koneksi.</li></ol>
$html$)
on conflict (slug) do update set
  judul=excluded.judul,
  deskripsi_singkat=excluded.deskripsi_singkat,
  link_halaman=excluded.link_halaman,
  kategori=excluded.kategori,
  konten=excluded.konten,
  updated_at=now();
