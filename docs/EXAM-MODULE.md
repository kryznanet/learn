# Modul Ujian Online & Riwayat Belajar

**Tanggal implementasi:** 19 September 2026  
**Branch:** `19-Sep-2026`

## Tujuan

Kryzna Learn sekarang memiliki modul terpisah untuk evaluasi pembelajaran dan pencatatan perjalanan belajar pengguna.

### Ujian Online

Kategori ujian mengikuti kategori materi: Dasar, Intermediate, Advanced, Tutorial. Setiap kategori saat ini memiliki **5 soal seed**, total **20 soal**, dengan pilihan A–D, pembahasan, tingkat kesulitan, dan materi terkait bila judul materi ditemukan.

Konfigurasi awal: durasi 30 menit, nilai lulus 70, status published, penilaian otomatis di server, dan riwayat per akun pengguna. Bank soal dapat ditambah melalui Admin → Kelola Ujian & Bank Soal.

### Riwayat Belajar

`material_reading_history` menyimpan satu record per kombinasi pengguna + materi. Status `in_progress` dibuat saat materi dibuka dan dapat berubah menjadi `completed` saat pengguna menandai materi selesai. Sistem menyimpan waktu pertama/terakhir dibaca dan jumlah kunjungan.

## Arsitektur keamanan

Browser tidak menerima tabel `exam_answer_keys`. Jawaban benar hanya dibaca oleh Edge Function `exam-api` menggunakan client administratif server-side.

Alur: Browser → Supabase Auth JWT → Edge Function exam-api → exam_questions/options + answer_keys → exam_attempts/exam_answers.

Edge Function memakai `withSupabase({ auth: 'user' })` dan deployment mempertahankan `verify_jwt=true`. Secret/service-role credential tidak pernah ditanamkan ke browser.

## Tabel

- `exam_categories`
- `exams`
- `exam_questions`
- `exam_question_options`
- `exam_answer_keys`
- `exam_attempts`
- `exam_answers`
- `material_reading_history`

Semua tabel baru mengaktifkan RLS. Tabel jawaban benar tidak diberi grant baca kepada pengguna biasa.

## Halaman

- `belajar/login.html` — login/daftar akun belajar.
- `belajar/index.html` — dashboard pengguna.
- `belajar/riwayat.html` — riwayat materi.
- `ujian/index.html` — daftar ujian per kategori.
- `ujian/kerjakan.html` — pengerjaan ujian dengan timer.
- `admin/exams.html` — pengelolaan bank soal.

## Verifikasi live

Pada 19 September 2026: 4 ujian published tersedia; setiap kategori memiliki 5 soal; total 20 answer key tersedia; 8 tabel modul memiliki RLS aktif; permission `exam.manage` dan `exam.read` diberikan kepada `admin` dan `super_admin`; Edge Function `exam-api` deployed aktif dengan JWT verification.

Verifikasi browser penuh untuk login learner, tracking riwayat, mulai ujian, submit, dan hasil masih **Needs Verification**.
