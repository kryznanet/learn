# 📐 Aturan Penulisan Kode — Kryzna Learn

**Branch acuan:** branch pengembangan yang telah diverifikasi pada checkpoint aktif  
**Tujuan:** membuat kode mudah dibaca, ditinjau, diuji, dan diperbaiki tanpa mengubah perilaku aplikasi secara tidak sengaja.

---

## 1. Prinsip utama

1. **Readability first** — kode harus mudah dipahami manusia sebelum dioptimalkan untuk singkat.
2. **Satu baris, satu gagasan** — hindari baris kode yang terlalu panjang atau memuat terlalu banyak operasi.
3. **Perubahan kecil dan terisolasi** — saat memperbaiki bug, ubah bagian yang diperlukan saja.
4. **Jangan mengorbankan keamanan demi kemudahan frontend.** RLS/RPC tetap menjadi enforcement backend.
5. **Jangan menghapus perilaku yang sudah ada** tanpa alasan yang terdokumentasi.
6. **Kode harus dapat ditinjau** — reviewer harus bisa menemukan fungsi, permission, query, dan event dengan cepat.

---

## 2. Format umum JavaScript

Gunakan indentasi **2 spasi**.

```js
async function loadMateri() {
  const { data, error } = await db
    .from('materi')
    .select('id,judul,status')
    .eq('status', 'published');

  if (error) {
    console.error('Gagal memuat materi:', error);
    return;
  }

  renderMateri(data || []);
}
```

### Hindari

```js
async function loadMateri(){const {data,error}=await db.from('materi').select('id,judul,status').eq('status','published');if(error){console.error(error);return;}renderMateri(data||[])}
```

Aturan:
- Gunakan spasi di sekitar operator.
- Gunakan baris baru untuk chain query yang panjang.
- Gunakan `{}` untuk blok fungsi, kondisi, dan loop.
- Pisahkan fungsi dengan satu baris kosong.
- Gunakan nama variabel yang menjelaskan isi, bukan nama satu huruf kecuali untuk fungsi kecil yang sangat jelas.

---

## 3. Panjang baris

Target umum: **maksimal sekitar 100 karakter per baris**.

Jika baris menjadi panjang karena URL, selector, string SQL, atau data tertentu, pecah struktur kode di sekitarnya jika memungkinkan. Jangan memaksakan pemotongan string yang mengubah nilainya.

### Contoh

```js
const canEdit = KryznaAuth.hasPermission(
  'content.update',
  session?.permissions
);
```

Bukan:

```js
const canEdit = KryznaAuth.hasPermission('content.update', session?.permissions);
```

---

## 4. HTML

Gunakan struktur HTML bertingkat dan mudah dipindai.

```html
<section class="card">
  <h2>Daftar Materi</h2>
  <p class="muted">
    Kelola materi pembelajaran.
  </p>
</section>
```

Aturan:
- Jangan menaruh seluruh dokumen HTML dalam satu baris.
- Satu elemen utama per baris.
- Atribut yang banyak boleh dipisah ke beberapa baris.
- Gunakan `id` dan `class` yang deskriptif.
- Pertahankan urutan script yang dibutuhkan aplikasi.

---

## 5. CSS

Gunakan satu property per baris.

```css
.card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}
```

Aturan:
- Kelompokkan variable di `:root`.
- Gunakan custom property untuk nilai UI yang dipakai berulang.
- Media query ditempatkan setelah aturan utama komponen yang terkait.
- Hindari inline style jika style tersebut digunakan berulang.

---

## 6. JavaScript di dalam HTML

Untuk halaman sederhana, inline `<script>` masih diperbolehkan. Namun kode harus tetap diformat seperti file JavaScript biasa.

Jika logic mulai panjang atau digunakan lebih dari satu halaman, pindahkan ke `shared/` atau file JavaScript khusus.

Contoh struktur:

```text
shared/
├── auth.js
├── content-activity.js
└── draft-recovery.js
```

Jangan membuat helper yang sama dengan nama berbeda di banyak halaman.

---

## 7. Supabase query

Gunakan chain query bertingkat untuk query yang panjang.

```js
const { data, error } = await db
  .from('materi')
  .select('id,judul,kategori,status')
  .eq('status', 'published')
  .order('updated_at', { ascending: false });
```

Untuk halaman publik, filter keamanan yang relevan harus terlihat jelas di query bila memungkinkan, misalnya:

```js
.eq('status', 'published')
```

Tetapi filter frontend **bukan pengganti RLS**.

---

## 8. Auth dan permission

Gunakan `shared/auth.js` sebagai sumber helper frontend.

```js
const session = await KryznaAuth.requirePermission(
  'content.update',
  {
    login: '../admin/login.html',
    denied: null
  }
);
```

Jangan membuat mapping role baru di setiap halaman jika permission terpusat sudah tersedia.

Frontend permission digunakan untuk:
- guard halaman,
- menampilkan/menyembunyikan tombol,
- UX.

Backend tetap harus memvalidasi melalui RLS atau RPC.

---

## 9. RLS dan SECURITY DEFINER

Setiap perubahan Supabase harus:

1. Menggunakan migration untuk DDL.
2. Memiliki policy yang sesuai dengan model akses.
3. Memeriksa `USING` dan `WITH CHECK` untuk UPDATE.
4. Membatasi `EXECUTE` RPC secara eksplisit.
5. Memeriksa `search_path` pada `SECURITY DEFINER`.
6. Tidak menggunakan service-role/secret key di frontend.
7. Diverifikasi dengan query setelah migration.

Jangan menyelesaikan masalah permission dengan menambahkan `SECURITY DEFINER` tanpa analisis akses.

---

## 10. Logging

Gunakan pemisahan:

- `content_activity_logs` → aktivitas materi.
- `system_activity_logs` → aktivitas sistem/administrasi.

Actor harus dicatat menggunakan `auth.uid()` melalui mekanisme backend atau helper yang sesuai.

Metadata harus menggunakan struktur yang konsisten.

Contoh:

```js
metadata: {
  from,
  to: status
}
```

---

## 11. Penamaan

### JavaScript

Gunakan `camelCase`:

```js
loadMateri();
changeStatus();
getPermissions();
```

### Konstanta

Gunakan `UPPER_SNAKE_CASE` untuk konstanta global yang benar-benar konstan:

```js
const CONTENT_ROLES = [
  'penulis',
  'editor',
  'admin',
  'super_admin'
];
```

### Database

Ikuti nama tabel/kolom yang sudah menjadi standar proyek. Jangan mengganti nama schema hanya untuk mengikuti style frontend.

### UI

Gunakan Bahasa Indonesia yang konsisten:
- Daftar Materi
- Tulis / Edit Materi
- Riwayat Versi
- Riwayat Aktivitas Materi
- Kelola Pengguna
- Riwayat Aktivitas Sistem

---

## 12. Error handling

Jangan mengabaikan error Supabase.

```js
const { data, error } = await db
  .from('materi')
  .select('id,judul');

if (error) {
  console.error('Gagal memuat materi:', error);
  return;
}
```

Pesan untuk pengguna boleh dibuat lebih sederhana, tetapi detail error tetap dicatat di console ketika relevan.

---

## 13. HTML escaping dan sanitasi

Data dari database atau input pengguna harus di-escape ketika dimasukkan ke HTML melalui string template.

Untuk konten yang memang diperbolehkan berupa HTML, gunakan sanitizer sebelum memasukkannya ke DOM.

Jangan menggunakan `innerHTML` untuk data mentah pengguna tanpa sanitasi.

---

## 14. Git dan perubahan file

Sebelum mengedit file:

1. Fetch file terbaru dari branch.
2. Gunakan SHA terbaru.
3. Ubah bagian yang diperlukan.
4. Commit dengan pesan yang jelas.
5. Fetch ulang file setelah commit.
6. Verifikasi bahwa perubahan benar-benar tersimpan.

Contoh pesan commit:

```text
fix: perbaiki filter materi published
style: rapikan format editor
security: batasi akses file materi
feat: tambah riwayat versi
```

Jangan mengklaim perubahan selesai sebelum verifikasi berhasil.

---

## 15. Dokumentasi

Setiap perubahan signifikan harus diperbarui di `docs/`.

Dokumen utama:

```text
docs/
├── README.md
├── PROJECT-STATUS.md
├── UI-STRUCTURE.md
└── CODE-STYLE.md
```

`CODE-STYLE.md` menjelaskan **cara menulis kode**.  
`PROJECT-STATUS.md` menjelaskan **status pekerjaan**.  
`UI-STRUCTURE.md` menjelaskan **struktur UI**.

---

## 16. Aturan refactor

Refactor format tidak boleh sekaligus mengubah perilaku kecuali memang diminta.

Saat merapikan kode:
- jangan mengganti nama database tanpa kebutuhan,
- jangan mengubah permission,
- jangan mengubah URL,
- jangan mengubah query keamanan,
- jangan menghapus fitur yang tidak terkait,
- jangan menggabungkan beberapa perubahan besar dalam satu refactor format.

Jika refactor menemukan bug, catat bug tersebut dan perbaiki dalam perubahan terpisah bila memungkinkan.

---

## 17. Checklist review sebelum commit

### Readability
- [ ] Tidak ada file HTML/JS/CSS yang sengaja dipadatkan menjadi satu baris.
- [ ] Indentasi konsisten 2 spasi.
- [ ] Fungsi mudah ditemukan.
- [ ] Query panjang dipisah per chain.
- [ ] Nama variabel cukup jelas.

### Security
- [ ] Tidak ada service-role/secret key di frontend.
- [ ] Public query memakai filter yang sesuai.
- [ ] RLS tetap menjadi enforcement backend.
- [ ] RPC sensitif memiliki kontrol akses.
- [ ] `SECURITY DEFINER` memiliki `search_path` yang aman.

### Maintainability
- [ ] Helper umum berada di `shared/`.
- [ ] Tidak ada duplikasi logic tanpa alasan.
- [ ] Error ditangani.
- [ ] Perubahan tidak menghapus perilaku lama secara tidak sengaja.
- [ ] Dokumentasi diperbarui jika perubahan signifikan.

### Git
- [ ] Fetch sebelum edit.
- [ ] SHA terbaru digunakan.
- [ ] Commit message jelas.
- [ ] Fetch ulang setelah commit.
- [ ] Hasil perubahan diverifikasi.
