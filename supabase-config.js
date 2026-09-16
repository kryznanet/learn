// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Fallback import picker: menggunakan elemen <label> asli agar dialog file
// tetap bisa dibuka walaupun handler tombol JavaScript tidak terpasang.
window.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('importFile');
  const button = document.getElementById('importBtn2');
  if (!input || !button) return;

  input.accept = '.docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';

  const label = document.createElement('label');
  label.htmlFor = 'importFile';
  label.className = button.className;
  label.textContent = 'Pilih File Word / PDF';
  label.style.display = 'inline-block';
  label.style.cursor = 'pointer';
  label.title = 'Pilih file DOCX atau PDF dari komputer';
  button.replaceWith(label);
});
