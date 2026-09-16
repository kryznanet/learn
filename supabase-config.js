// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan service_role/secret key di sini.
const SUPABASE_URL = 'https://wtmkudojxenkjkoegibf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function kryznaRenderPdfAsPages(file) {
  const status = document.getElementById('importStatus');
  const editor = document.getElementById('konten');
  if (!editor || !window.pdfjsLib) throw new Error('PDF engine belum siap.');

  if (status) status.textContent = 'Membaca PDF dan mempertahankan tampilan asli…';
  const pdf = await window.pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer())
  }).promise;

  const wrapper = document.createElement('div');
  wrapper.className = 'pdf-visual-import';
  wrapper.setAttribute('data-pdf-import', 'visual');
  wrapper.style.width = '100%';
  wrapper.style.margin = '0';
  wrapper.style.padding = '0';

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    if (status) status.textContent = `Memproses halaman ${pageNo} dari ${pdf.numPages}…`;

    const page = await pdf.getPage(pageNo);
    const base = page.getViewport({ scale: 1 });
    const editorWidth = Math.max(editor.clientWidth - 40, 760);
    // Render 2x-3x ukuran tampilan agar huruf, garis, warna, dan gambar tetap tajam.
    const displayScale = Math.max(1.5, Math.min(2.4, editorWidth / base.width));
    const renderScale = displayScale * 1.35;
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
      intent: 'display'
    }).promise;

    // PNG menjaga teks, garis, warna blok, screenshot, diagram, dan tabel lebih baik daripada JPEG.
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = `Halaman ${pageNo}`;
    img.setAttribute('data-pdf-page', String(pageNo));
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.margin = '0 auto 20px';
    img.style.background = '#fff';
    img.style.maxWidth = '100%';
    img.draggable = false;

    const pageBox = document.createElement('div');
    pageBox.style.width = '100%';
    pageBox.style.margin = '0 0 20px';
    pageBox.style.padding = '0';
    pageBox.style.background = '#fff';
    pageBox.style.overflow = 'hidden';
    pageBox.setAttribute('data-pdf-page-wrapper', String(pageNo));
    pageBox.appendChild(img);
    wrapper.appendChild(pageBox);
  }

  editor.innerHTML = '';
  editor.appendChild(wrapper);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  if (typeof window.preview === 'function') window.preview();
  if (status) status.textContent = `PDF berhasil diimpor: ${pdf.numPages} halaman. Format visual dipertahankan.`;
}

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

    // Intercept PDF sebelum handler importer lama sempat berjalan.
    // Ini mencegah PDF kembali diproses sebagai teks sehingga format aslinya hilang.
    input.addEventListener('change', async function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file || !/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') return;
      event.stopPropagation();
      event.stopImmediatePropagation();

      try {
        await kryznaRenderPdfAsPages(file);
      } catch (err) {
        console.error('PDF visual import failed:', err);
        const status = document.getElementById('importStatus');
        if (status) status.textContent = 'Gagal import PDF: ' + (err?.message || err);
      } finally {
        input.value = '';
      }
    }, true);
  }
});

// Compatibility shim untuk dashboard lama yang pernah memakai selector Office XML `xml,o:p`.
(function () {
  const nativeQuerySelectorAll = Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll = function (selector) {
    if (typeof selector === 'string' && /o\\?:p/i.test(selector)) {
      selector = selector.replace(/,?xml,?o\\?:p/gi, '');
    }
    return nativeQuerySelectorAll.call(this, selector);
  };
})();
