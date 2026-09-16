// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Fallback import picker + compatibility fix for older dashboard code.
window.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('importFile');
  const button = document.getElementById('importBtn2');
  if (input && button) {
    input.accept = '.docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
    const label = document.createElement('label');
    label.htmlFor = 'importFile';
    label.className = button.className;
    label.textContent = 'Pilih File Word / PDF';
    label.style.display = 'inline-block';
    label.style.cursor = 'pointer';
    label.title = 'Pilih file DOCX atau PDF dari komputer';
    button.replaceWith(label);
  }
});

// Compatibility shim: dashboard lama memakai selector Office XML `xml,o:p`,
// yang dapat memicu DOMException karena `o:p` bukan selector CSS valid di browser.
// Buang bagian selector tersebut sebelum diteruskan ke querySelectorAll().
(function () {
  const nativeQuerySelectorAll = Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll = function (selector) {
    if (typeof selector === 'string' && /o\\?:p/i.test(selector)) {
      selector = selector.replace(/,?xml,?o\\?:p/gi, '');
    }
    return nativeQuerySelectorAll.call(this, selector);
  };
})();
