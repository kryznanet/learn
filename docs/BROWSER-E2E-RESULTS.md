# Browser E2E Results — Kryzna Learn

Dokumen ini menyimpan **hasil runtime Browser E2E terbaru** yang benar-benar dijalankan oleh GitHub Actions. Dokumen ini sengaja hanya menyimpan **satu hasil runtime terakhir**; ketika hasil tes baru tersedia, recorder otomatis menggantikan hasil sebelumnya.

## Aturan pencatatan

- Hanya hasil workflow yang benar-benar berjalan yang boleh dicatat sebagai hasil runtime.
- Source-level verification tidak dianggap sebagai runtime pass.
- Hasil runtime lama dihapus otomatis saat hasil runtime baru dicatat; dokumen ini bukan arsip histori.
- Run yang gagal tetap dicatat sebagai hasil terbaru beserta outcome dan ringkasan Playwright.
- Run dengan authenticated test yang ter-skip karena secret tidak tersedia tidak boleh dianggap sebagai pass penuh.
- Artifact Playwright menjadi bukti pendukung bila tersedia.

## Status saat ini — 2026-09-19

**Status: Passed**

Fresh GitHub Actions runtime evidence terbaru: Browser E2E #225 (9 passed, 0 failed, 0 skipped, 0 flaky).

### Coverage yang telah diverifikasi

- Homepage title.
- Admin login form.
- Published catalog total: **58**.
- Exact category count:
  - Dasar: **22**
  - Intermediate: **20**
  - Advanced: **12**
  - Tutorial: **4**
- Badge kategori pada setiap card yang tampil.
- Learning-path activation sesuai kategori.
- Navigasi card pertama ke `materi/view.html?slug=...`.
- Detail materi menampilkan judul dan content.

Test source commit: `a75f2de2e5dffc72e044770e2241ce25681acf57`.

## Runtime history

### 2026-09-19 — Automated Browser E2E runtime

- Workflow: **Browser E2E #225**
- Run ID: `35430654801`
- Run URL: https://github.com/kryznanet/learn/actions/runs/35430654801
- Branch: `19-Sep-2026`
- Commit: `bc306350a70c05910b13184b030a04279d2cd206`
- Trigger: `push`
- Result: **Passed**
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky** (9 recorded)
- Artifact: `playwright-report` is uploaded by the workflow when files are available.
- Recorded automatically from `test-results/results.json` at 2026-09-19T07:57:08.752Z.

## Interpretation

**Passed** berarti workflow yang direferensikan benar-benar selesai sukses untuk coverage yang tercantum.

**Failed** berarti workflow menghasilkan runtime result tetapi test outcome tidak memenuhi kondisi pass.

Dokumen ini selalu merepresentasikan **runtime result terbaru**, bukan histori seluruh run.

## Next checkpoint

Setelah fresh public E2E runtime pass ini, lanjutkan **review pedagogis akhir dan browser/rendering review untuk 58 materi**. Restore UI-to-database tetap **Blocked** sampai environment Supabase terisolasi tersedia.
