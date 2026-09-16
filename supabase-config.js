// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

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

  // PDF importer baru: render setiap halaman sebagai gambar agar tampilan
  // warna, ukuran font, tabel, layout, dan posisi tetap sama seperti PDF.
  // Fungsi ini menggantikan importer teks lama di dashboard.
  if (window.pdfjsLib && typeof window.importPdf === 'function') {
    window.importPdf = async function (file) {
      const status = document.getElementById('importStatus');
      const editor = document.getElementById('konten');
      if (!editor) return;

      try {
        if (status) status.textContent = 'Membaca dan merender PDF…';
        const pdf = await window.pdfjsLib.getDocument({
          data: new Uint8Array(await file.arrayBuffer())
        }).promise;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-pdf-import', 'true');
        wrapper.style.width = '100%';

        for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
          if (status) status.textContent = `Merender halaman ${pageNo} dari ${pdf.numPages}…`;

          const page = await pdf.getPage(pageNo);
          const baseViewport = page.getViewport({ scale: 1 });
          const maxWidth = Math.min(1200, Math.max(900, editor.clientWidth - 50));
          const scale = Math.max(1.5, Math.min(3, maxWidth / baseViewport.width));
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.style.display = 'block';
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.margin = '0 auto 18px';
          canvas.style.background = '#fff';
          canvas.style.boxShadow = '0 1px 5px rgba(0,0,0,.12)';

          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport,
            intent: 'display'
          }).promise;

          const img = document.createElement('img');
          img.src = canvas.toDataURL('image/jpeg', 0.92);
          img.alt = `Halaman ${pageNo} dari PDF`;
          img.style.display = 'block';
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.margin = '0 auto 18px';
          img.style.background = '#fff';
          img.setAttribute('data-pdf-page', String(pageNo));

          const pageBox = document.createElement('div');
          pageBox.setAttribute('data-pdf-page-wrapper', String(pageNo));
          pageBox.style.margin = '0 0 18px';
          pageBox.appendChild(img);
          wrapper.appendChild(pageBox);
        }

        editor.innerHTML = '';
        editor.appendChild(wrapper);
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        if (typeof window.preview === 'function') window.preview();
        if (status) status.textContent = `PDF berhasil diimpor: ${pdf.numPages} halaman. Tampilan dipertahankan seperti PDF.`;
      } catch (err) {
        console.error(err);
        if (status) status.textContent = 'Gagal import PDF: ' + (err?.message || err);
        throw err;
      }
    };
  }
});

// Compatibility shim: dashboard lama memakai selector Office XML `xml,o:p`,
// yang dapat memicu DOMException karena `o:p` bukan selector CSS valid di browser.
(function () {
  const nativeQuerySelectorAll = Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll = function (selector) {
    if (typeof selector === 'string' && /o\\?:p/i.test(selector)) {
      selector = selector.replace(/,?xml,?o\\?:p/gi, '');
    }
    return nativeQuerySelectorAll.call(this, selector);
  };
})();
