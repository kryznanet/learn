## Shared visual refinement — 20 September 2026

- Shared `shared/ui.css` menjadi lapisan visual biru yang lebih konsisten untuk Light dan Dark mode.
- Token utama mencakup background, surface, surface-soft, border, text, muted text, primary, primary-strong, shadow, dan focus ring.
- Komponen shared dan legacy yang terkena harmonisasi: header, navigation, submenu, card, statistic, toolbar/filter, form control, table, empty/loading/error/success state, sticky action, dan footer.
- Dark mode tidak hanya mengubah background halaman, tetapi juga surface, border, input, table, button, submenu, legacy card, dan status state.
- Pada mobile, brand subtitle disembunyikan agar header tetap ringkas; menu utama tetap menggunakan panel vertikal dan submenu bertingkat.
- Perubahan hanya pada presentasi UI dan tidak mengubah routing, auth, permission, RBAC, database, RLS, RPC, atau business logic.
- Status: **Implemented — Needs Browser Verification**.
- Source commit: `d4a8ec6ab0f81b0dadd727691f8842a56ef62f54`.

## 🔧 Shared navigation duplicate-load fix — 20 September 2026

- Branch: `20-Sep-2026`.
- `shared/ui.js` sekarang memiliki initialization guard `window.__kryznaUiBooted` agar shared navigation hanya di-boot sekali ketika script ter-load lebih dari satu kali melalui kombinasi `shared/auth.js` dan halaman.
- Perubahan mencegah dua shell navigasi muncul bersamaan di bagian atas halaman.
- Tidak ada perubahan routing, auth, permission, RBAC, database, atau RLS.
- Source commit: `f2023bae9af59c5562dfd740093e10490aa1eae6`.
- Status: **Source Verified — Needs Browser Verification**.

# Struktur UI Kryzna Learn

**Tanggal pembaruan:** 19 September 2026  
**Branch:** `19-Sep-2026`

Dokumen ini menjadi acuan penamaan, struktur navigasi, dan pembagian area aplikasi Kryzna Learn. Istilah teknis database/API boleh tetap menggunakan nama internal yang sudah berjalan; istilah yang dilihat pengguna menggunakan bahasa Indonesia yang konsisten.

## 1. Struktur Utama

```text
Kryzna Learn
│
├── 🌐 Website Publik
│   ├── Beranda
│   └── Materi
│       └── Detail Materi
│
├── 📚 Kelola Materi
│   ├── Daftar Materi
│   ├── Tulis / Edit Materi
│   ├── Riwayat Versi
│   └── Riwayat Aktivitas Materi
│
└── 🛡️ Administrasi
    ├── Dashboard
    ├── Kelola Pengguna
    ├── Riwayat Aktivitas Sistem
    ├── Import Materi
    └── Pengaturan
```

### Prinsip pembagian

- **Website Publik**: area untuk membaca materi yang sudah dipublikasikan.
- **Kelola Materi**: workspace untuk membuat, mengedit, meninjau, menerbitkan, mengarsipkan, dan melihat riwayat materi.
- **Administrasi**: area untuk fungsi administratif dan kontrol sistem.
- Menu dan aksi mengikuti permission aktif pengguna.
- Validasi akses tetap dilakukan ketika halaman dibuka; frontend bukan satu-satunya lapisan keamanan.

## 2. Website Publik

### Beranda
Halaman utama Kryzna Learn untuk pengunjung.

Fungsi utama:
- menampilkan materi berstatus `published`,
- pencarian materi,
- filter kategori,
- navigasi menuju detail materi.

### Materi
Daftar materi publik.

### Detail Materi
Halaman untuk membaca satu materi secara lengkap. Konten publik mengikuti aturan visibility `published`.

## 3. Kelola Materi

### Daftar Materi
Fungsi:
- mencari materi,
- filter status,
- filter kategori,
- membuka editor sesuai `content.update`,
- membuka Riwayat Versi sesuai `content.read`,
- mengubah status sesuai permission workflow.

Workflow konten:

```text
Draft → Review → Published → Archived
  ↑                         │
  └─────────────────────────┘
```

Aksi workflow sekarang memeriksa permission seperti `content.review`, `content.publish`, `content.archive`, dan `content.update`. RLS tetap menjadi enforcement final.

### Tulis / Edit Materi
Editor materi untuk membuat atau mengubah konten.

Fungsi:
- rich text formatting,
- heading,
- ukuran teks,
- bold/italic/underline,
- list,
- alignment,
- preview,
- slug otomatis,
- Simpan Draft,
- Kirim ke Review,
- Riwayat Versi,
- **Autosave lokal & Draft Recovery**.

Permission:
- materi baru → `content.create`,
- edit materi → `content.update`,
- Kirim ke Review → `content.review`.

Autosave lokal menyimpan draft sementara di perangkat dan tidak membuat version snapshot baru di database pada setiap ketikan.

### Riwayat Versi
Menampilkan versi-versi sebelumnya dari satu materi.

Fungsi:
- melihat versi dengan `content.read`,
- meninjau isi versi,
- memulihkan versi dengan `content.update` pada frontend dan RPC terproteksi di backend.

Restore saat ini tersedia untuk role Editor, Admin, dan Super Admin pada backend. Setiap restore memperbarui materi, menghasilkan snapshot melalui trigger, dan mencatat aktivitas `version_restored`.

### Riwayat Aktivitas Materi
Log khusus untuk aktivitas yang berkaitan dengan materi, misalnya:
- membuat materi,
- mengubah materi,
- mengirim review,
- mengubah status,
- publish/archive,
- restore versi.

Data internal menggunakan `content_activity_logs`. Akses halaman menggunakan permission `content.view_logs`.

## 4. Administrasi

### Dashboard
Dashboard administratif sesuai role.

- **Dashboard Admin**: fokus pada operasional dan pengelolaan materi.
- **Dashboard Super Admin**: kontrol pengguna, role, aktivitas sistem, dan akses seluruh materi.

### Kelola Pengguna
Fungsi untuk mengelola akun staf dan aksesnya.

Role:
- `Penulis`
- `Editor`
- `Admin`
- `Super Admin`
- `Viewer` untuk kompatibilitas akun lama.

Permission terkait:
- melihat pengguna → `users.read`,
- mengubah display name → `users.update`,
- mengubah role → `roles.manage`,
- aktif/nonaktif → `users.disable`.

Perubahan role/status dilakukan melalui RPC backend yang memvalidasi hak akses dan menyinkronkan `admin_users` dengan `user_roles`.

### Riwayat Aktivitas Sistem
Log administratif/sistem yang terpisah dari aktivitas materi.

Contoh:
- perubahan data pengguna,
- perubahan role,
- aktivasi/nonaktifkan akun,
- tindakan administratif lainnya.

Data internal menggunakan `system_activity_logs`. Akses halaman menggunakan `system.view_logs`.

### Import Materi
Halaman untuk memasukkan materi dari file yang didukung, terutama DOCX/PDF. Akses menggunakan `content.import`.

### Pengaturan
Tempat untuk konfigurasi sistem yang akan ditambahkan bertahap.

## 5. Role dan Hak Akses

### Penulis
Membuat dan mengelola materi sesuai permission serta mengirim materi untuk review bila memiliki `content.review`.

### Editor
Meninjau dan memproses materi sesuai permission, termasuk restore versi sesuai aturan backend saat ini.

### Admin
Mengelola operasional materi dan fungsi administratif yang diberikan.

### Super Admin
Mengelola pengguna/role, aktivitas sistem, dan kontrol administratif tingkat sistem.

### Viewer
Akses lihat terbatas untuk kompatibilitas akun lama.

## 6. RBAC dan Permission

Permission yang telah didefinisikan di Supabase mencakup:

```text
content.read
content.create
content.update
content.delete
content.import
content.review
content.publish
content.archive
content.manage_categories
content.view_logs
users.read
users.create
users.update
users.disable
roles.manage
system.view_logs
settings.manage
```

### Status implementasi

- `KryznaAuth` menjadi helper role dan permission terpusat.
- Mapping role → permission tersedia melalui `role_permissions`.
- `get_my_permissions()` mengambil permission aktif berdasarkan `auth.uid()`.
- Halaman utama Content/Admin sudah mulai menggunakan `requirePermission(...)` dan `hasPermission(...)`.
- Permission final tetap harus ditegakkan oleh backend/database/RLS.

## 7. Standar Penamaan UI

| Jangan gunakan sebagai label utama | Gunakan |
|---|---|
| Content Workspace | Kelola Materi |
| Materials | Daftar Materi |
| Editor Materi | Tulis / Edit Materi |
| Content Activity Log | Riwayat Aktivitas Materi |
| System Activity Log | Riwayat Aktivitas Sistem |
| Manage Users / Kelola User | Kelola Pengguna |
| Import | Import Materi |
| Version History | Riwayat Versi |
| Restore | Pulihkan Versi |

Nama internal database, RPC, JavaScript API, dan endpoint tidak perlu diubah hanya demi mengikuti label UI.

## 8. Aturan Navigasi

- `Kelola Materi` menjadi pusat navigasi fitur content.
- `Administrasi` menjadi pusat navigasi fungsi sistem.
- `Riwayat Versi` dibuka berdasarkan `materi.id`.
- `Tulis / Edit Materi` dibuka berdasarkan `materi.id` saat mengedit.
- Link/menu dan tombol aksi yang dapat ditentukan di frontend disaring berdasarkan permission.
- Validasi akses tetap dilakukan ketika halaman dibuka.

## 9. Status Implementasi

| Area | Status |
|---|---|
| Website Publik | Aktif, masih perlu audit visibility `published` end-to-end |
| Kelola Materi | Aktif + central permission terintegrasi |
| Daftar Materi | Aktif + permission workflow |
| Tulis / Edit Materi | Aktif + `content.create/update/review` |
| Riwayat Versi | Aktif + `content.read/update`; restore browser E2E masih perlu diuji |
| Riwayat Aktivitas Materi | Aktif + `content.view_logs` |
| Dashboard Admin | Aktif |
| Dashboard Super Admin | Aktif |
| Kelola Pengguna | Aktif + `users.*` / `roles.manage` |
| Riwayat Aktivitas Sistem | Aktif + `system.view_logs` |
| Import Materi | Aktif + `content.import` |
| Pengaturan | Placeholder / tahap berikutnya |
| Central Role Helper | Aktif |
| Central Permission Helper | Aktif |
| Autosave + Draft Recovery | Aktif tahap awal; perlu pengujian recovery lintas skenario |

## 10. Acuan Pengembangan Berikutnya

1. Uji browser untuk Version Restore.
2. Uji Autosave & Draft Recovery.
3. Audit Activity Log dan Kelola Pengguna.
4. Pastikan Website Publik hanya menampilkan `published`.
5. Audit navigasi, workflow, dan keamanan Supabase/RLS.

Dokumen ini harus diperbarui apabila struktur menu, role, permission, atau status implementasi berubah secara signifikan.
\n\n## Kelola Konten, Kategori, dan Dashboard — 19 September 2026\n\n- Dashboard Admin sekarang menampilkan **Kelola Konten / Materi** dan akses **Kategori Materi**.\n- Workspace Kelola Materi memiliki halaman **Kategori Materi** untuk menambah kategori baru.\n- Editor materi mengambil kategori aktif dari `materi_categories`, sehingga pilihan tidak lagi hard-coded pada `Materi/Tutorial`.\n- Dashboard Super Admin sekarang menyediakan akses **Kelola Konten / Materi** dan halaman **Pengaturan**.\n- `admin/settings.html` menjadi titik awal pengaturan administratif; pengelolaan kategori tetap menggunakan permission `content.manage_categories`.\n\n## 4. UI/UX modernisasi — 19 September 2026\n\n- Ditambahkan shell navigasi bersama melalui `shared/ui.js` dan `shared/ui.css`.\n- Navigasi otomatis dipasang pada halaman yang memuat `shared/auth.js`, sehingga website, learner, Kelola Materi, dan panel admin menggunakan pola navigasi yang konsisten.\n- Menu aktif diberi highlight berdasarkan halaman saat ini.\n- Desktop menggunakan navigasi horizontal yang ringkas; mobile menggunakan wrapping/scroll horizontal agar perpindahan menu tetap nyaman.\n- Login tidak diberi shell navigasi agar fokus pada autentikasi.\n- Tampilan umum menggunakan spacing, radius, border, shadow, tombol, input, tabel, dan warna yang konsisten tanpa mengubah logic auth/RBAC.\n- Komponen legacy yang masih memiliki CSS lokal diharmonisasi melalui override bersama sehingga refactor tidak perlu menghapus CSS halaman satu per satu.\n- Halaman yang tidak memuat auth helper (website utama, daftar Ujian publik, dan beberapa halaman riwayat) memuat shared navigation secara langsung.\n- Jalur utama learner: Beranda, Materi, Ujian, Riwayat, Bookmark, Notifikasi, Profil.\n- Jalur utama admin/content: Dashboard, Materi, Editor, Kategori, Ujian, Pengguna, Pengaturan.\n- Backend security, RLS, permission, dan authorization tetap menjadi sumber enforcement; navigasi hanya lapisan UX.\n\n### Status\n\n- Source UI/UX shared navigation: **Implemented — Needs Browser Verification**.\n- Browser E2E belum dijalankan pada checkpoint ini agar seluruh refactor UI/UX dapat diselesaikan terlebih dahulu.\n

## UI polish checkpoint — 19 September 2026

- Shared visual system diperluas untuk toolbar/filter, status badge, empty state, statistik, form grid, sticky action bar, dan responsive mobile layout.
- Legacy `.card`, `.btn`, `.filters`, `.actions`, form control, dan empty state mendapat harmonisasi tambahan melalui shared/ui.css sehingga dashboard admin, workspace materi, editor, ujian, pengguna, learner, hasil, dan profil lebih konsisten tanpa mengubah business logic.
- Active navigation diperbaiki menjadi route-aware berdasarkan pathname penuh, sehingga halaman dengan nama file sama di folder berbeda tidak lagi salah menandai menu aktif.
- Commit source: `6c0a77725286a6587b11a3b79e37f138852730c7` dan `2ca4c56b03b1fa72368b76e69e11860819e66f7e`.
- Browser E2E belum dijalankan pada checkpoint ini; menunggu seluruh polish UI selesai.


## UI page-by-page polish — 19 September 2026

- Dashboard Admin: hierarchy statistik, feature cards, dan responsive operational stats dirapikan.
- Kelola Materi: toolbar/filter, card list, status badge, action buttons, dan mobile layout dirapikan.
- Editor Materi: shell, form, toolbar editor, card, action area, dan responsive layout dirapikan.
- Kelola Ujian: workspace dua kolom, form, card ujian/soal, action buttons, dan mobile layout dirapikan.
- Kelola Pengguna: form/list hierarchy, card, status, dan mobile controls dirapikan.
- Learner: dashboard diberi hierarchy card dan responsive layout yang lebih konsisten.
- Materi Detail: reading area, document box, engagement controls, typography, table overflow, dan mobile layout dirapikan.
- Hasil Ujian: hierarchy score/result dan pilihan jawaban dibuat lebih mudah dipindai di mobile.
- Sertifikat: layout cetak dan nama/kode panjang dibuat lebih aman pada layar kecil.
- Source commits: `65f934b029d1110dfe346fa6e8321f0cd056c76c`, `2d458b147a3133eb7d32c352463d86b3b1d378d2`, `7f5a31ceb95efc0c8d6da319a8194df243932224`, `37700f05eb88925d55fa2fbf9fe856d17a228be`, `7163d42ca5951020ec0f89f822faafb09eda8c1a`, `779f79055aa7f3d33636101396a95de4ef1122fa`, `b0f301c78dcd1a41e3cd0c2001ab2c934516a3fa`, `ef040ffdb9e9c46d6afb7561a6812711fd7430a2`, `50577387cd7ba13cc13beca3cc3cce38d053685a`.
- Mobile source polish: Implemented — Needs Browser Verification.


## Design System Kryzna Learn — 19 September 2026

Shared UI kini menjadi acuan visual utama melalui `shared/ui.css` dan `shared/ui.js`.

### Token visual
- Background: `--kx-bg`
- Surface: `--kx-surface` / `--kx-surface-soft`
- Border: `--kx-line` / `--kx-line-strong`
- Text: `--kx-text` / `--kx-muted`
- Primary: `--kx-primary` / `--kx-primary-strong`
- Semantic status: success, warning, danger, info
- Radius: small, standard, large
- Shadow: `--kx-shadow`
- Focus ring: `--kx-focus`

### Komponen bersama
- Navigation shell dan active state
- Page header / breadcrumb / back link
- Button dan action group
- Card dan section
- Toolbar/filter
- Form field dan form grid
- Status badge
- Statistic card/grid
- Empty/loading/error/success state
- Sticky action bar
- Responsive table wrapper

### Aturan responsive
- Desktop: workspace lebar dengan hierarchy dan action group yang jelas.
- Tablet: grid turun menjadi dua kolom bila sesuai.
- Mobile: form menjadi satu kolom, toolbar dapat membungkus, tombol action memiliki area sentuh minimum, dan tabel memakai horizontal scroll terkontrol.
- Animasi dihormati dengan `prefers-reduced-motion`.
- Focus keyboard menggunakan focus ring yang konsisten.

### Prinsip
Page-specific CSS hanya digunakan untuk kebutuhan yang benar-benar khas halaman. Komponen yang berulang harus menggunakan design system agar halaman baru tidak kembali memiliki visual berbeda.


## Struktur navigasi target — 19 September 2026

Navigasi shared sekarang mengikuti empat konteks utama:

```text
KRYZNA LEARN
├── 🌐 PUBLIK
│   ├── Beranda
│   ├── Materi
│   └── Ujian
├── 👨‍🎓 LEARNER
│   ├── Beranda
│   ├── Materi
│   ├── Ujian
│   ├── Belajar Saya
│   │   ├── Progress Belajar
│   │   ├── Riwayat Belajar
│   │   └── Bookmark
│   ├── Notifikasi
│   └── Profil
├── 📚 CONTENT
│   ├── Dashboard
│   ├── Kelola Materi
│   │   ├── Daftar Materi
│   │   ├── Kategori
│   │   ├── Riwayat Versi
│   │   └── Aktivitas Materi
│   └── Kelola Ujian
│       ├── Daftar Ujian
│       ├── Editor Ujian
│       └── Soal
└── 🛡️ ADMINISTRASI
    ├── Kelola Pengguna
    ├── Aktivitas Sistem
    ├── Import Materi
    └── Pengaturan
```

Implementasi menggunakan grouped navigation pada `shared/ui.js` dan submenu responsive pada `shared/ui.css`.

- Menu Content dan Administrasi disaring berdasarkan permission aktif.
- Learner menggunakan submenu **Belajar Saya** untuk progress, riwayat, dan bookmark.
- **Riwayat Versi** memiliki halaman indeks `content/versions-index.html` karena halaman versi individual membutuhkan `materi.id`.
- **Editor Ujian** dan **Soal** menggunakan bagian yang sesuai pada `admin/exams.html`; tidak dibuat halaman palsu yang terpisah.
- Active state diterapkan pada item submenu dan parent group.
- Backend/RLS tetap menjadi enforcement akses; navigasi hanya lapisan UX.
- Mobile menggunakan submenu yang dapat dibuka dan tetap mempertahankan target sentuh yang memadai.


### Navigasi bertingkat final

- **CONTENT** menjadi group utama yang berisi Dashboard, Kelola Materi, dan Kelola Ujian.
- **Kelola Materi** memiliki submenu Daftar Materi, Kategori, Riwayat Versi, dan Aktivitas Materi.
- **Kelola Ujian** memiliki submenu Daftar Ujian, Editor Ujian, dan Soal.
- **ADMINISTRASI** menjadi group utama untuk Kelola Pengguna, Aktivitas Sistem, Import Materi, dan Pengaturan.
- Parent group otomatis terbuka ketika halaman anak sedang aktif.
- Menu publik **Materi** menggunakan anchor katalog `#materi`; **Progress Belajar** menggunakan anchor `#progress`.


## Navigasi mobile — 20 September 2026

- Branch: `20-Sep-2026`.
- Navigasi bersama sekarang memiliki tombol menu mobile dengan `aria-expanded` dan `aria-controls`.
- Pada layar kecil, menu utama tidak lagi bergantung pada horizontal scroll; menu dapat dibuka/tutup sebagai panel vertikal.
- Group **CONTENT**, **ADMINISTRASI**, dan **Belajar Saya** tetap menggunakan `details/summary` sehingga submenu tetap dapat dibuka bertingkat.
- Setelah memilih link, menu mobile otomatis ditutup.
- Menu **Akun** tetap tersedia pada mobile.
- Desktop mempertahankan pola navigasi horizontal yang sudah ada.
- Tidak ada perubahan database, RLS, RPC, role, atau permission.


## Navigasi desktop — 20 September 2026

- Dropdown desktop tidak lagi bergantung pada horizontal overflow; `.kx-links` menggunakan overflow visible agar submenu tidak terpotong.
- Parent group diberi state visual saat terbuka sehingga konteks **CONTENT**, **ADMINISTRASI**, dan **Belajar Saya** lebih jelas.
- Link navigasi memiliki tinggi minimum yang konsisten untuk target klik yang lebih nyaman.
- Dropdown memiliki batas tinggi dan scroll internal bila item terlalu banyak, sehingga tidak mendorong layout halaman secara tidak terkendali.
- Submenu tetap mempertahankan active state dan pembukaan otomatis berdasarkan halaman aktif.
- Perubahan hanya pada shared navigation styling; tidak mengubah routing, permission, RBAC, database, atau RLS.


## Header & footer visual polish — 20 September 2026

- Shared header diperhalus dengan brand block yang memiliki nama dan subtitle, target klik navigasi yang konsisten, active/open state yang lebih jelas, dan shadow/border yang lebih ringan.
- Shared footer ditambahkan untuk halaman yang belum memiliki footer, dengan identitas Kryzna Learn dan shortcut Beranda, Materi, Ujian, serta Belajar Saya pada area learner.
- Footer lama pada halaman yang sudah memilikinya tetap dipertahankan dan diharmonisasi melalui shared visual layer.
- Perubahan hanya pada presentasi UI; tidak mengubah routing, auth, permission, RBAC, database, atau RLS.
- Status: **Implemented — Needs Browser Verification**.

## 🎨 Full Blue Theme — 20 September 2026

- Shared visual system now uses a blue-first palette for both Light and Dark mode.
- Light mode uses a soft blue page background, blue-tinted borders/surfaces, and blue primary actions.
- Dark mode uses deep navy surfaces/backgrounds with readable light-blue text and blue interactive states.
- Shared navigation, cards, forms, tables, status badges, empty/error/success states, sticky actions, header, and footer inherit the theme tokens.
- Theme preference remains stored in `localStorage` under `kryzna-theme`; the existing 🌙 / ☀️ toggle in `shared/ui.js` controls the `data-theme` attribute.
- No routing, auth, permission, RBAC, database, RLS, or business logic changes were made.
- Source commit: `a381fdb4bb1d8665f95a68f8320a90eccd7d0387`.
- Status: **Source Verified — Needs Browser Verification**.
