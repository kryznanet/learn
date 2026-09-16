// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.addEventListener('DOMContentLoaded', function () {
  // Tambahkan menu import yang berdiri sendiri di dashboard.
  if (/\/admin\/dashboard\.html$/i.test(location.pathname)) {
    const top = document.querySelector('header .top');
    if (top && !document.getElementById('kryznaImportMenu')) {
      const a = document.createElement('a');
      a.id = 'kryznaImportMenu';
      a.href = 'import.html';
      a.textContent = '📥 Import Materi';
      a.style.cssText = 'display:inline-block;text-decoration:none;border-radius:8px;padding:9px 13px;cursor:pointer;font-weight:600;background:#7c3aed;color:#fff;border:1px solid #a78bfa';
      top.insertBefore(a, top.firstChild);
    }

    // Tombol importer lama diarahkan ke menu import baru, sehingga PDF tidak lagi
    // melewati PDF engine/rendering lama.
    const legacy = document.getElementById('importBtn2');
    if (legacy) {
      legacy.textContent = '📥 Buka Menu Import';
      legacy.onclick = function () { location.href = 'import.html'; };
    }
    const old = document.getElementById('oldImport');
    if (old) {
      old.textContent = '📥 Import Materi';
      old.onclick = function () { location.href = 'import.html'; };
    }
  }

  // File picker compatibility untuk halaman lama.
  const input = document.getElementById('importFile');
  if (input) {
    input.accept = '.docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
  }

  // Compatibility shim untuk selector Office XML lama `xml,o:p`.
  (function () {
    const nativeQuerySelectorAll = Document.prototype.querySelectorAll;
    if (Document.prototype.querySelectorAll.__kryznaPatched) return;
    function patched(selector) {
      if (typeof selector === 'string' && /o\\?:p/i.test(selector)) {
        selector = selector.replace(/,?xml,?o\\?:p/gi, '');
      }
      return nativeQuerySelectorAll.call(this, selector);
    }
    patched.__kryznaPatched = true;
    Document.prototype.querySelectorAll = patched;
  })();
});
