# Browser E2E Results — Kryzna Learn

Dokumen ini menyimpan **hasil runtime Browser E2E** yang benar-benar dijalankan oleh GitHub Actions. Dokumen ini dipisahkan dari `docs/PROJECT-STATUS.md) agar checkpoint proyek tetap ringkas sementara histori pengujian tetap dapat ditelusuri.

## Aturan pencatatan

- Hanya hasil workflow yang benar-benar berjalan yang boleh dicatat sebagai hasil runtime.
- Source-level verification tidak dianggap sebagai runtime pass.
- Run yang gagal harus dicatat beserta indikasi penyebab dan tindak lanjutnya.
- Run dengan authenticated test yang ter-skip karena secret tidak tersedia tidak boleh dianggap sebagai pass penuh.
- Setiap perubahan pada assertion E2E harus menunggu fresh runtime evidence sebelum status regression ditutup.
- Artifact Playwright menjadi bukti pendukung bila tersedia.

## Status saat ini — 19 September 2026

**Status: Needs Verification**

Assertion public Browser E2E telah diperkuat pada branch `19-Sep-2026), tetapi belum ada fresh GitHub Actions runtime result yang dapat diverifikasi untuk assertion terbaru tersebut.

### Coverage yang menunggu runtime verification

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

### 19 September 2026 — Strengthened public catalog assertions

- Branch: `19-Sep-2026`
- Test commit: `a75f2de2e5dffc72e044770e2241ce25681acf57`
- Runtime result: **Needs Verification**
- Reason: connector saat ini tidak menyediakan workflow dispatch maupun listing seluruh workflow run berdasarkan branch, sehingga fresh run belum dapat dipicu/dibuktikan dari tool yang tersedia.
- Expected evidence: GitHub Actions Browser E2E run setelah commit tersebut, dengan Playwright report/artifact bila tersedia.

### 18 September 2026 — Browser E2E baseline

- Run: **#6**
- Run ID: `35296715443`
- Result: **Passed**
- Coverage: 3 Playwright tests, termasuk authenticated Super Admin editor reachability.
- Environment: GitHub Actions, Chromium, dedicated E2E secrets.
- This run predates the strengthened public catalog assertions above.

### 18 September 2026 — Draft Recovery verification

- Run: **#43**
- Run ID: `35298946197`
- Result: **Passed**
- Coverage: new-material and existing-material draft recovery/reload flows.
- Test commit: `2ec49859a5fffd793a721d257eaac0b122fd31b8`.

### 18 September 2026 — Draft Recovery failure diagnosis

- Run: **#35**
- Run ID: `35298200046`
- Result: **Failed**
- Result summary: 4 passed, 2 failed.
- Cause: editor readiness timing caused interactions/assertions before asynchronous initialization completed.
- Fix: editor readiness synchronization and E2E waiting logic were added.
- Follow-up run #43 passed for the covered Draft Recovery flows.

## Interpretation

**Passed** means the referenced workflow actually completed successfully for the listed coverage.

**Needs Verification** means the implementation/source has been inspected or strengthened, but a fresh runtime result for that exact coverage is not yet available.

**Blocked** is reserved for tests that intentionally cannot run because a required safe environment does not exist. The Version Restore UI-to-database E2E remains separately blocked because it must not mutate the production Supabase project.

## Next entry

After the next Browser E2E workflow completes, append a new dated entry with:

1. branch;
2. commit SHA;
3. workflow/run number and ID;
4. pass/fail/skip counts;
5. authenticated test status;
6. relevant artifact/report;
7. failure diagnosis if applicable;
8. resulting project status.
