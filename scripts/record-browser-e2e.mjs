#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resultsPath = path.join(root, "test-results", "results.json");
const resultsDocPath = path.join(root, "docs", "BROWSER-E2E-RESULTS.md");
const statusDocPath = path.join(root, "docs", "PROJECT-STATUS.md");

const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

if (!exists(resultsPath)) {
  console.log("No Playwright JSON result found; nothing to record.");
  process.exit(0);
}

const report = JSON.parse(read(resultsPath));
const stats = report.stats ?? {};
const expected = Number(stats.expected ?? 0);
const unexpected = Number(stats.unexpected ?? 0);
const skipped = Number(stats.skipped ?? 0);
const flaky = Number(stats.flaky ?? 0);
const total = expected + unexpected + skipped + flaky;
const outcome = process.env.E2E_OUTCOME === "success" && unexpected === 0 ? "Passed" : "Failed";

const runId = process.env.GITHUB_RUN_ID ?? "unknown";
const runNumber = process.env.GITHUB_RUN_NUMBER ?? "unknown";
const sha = process.env.GITHUB_SHA ?? "unknown";
const branch = process.env.GITHUB_REF_NAME ?? "unknown";
const server = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const repository = process.env.GITHUB_REPOSITORY ?? "kryznanet/learn";
const runUrl = `${server}/${repository}/actions/runs/${runId}`;
const trigger = process.env.GITHUB_EVENT_NAME ?? "unknown";
const now = new Date().toISOString();

let resultsDoc = read(resultsDocPath);
const historyMarker = "## Runtime history";
const interpretationMarker = "## Interpretation";
const entry = \`### \${now.slice(0, 10)} — Automated Browser E2E runtime

- Workflow: **Browser E2E #\${runNumber}**
- Run ID: \\\`\${runId}\\\`
- Run URL: \${runUrl}
- Branch: \\\`\${branch}\\\`
- Commit: \\\`\${sha}\\\`
- Trigger: \\\`\${trigger}\\\`
- Result: **\${outcome}**
- Playwright summary: **\${expected} passed, \${unexpected} failed, \${skipped} skipped, \${flaky} flaky** (\${total} recorded)
- Artifact: \\\`playwright-report\\\` is uploaded by the workflow when files are available.
- Recorded automatically from \\\`test-results/results.json\\\` at \${now}.

\`;

const historyStart = resultsDoc.indexOf(historyMarker);
const interpretationStart = resultsDoc.indexOf(interpretationMarker);

if (historyStart !== -1 && interpretationStart !== -1 && interpretationStart > historyStart) {
  resultsDoc =
    resultsDoc.slice(0, historyStart) +
    \`\${historyMarker}\\\\n\\\\n\${entry}\` +
    resultsDoc.slice(interpretationStart);
} else if (historyStart !== -1) {
  resultsDoc = resultsDoc.slice(0, historyStart) + \`\${historyMarker}\\\\n\\\\n\${entry}\`;
} else {
  resultsDoc += \`\\\\n\\\\n\${historyMarker}\\\\n\\\\n\${entry}\`;
}

const statusStart = resultsDoc.indexOf("## Status saat ini");
const coverageMarker = "### Coverage yang telah diverifikasi";
if (statusStart !== -1) {
  const coverageStart = resultsDoc.indexOf(coverageMarker, statusStart);
  if (coverageStart !== -1) {
    resultsDoc =
      resultsDoc.slice(0, statusStart) +
      \`## Status saat ini — \${now.slice(0, 10)}\\\\n\\\\n**Status: \${outcome}**\\\\n\\\\nFresh GitHub Actions runtime evidence terbaru: Browser E2E #\${runNumber} (\${expected} passed, \${unexpected} failed, \${skipped} skipped, \${flaky} flaky).\\\\n\\\\n\` +
      resultsDoc.slice(coverageStart);
  }
}
fs.writeFileSync(resultsDocPath, resultsDoc);

let statusDoc = read(statusDocPath);
const checkpoint = `\n\n## Automated Browser E2E runtime record — ${now.slice(0, 10)}\n\n- Workflow **Browser E2E #${runNumber}** pada branch \`${branch}\` selesai dengan hasil **${outcome}**.\n- Run ID: \`${runId}\`; commit yang diuji: \`${sha}\`.\n- Playwright summary: **${expected} passed, ${unexpected} failed, ${skipped} skipped, ${flaky} flaky**.\n- Runtime evidence dicatat otomatis ke \`docs/BROWSER-E2E-RESULTS.md\`; detail run: ${runUrl}.\n- Catatan ini dibuat dari artifact JSON hasil runtime, bukan dari source-level verification.\n`;
statusDoc += checkpoint;
fs.writeFileSync(statusDocPath, statusDoc);

console.log(`Recorded Browser E2E #${runNumber}: ${outcome} (${expected} passed, ${unexpected} failed, ${skipped} skipped, ${flaky} flaky).`);
