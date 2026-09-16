// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Fallback import picker + sanitizer fix.
// Dialog file dibuka lewat <label> agar tetap bekerja tanpa input.click().
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

  // Perbaiki sanitizer dashboard: selector CSS `o:p` tidak valid di beberapa browser.
  // Kita hapus tag Office XML secara aman tanpa memasukkannya ke querySelectorAll().
  window.norm = function (html) {
    const d = new DOMParser().parseFromString(html || '', 'text/html');

    d.querySelectorAll('script,iframe,object,embed,form,style,link,meta').forEach(function (e) {
      e.remove();
    });

    d.querySelectorAll('*').forEach(function (e) {
      const tag = String(e.tagName || '').toLowerCase();
      if (tag === 'o:p' || tag.indexOf(':') !== -1) {
        e.remove();
        return;
      }

      Array.from(e.attributes).forEach(function (a) {
        const n = a.name.toLowerCase();
        const v = a.value || '';
        if (
          /^on/i.test(n) ||
          n === 'srcdoc' ||
          ((n === 'href' || n === 'src') && /^\s*(javascript:|data:text\/html)/i.test(v)) ||
          (n === 'style' && /expression\s*\(|javascript\s*:|behavior\s*:|binding\s*:/i.test(v))
        ) {
          e.removeAttribute(n);
        }
      });
    });

    d.querySelectorAll('font').forEach(function (e) {
      const s = document.createElement('span');
      if (e.face) s.style.fontFamily = e.face;
      if (e.color) s.style.color = e.color;
      const m = {1:'10px',2:'13px',3:'16px',4:'18px',5:'24px',6:'32px',7:'40px'};
      if (e.size) s.style.fontSize = m[e.size] || e.size + 'px';
      s.innerHTML = e.innerHTML;
      e.replaceWith(s);
    });

    d.querySelectorAll('[style]').forEach(function (e) {
      const s = e.getAttribute('style').replace(/mso-[^:;]+:[^;]+;?/gi, '').trim();
      if (s) e.setAttribute('style', s);
      else e.removeAttribute('style');
    });

    d.querySelectorAll('img').forEach(function (e) {
      e.setAttribute('loading', 'lazy');
      e.removeAttribute('srcset');
    });

    return d.body.innerHTML;
  };
});
