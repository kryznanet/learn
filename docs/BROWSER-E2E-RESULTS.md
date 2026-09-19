# Browser E2E Results — Kryzna Learn

Dokumen ini menyimpan **hasil runtime Browser E2E** yang benar-benar dijalankan oleh GitHub Actions. Dokumen ini dipisahkan dari `docs/PROJECT-STATUS.md` agar checkpoint proyek tetap ringkas sementara histori pengujian tetap dapat ditelusuri.

## Aturan pencatatan

- Hanya hasil workflow yang benar-benar berjalan yang boleh dicatat sebagai hasil runtime.
- Source-level verification tidak dianggap sebagai runtime pass.
- Run yang gagal harus dicatat beserta indikasi penyebab dan tindak lanjutnya.
- Run dengan authenticated test yang ter-skip karena secret tidak tersedia tidak boleh dianggap sebagai pass penuh.
- Setiap perubahan pada assertion E2E harus menunggu fresh runtime evidence sebelum status regression ditutup.
- Artifact Playwright menjadi bukti pendukung bila tersedia.

## Status saat ini — 19 September 2026

**Status: Passed**

Fresh GitHub Actions runtime evidence untuk assertion public Browser E2E pada branch `19-Sep-2026` telah diverifikasi melalui run #138.

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

- Workflow: **Browser E2E #155**
- Run ID: `35428161841`
- Run URL: https://github.com/kryznanet/learn/actions/runs/35428161841
- Branch: `19-Sep-2026`
- Commit: `ea81d15ab0179b8253a26f7211b250f1503ed1f5`
- Trigger: `push`
- Result: **Passed**
- Playwright summary: **9 passed, 0 failed, 0 skipped, 0 flaky** (9 recorded)
- Artifact: `playwright-report` is uploaded by the workflow when files are available.
- Recorded automatically from `test-results/results.json` at 2026-09-19T07:01:59.793Z.


### 19 September 2026 — Strengthened public catalog assertions

- Workflow: **Browser E2E #138**
- Run ID: `35427073533`
- Branch: `19-Sep-2026`
- Commit: `185742bc803138c1bf9488046957b8d1d638e985`
- Trigger: `workflow_dispatch`
- Result: **Passed**
- Playwright job: **success**
- Test result: **9 passed, 0 failed**
- Coverage: 4 authenticated editor/version-history tests dan 5 public-page tests, termasuk seluruh strengthened public catalog assertions.
- Artifact: `playwright-report`, artifact ID `10579152444`, tersedia selama retention period GitHub Actions.
- Runtime started: 19 September 2026 06:36:42 UTC.
- Runtime completed: 19 September 2026 06:37:57 UTC.

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

## Next checkpoint

Setelah fresh public E2E runtime pass ini, lanjutkan **review pedagogis akhir dan browser/rendering review untuk 58 materi**. Restore UI-to-database tetap **Blocked** sampai environment Supabase terisolasi tersedia.

