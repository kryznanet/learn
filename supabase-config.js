// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan
// service_role/secret key di sini.
const SUPABASE_URL = "https://wtmkudojxenkjkoegibf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  },
);

window.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    :root { color-scheme: light; }
    [data-theme=dark] { color-scheme: dark; }
    body { color: #0f172a !important; }
    body, body * { text-shadow: none; }
    input, textarea, select { color: #0f172a !important; background: #fff !important; }
    input::placeholder, textarea::placeholder { color: #64748b !important; opacity: 1; }
    .hero p, .section-head p, .card p, .side a, .search-count, footer { color: #475569 !important; }
    .pill { color: #1d4ed8 !important; background: #fff !important; }
    .hero-card, .feature, .card, .side, .search, .empty { color: #0f172a; }
    .badge { color: #1d4ed8 !important; background: #eff6ff !important; }
    .read { color: #1d4ed8 !important; }
    [data-theme=dark] body { background: #07101d !important; color: #f8fafc !important; }
    [data-theme=dark] .hero p, [data-theme=dark] .section-head p, [data-theme=dark] .card p, [data-theme=dark] .side a, [data-theme=dark] .search-count, [data-theme=dark] footer { color: #cbd5e1 !important; }
    [data-theme=dark] .hero-card, [data-theme=dark] .feature, [data-theme=dark] .card, [data-theme=dark] .side, [data-theme=dark] .search, [data-theme=dark] .empty { background: #0f1a2c !important; color: #f8fafc !important; border-color: #334155 !important; }
    [data-theme=dark] input, [data-theme=dark] textarea, [data-theme=dark] select { color: #f8fafc !important; background: #111827 !important; border-color: #475569 !important; }
    body:has(.layout .nav) { color: #0f172a !important; }
    body:has(.layout .nav) .card, body:has(.layout .nav) .stat, body:has(.layout .nav) .item, body:has(.layout .nav) .nav { color: #0f172a; }
    body:has(.layout .nav) .meta, body:has(.layout .nav) .status, body:has(.layout .nav) .hint { color: #64748b !important; }
    body:has(.layout .nav) input, body:has(.layout .nav) textarea, body:has(.layout .nav) select { color: #0f172a !important; background: #fff !important; }
    .navlinks a, .btn, .chip, .badge, .read, .theme { overflow-wrap: normal; white-space: nowrap; }
    body.k-role-viewer .nav button[data-view="import"], body.k-role-viewer .nav button[data-view="editor"], body.k-role-viewer button[onclick*="newMaterial"], body.k-role-viewer button[type="submit"], body.k-role-viewer .edit, body.k-role-viewer .delete { display: none !important; }
    body.k-role-penulis .delete { display: none !important; }
    #k-user-role { display: inline-flex; align-items: center; padding: 5px 9px; border-radius: 999px; background: #1e293b; color: #dbeafe; font-size: 10px; font-weight: 900; border: 1px solid #334155; }
    #k-profile-link, #k-activity-link { display: inline-flex; align-items: center; gap: 6px; text-decoration: none; padding: 8px 11px; border-radius: 9px; background: #ffffff14; color: #fff; border: 1px solid #ffffff33; font-size: 12px; font-weight: 800; }
    #k-users-shell { height: calc(100vh - 130px); min-height: 650px; padding: 0; overflow: hidden; }
    #k-users-frame { width: 100%; height: 100%; min-height: 650px; border: 0; display: block; background: transparent; }
    body:has(.layout .nav) .editor, body:has(.layout .nav) .editor .toolbar, body:has(.layout .nav) .editor .toolbar-row { visibility: visible !important; opacity: 1 !important; }
    body:has(.layout .nav) .editor .toolbar { display: block !important; position: sticky; top: 0; z-index: 20; }
    body:has(.layout .nav) .editor .toolbar-row { display: flex !important; align-items: flex-start; }
    body:has(.layout .nav) .editor .toolbar select, body:has(.layout .nav) .editor .toolbar button, body:has(.layout .nav) .editor .toolbar input[type="color"] { pointer-events: auto !important; }
    body:has(.layout .nav) .editor .body { display: block !important; min-height: 430px; background: #fff !important; color: #0f172a !important; cursor: text; }
    .editor .toolbar .t.active { background: #dbeafe !important; border-color: #2563eb !important; color: #1d4ed8 !important; box-shadow: 0 0 0 1px #93c5fd inset; }
    .editor .toolbar .k-extra-group { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
    .editor .toolbar .k-extra-label { font-size: 10px; font-weight: 800; color: #64748b; margin-right: 2px; }
    .editor .body img.k-selected-image { outline: 2px solid #2563eb !important; outline-offset: 2px; cursor: nwse-resize; }
    .editor .body img { max-width: 100%; height: auto; }
    .editor .body table { border-collapse: collapse; width: 100%; }
    .editor .body td, .editor .body th { border: 1px solid #cbd5e1; padding: 7px 9px; min-width: 70px; }
    .k-table-tools { display: none; gap: 4px; flex-wrap: wrap; align-items: center; padding: 5px 0 0; }
    .k-table-tools.visible { display: flex; }
    .k-table-tools button { border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; padding: 4px 7px; font-size: 11px; cursor: pointer; }
    .k-cell-tools { display:none; gap:4px; flex-wrap:wrap; align-items:center; padding:5px 0 0; }
    .k-cell-tools.visible { display:flex; }
    .k-cell-tools button { border:1px solid #cbd5e1; background:#fff; border-radius:6px; padding:4px 7px; font-size:11px; cursor:pointer; }
    .k-image-resizer { position:absolute; width:10px; height:10px; border:2px solid #2563eb; background:#fff; border-radius:2px; z-index:9999; cursor:nwse-resize; display:none; box-sizing:border-box; }
    .k-image-resizer.visible { display:block; }
    @media (max-width: 640px) {
      .hero p, .card p, .content p, .content li { line-height: 1.7 !important; }
      .card h3 { font-size: 18px !important; }
      #k-users-shell, #k-users-frame { min-height: 760px; height: calc(100vh - 100px); }
      body:has(.layout .nav) .editor .toolbar-row { gap: 6px; }
      body:has(.layout .nav) .editor .grp { max-width: 100%; flex-wrap: wrap; }
    }
  `;
  document.head.appendChild(style);
});

window.addEventListener("DOMContentLoaded", function () {
  const editor = document.getElementById("konten");
  if (!editor || editor.dataset.kEditorEnhanced === "1") return;
  editor.dataset.kEditorEnhanced = "1";
  editor.setAttribute("contenteditable", "true");
  editor.setAttribute("spellcheck", "true");
  const focusEditor = () => editor.focus();
  const refreshPreview = () => {
    if (typeof window.preview === "function") window.preview();
    else { const live = document.getElementById("live"); if (live) live.innerHTML = editor.innerHTML || ""; }
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const exec = (command, value = null) => {
    focusEditor();
    try { document.execCommand(command, false, value); } catch (e) { console.warn("Format command gagal:", command, e); }
    refreshPreview(); syncToolbarState();
  };
  const applyInlineStyle = (property, value) => {
    focusEditor(); const selection = window.getSelection(); if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0); const span = document.createElement("span"); span.style[property] = value;
    if (range.collapsed) { span.appendChild(document.createTextNode("\u200b")); range.insertNode(span); const next = document.createRange(); next.selectNodeContents(span); next.collapse(false); selection.removeAllRanges(); selection.addRange(next); }
    else { span.appendChild(range.extractContents()); range.insertNode(span); selection.removeAllRanges(); const next = document.createRange(); next.selectNodeContents(span); selection.addRange(next); }
    refreshPreview(); syncToolbarState();
  };
  const block = document.getElementById("block");
  if (block) { block.onmousedown = e => e.preventDefault(); block.onchange = e => exec("formatBlock", e.target.value); }
  const font = document.getElementById("font");
  if (font) { font.onmousedown = e => e.preventDefault(); font.onchange = e => exec("fontName", e.target.value); }
  const size = document.getElementById("size");
  if (size) { size.onmousedown = e => e.preventDefault(); size.onchange = e => { focusEditor(); try { document.execCommand("styleWithCSS", false, true); } catch (_) {} try { document.execCommand("fontSize", false, "7"); editor.querySelectorAll('font[size="7"]').forEach(node => { const span = document.createElement("span"); span.style.fontSize = e.target.value; span.innerHTML = node.innerHTML; node.replaceWith(span); }); } catch (_) { applyInlineStyle("fontSize", e.target.value); } refreshPreview(); syncToolbarState(); }; }
  const color = document.getElementById("color");
  if (color) { color.onmousedown = e => e.preventDefault(); color.oninput = e => exec("foreColor", e.target.value); }
  const hilite = document.getElementById("hilite");
  if (hilite) { hilite.onmousedown = e => e.preventDefault(); hilite.oninput = e => { focusEditor(); try { document.execCommand("hiliteColor", false, e.target.value); } catch (_) { document.execCommand("backColor", false, e.target.value); } refreshPreview(); }; }
  document.querySelectorAll(".editor [data-cmd]").forEach(button => { button.onmousedown = e => e.preventDefault(); button.onclick = () => exec(button.dataset.cmd); });
  const clear = document.getElementById("clear"); if (clear) { clear.onmousedown = e => e.preventDefault(); clear.onclick = () => { exec("removeFormat"); exec("unlink"); }; }
  const link = document.getElementById("link"); if (link) { link.onmousedown = e => e.preventDefault(); link.onclick = () => { const url = prompt("URL tautan:", "https://"); if (url) exec("createLink", url.trim()); }; }
  const image = document.getElementById("image"); if (image) { image.onmousedown = e => e.preventDefault(); image.onclick = () => { const url = prompt("URL gambar:", "https://"); if (url) exec("insertImage", url.trim()); }; }
  function makeButton(label, command, title) { const button = document.createElement("button"); button.type = "button"; button.className = "t"; button.dataset.cmd = command; button.title = title; button.setAttribute("aria-label", title); button.textContent = label; button.onmousedown = e => e.preventDefault(); button.onclick = () => exec(command); return button; }
  const toolbar = editor.closest(".editor")?.querySelector(".toolbar");
  if (toolbar && !toolbar.querySelector(".k-extra-group")) { const group = document.createElement("div"); group.className = "grp k-extra-group"; const label = document.createElement("span"); label.className = "k-extra-label"; label.textContent = "Format"; group.appendChild(label); group.appendChild(makeButton("S̶", "strikeThrough", "Coret / Strikethrough")); group.appendChild(makeButton("x₂", "subscript", "Subscript")); group.appendChild(makeButton("x²", "superscript", "Superscript")); const row = toolbar.querySelector(".toolbar-row"); if (row) row.appendChild(group); else toolbar.appendChild(group); }
  function syncToolbarState() { if (!editor.matches(":focus") && !window.getSelection()?.rangeCount) return; const commands = ["bold","italic","underline","strikeThrough","subscript","superscript","insertUnorderedList","insertOrderedList","justifyLeft","justifyCenter","justifyRight","justifyFull"]; document.querySelectorAll(".editor [data-cmd]").forEach(button => { if (!commands.includes(button.dataset.cmd)) return; let active = false; try { active = document.queryCommandState(button.dataset.cmd); } catch (_) {} button.classList.toggle("active", !!active); button.setAttribute("aria-pressed", String(!!active)); }); }
  ["keyup","mouseup","input"].forEach(eventName => editor.addEventListener(eventName, syncToolbarState)); document.addEventListener("selectionchange", syncToolbarState);
  function cleanWordMarkup() { editor.querySelectorAll("*").forEach(node => { if (node.nodeType !== 1) return; [...node.attributes].forEach(attr => { const name = attr.name.toLowerCase(); const value = attr.value || ""; if (name === "class" && /(^|\s)Mso/i.test(value)) node.removeAttribute(attr.name); if (/^(lang|xml:|xmlns|width|height)$/i.test(name)) node.removeAttribute(attr.name); if (name === "style") { const cleaned = value.split(";").map(x => x.trim()).filter(x => x && !/^mso-/i.test(x)).join("; "); if (cleaned) node.setAttribute("style", cleaned); else node.removeAttribute("style"); } }); }); editor.querySelectorAll("p.MsoNormal, p.MsoTitle, p.MsoSubtitle").forEach(p => p.removeAttribute("class")); refreshPreview(); }
  editor.addEventListener("paste", () => setTimeout(cleanWordMarkup, 0));
  let selectedImage = null;
  editor.addEventListener("click", e => { if (selectedImage) selectedImage.classList.remove("k-selected-image"); selectedImage = e.target.closest("img"); if (selectedImage && editor.contains(selectedImage)) selectedImage.classList.add("k-selected-image"); else selectedImage = null; });
  editor.addEventListener("dblclick", e => { const img = e.target.closest("img"); if (!img || !editor.contains(img)) return; const current = Math.round(img.getBoundingClientRect().width || img.naturalWidth || 600); const value = prompt("Lebar gambar (px):", String(current)); if (value === null) return; const width = Math.max(40, Math.min(2400, parseInt(value, 10) || current)); img.style.width = width + "px"; img.style.height = "auto"; img.removeAttribute("width"); img.removeAttribute("height"); refreshPreview(); });
  function tableTools() { let tools = toolbar?.querySelector(".k-table-tools"); if (!toolbar) return null; if (!tools) { tools = document.createElement("div"); tools.className = "k-table-tools"; [["+ Baris","row-add"],["− Baris","row-del"],["+ Kolom","col-add"],["− Kolom","col-del"]].forEach(([label, action]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.dataset.tableAction = action; b.onmousedown = e => e.preventDefault(); tools.appendChild(b); }); toolbar.appendChild(tools); } return tools; }
  function currentCell() { const node = window.getSelection()?.anchorNode; const el = node?.nodeType === 1 ? node : node?.parentElement; return el?.closest?.("td,th"); }
  function updateTableTools() { const tools = tableTools(); const cell = currentCell(); if (tools) tools.classList.toggle("visible", !!cell); }
  editor.addEventListener("click", updateTableTools); editor.addEventListener("keyup", updateTableTools); document.addEventListener("selectionchange", updateTableTools);
  editor.closest(".editor")?.addEventListener("click", e => { const button = e.target.closest("[data-table-action]"); if (!button) return; const cell = currentCell(); if (!cell) return; const table = cell.closest("table"); const row = cell.parentElement; const index = [...row.children].indexOf(cell); if (button.dataset.tableAction === "row-add") { const newRow = table.insertRow(row.rowIndex + 1); for (let i=0;i<row.cells.length;i++) { const c = newRow.insertCell(); c.innerHTML = "&nbsp;"; } } else if (button.dataset.tableAction === "row-del") { if (table.rows.length > 1) table.deleteRow(row.rowIndex); } else if (button.dataset.tableAction === "col-add") { [...table.rows].forEach(r => { const c = r.insertCell(index + 1); c.innerHTML = "&nbsp;"; }); } else if (button.dataset.tableAction === "col-del") { if (row.cells.length > 1) [...table.rows].forEach(r => r.deleteCell(index)); } refreshPreview(); updateTableTools(); });
  editor.addEventListener("keydown", e => { if (!(e.ctrlKey || e.metaKey)) return; const key = e.key.toLowerCase(); if (key === "b") { e.preventDefault(); exec("bold"); } else if (key === "i") { e.preventDefault(); exec("italic"); } else if (key === "u") { e.preventDefault(); exec("underline"); } else if (e.shiftKey && key === "x") { e.preventDefault(); exec("strikeThrough"); } });
});

window.addEventListener("DOMContentLoaded", function () {
  const editor = document.getElementById("konten");
  const toolbar = editor?.closest(".editor")?.querySelector(".toolbar");
  if (!editor || !toolbar || editor.dataset.kAdvancedTable === "1") return;
  editor.dataset.kAdvancedTable = "1";
  const refresh = () => { if (typeof window.preview === "function") window.preview(); editor.dispatchEvent(new Event("input", { bubbles: true })); };
  const currentCell = () => { const node = window.getSelection()?.anchorNode; const el = node?.nodeType === 1 ? node : node?.parentElement; return el?.closest?.("td,th"); };
  const makeAdvancedButton = (label, action, title) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.title = title; b.dataset.advancedTable = action; b.onmousedown = e => e.preventDefault(); return b; };
  const ensureButtons = () => { let tools = toolbar.querySelector(".k-table-tools"); if (!tools) return; const add = (label, action, title) => { if (tools.querySelector(`[data-advanced-table="${action}"]`)) return; tools.appendChild(makeAdvancedButton(label, action, title)); }; add("Gabung →", "merge-right", "Gabungkan cell ini dengan cell di sebelah kanan"); add("Gabung ↓", "merge-down", "Gabungkan cell ini dengan cell di bawah"); add("Pisah →", "split-horizontal", "Pisahkan cell berdasarkan colspan"); add("Pisah ↓", "split-vertical", "Pisahkan cell berdasarkan rowspan"); };
  const observer = new MutationObserver(ensureButtons); observer.observe(toolbar, { childList: true, subtree: true }); ensureButtons();
  function mergeRight(cell) { const row = cell.parentElement; const index = [...row.cells].indexOf(cell); const next = row.cells[index + 1]; if (!next) return false; const leftSpan = cell.colSpan || 1; const rightSpan = next.colSpan || 1; const join = cell.innerHTML.trim() && next.innerHTML.trim() ? "<br>" : ""; cell.innerHTML += join + next.innerHTML; cell.colSpan = leftSpan + rightSpan; next.remove(); return true; }
  function mergeDown(cell) { const table = cell.closest("table"); const row = cell.parentElement; const rowIndex = row.rowIndex; const cellIndex = [...row.cells].indexOf(cell); const belowRow = table?.rows[rowIndex + 1]; if (!belowRow) return false; const below = belowRow.cells[cellIndex]; if (!below) return false; const topSpan = cell.rowSpan || 1; const bottomSpan = below.rowSpan || 1; const join = cell.innerHTML.trim() && below.innerHTML.trim() ? "<br>" : ""; cell.innerHTML += join + below.innerHTML; cell.rowSpan = topSpan + bottomSpan; below.remove(); return true; }
  function splitHorizontal(cell) { const span = cell.colSpan || 1; if (span <= 1) return false; cell.colSpan = 1; const row = cell.parentElement; const index = [...row.cells].indexOf(cell); for (let i = 1; i < span; i++) { const c = row.insertCell(index + i); c.innerHTML = "&nbsp;"; } return true; }
  function splitVertical(cell) { const span = cell.rowSpan || 1; if (span <= 1) return false; const table = cell.closest("table"); const row = cell.parentElement; const rowIndex = row.rowIndex; const cellIndex = [...row.cells].indexOf(cell); cell.rowSpan = 1; for (let i = 1; i < span; i++) { const targetRow = table?.rows[rowIndex + i]; if (!targetRow) break; const c = targetRow.insertCell(Math.min(cellIndex, targetRow.cells.length)); c.innerHTML = "&nbsp;"; } return true; }
  toolbar.addEventListener("click", e => { const button = e.target.closest("[data-advanced-table]"); if (!button) return; const cell = currentCell(); if (!cell) return; let changed = false; switch (button.dataset.advancedTable) { case "merge-right": changed = mergeRight(cell); break; case "merge-down": changed = mergeDown(cell); break; case "split-horizontal": changed = splitHorizontal(cell); break; case "split-vertical": changed = splitVertical(cell); break; } if (changed) refresh(); });
  editor.addEventListener("keydown", e => { if (e.key !== "Tab" || e.ctrlKey || e.metaKey || e.altKey) return; const cell = currentCell(); if (!cell) return; const table = cell.closest("table"); if (!table || e.shiftKey) return; const rows = [...table.rows]; const lastRow = rows[rows.length - 1]; const isLastCell = cell.parentElement === lastRow && cell === lastRow.cells[lastRow.cells.length - 1]; if (!isLastCell) return; e.preventDefault(); const newRow = table.insertRow(-1); const count = Math.max(1, lastRow.cells.length); for (let i = 0; i < count; i++) { const c = newRow.insertCell(-1); c.innerHTML = "&nbsp;"; } refresh(); const target = newRow.cells[0]; const range = document.createRange(); range.selectNodeContents(target); range.collapse(true); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); });
});

window.addEventListener("DOMContentLoaded", function () {
  const editor = document.getElementById("konten");
  const toolbar = editor?.closest(".editor")?.querySelector(".toolbar");
  if (!editor || !toolbar || editor.dataset.kEditorPro === "1") return;
  editor.dataset.kEditorPro = "1";
  const refresh = () => { if (typeof window.preview === "function") window.preview(); editor.dispatchEvent(new Event("input", { bubbles: true })); };
  const cellFromSelection = () => { const n = window.getSelection()?.anchorNode; const el = n?.nodeType === 1 ? n : n?.parentElement; return el?.closest?.("td,th"); };
  const image = () => { const n = window.getSelection()?.anchorNode; const el = n?.nodeType === 1 ? n : n?.parentElement; return el?.closest?.("img"); };
  let cellTools = toolbar.querySelector(".k-cell-tools");
  if (!cellTools) { cellTools = document.createElement("div"); cellTools.className = "k-cell-tools"; cellTools.innerHTML = '<button type="button" data-cell-action="bg">Warna Cell</button><button type="button" data-cell-action="align-left">Kiri</button><button type="button" data-cell-action="align-center">Tengah</button><button type="button" data-cell-action="align-right">Kanan</button><button type="button" data-cell-action="valign-top">Atas</button><button type="button" data-cell-action="valign-middle">Tengah Vert.</button><button type="button" data-cell-action="valign-bottom">Bawah</button>'; toolbar.appendChild(cellTools); }
  const updateCellTools = () => cellTools.classList.toggle("visible", !!cellFromSelection());
  editor.addEventListener("click", updateCellTools); editor.addEventListener("keyup", updateCellTools); document.addEventListener("selectionchange", updateCellTools);
  cellTools.addEventListener("click", e => { const b = e.target.closest("[data-cell-action]"); const cell = cellFromSelection(); if (!b || !cell) return; const a = b.dataset.cellAction; if (a === "bg") { const color = prompt("Warna background cell (contoh #fff2cc):", cell.style.backgroundColor || "#fff2cc"); if (color) cell.style.backgroundColor = color; } else if (a.startsWith("align-")) cell.style.textAlign = a.replace("align-", ""); else if (a.startsWith("valign-")) cell.style.verticalAlign = a.replace("valign-", ""); refresh(); });
  let handle = null; let selected = null; let startX = 0; let startWidth = 0;
  const removeHandle = () => { if (handle) { handle.remove(); handle = null; } selected = null; };
  const placeHandle = img => { removeHandle(); selected = img; img.classList.add("k-selected-image"); handle = document.createElement("span"); handle.className = "k-image-resizer visible"; document.body.appendChild(handle); const place = () => { if (!handle || !selected?.isConnected) return; const r = selected.getBoundingClientRect(); handle.style.left = (window.scrollX + r.right - 6) + "px"; handle.style.top = (window.scrollY + r.bottom - 6) + "px"; }; place(); window.addEventListener("scroll", place, true); window.addEventListener("resize", place); handle._cleanup = () => { window.removeEventListener("scroll", place, true); window.removeEventListener("resize", place); }; };
  editor.addEventListener("click", e => { const img = e.target.closest("img"); if (img && editor.contains(img)) placeHandle(img); else removeHandle(); });
  document.addEventListener("mousedown", e => { if (!handle || e.target !== handle || !selected) return; e.preventDefault(); e.stopPropagation(); startX = e.clientX; startWidth = selected.getBoundingClientRect().width; const move = ev => { const width = Math.max(40, Math.min(2400, Math.round(startWidth + ev.clientX - startX))); selected.style.width = width + "px"; selected.style.height = "auto"; const r = selected.getBoundingClientRect(); handle.style.left = (window.scrollX + r.right - 6) + "px"; handle.style.top = (window.scrollY + r.bottom - 6) + "px"; refresh(); }; const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); }; document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); });
  editor.addEventListener("keydown", e => { if (e.key !== "Escape") return; removeHandle(); });
});

window.addEventListener("DOMContentLoaded", async function () {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    const { data: staff, error } = await supabaseClient.from("admin_users").select("role,active,display_name").eq("user_id", user.id).maybeSingle();
    if (error || !staff) return;
    if (!staff.active) { await supabaseClient.auth.signOut(); if (/\/admin\/dashboard\.html$/i.test(location.pathname)) location.replace("login.html"); return; }
    const role = String(staff.role || "viewer"); document.body.classList.add("k-role-" + role);
    const top = document.querySelector(".top");
    if (top && !document.getElementById("k-user-role")) { const badge = document.createElement("span"); badge.id = "k-user-role"; badge.textContent = staff.display_name ? staff.display_name + " · " + roleLabel(role) : roleLabel(role); top.insertBefore(badge, top.firstChild); }
    if (top && !document.getElementById("k-profile-link")) { const p = document.createElement("a"); p.id = "k-profile-link"; p.href = "profile.html"; p.textContent = "👤 Profile Saya"; top.insertBefore(p, top.firstChild); }
    if (role === "super_admin" && top && !document.getElementById("k-activity-link")) { const a = document.createElement("a"); a.id = "k-activity-link"; a.href = "activity.html"; a.textContent = "📋 Aktivitas"; top.insertBefore(a, top.firstChild); }
    const nav = document.querySelector(".layout .nav"); const content = document.querySelector(".layout .content");
    if (role === "super_admin" && nav && content && !document.querySelector('[data-view="users"]')) {
      const btn = document.createElement("button"); btn.type = "button"; btn.dataset.view = "users"; btn.textContent = "👥 Kelola User"; btn.addEventListener("click", () => { if (typeof window.showView === "function") window.showView("users"); }); nav.appendChild(btn);
      const section = document.createElement("section"); section.id = "users"; section.className = "view"; section.innerHTML = '<div id="k-users-shell" class="card"><iframe id="k-users-frame" title="Kelola User" src="users.html"></iframe></div>'; content.appendChild(section);
    }
  } catch (e) { console.warn("RBAC UI tidak dapat dimuat:", e); }
});

function roleLabel(role) {
  return ({ super_admin: "Super Admin", admin: "Admin", penulis: "Penulis / Pemateri", viewer: "Viewer" }[role] || role);
}

window.addEventListener("DOMContentLoaded", async function () {
  const editor = document.getElementById("konten");
  const imageButton = document.getElementById("image");
  if (!editor || !imageButton || imageButton.dataset.kDirectUpload === "1") return;
  imageButton.dataset.kDirectUpload = "1";
  imageButton.textContent = "🖼️ Upload";
  imageButton.title = "Upload gambar dari komputer";
  imageButton.setAttribute("aria-label", "Upload gambar dari komputer");

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg,image/png,image/webp,image/gif";
  input.hidden = true;
  input.id = "k-image-upload-input";
  document.body.appendChild(input);

  let savedRange = null;
  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) savedRange = range.cloneRange();
  };
  const restoreSelection = () => {
    if (!savedRange) { editor.focus(); return; }
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
    editor.focus();
  };
  const setStatus = text => {
    imageButton.title = text;
    imageButton.setAttribute("aria-label", text);
  };

  imageButton.addEventListener("mousedown", e => { e.preventDefault(); saveSelection(); });
  imageButton.addEventListener("click", () => { saveSelection(); input.click(); });

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      alert("Format gambar harus JPG, PNG, WebP, atau GIF.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 25 MB.");
      return;
    }

    const originalLabel = imageButton.textContent;
    imageButton.disabled = true;
    imageButton.textContent = "⏳ Upload...";
    setStatus("Sedang mengupload gambar...");
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "gambar";
      const path = `images/${user.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabaseClient.storage.from("materi-files").upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabaseClient.storage.from("materi-files").getPublicUrl(path);
      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) throw new Error("URL gambar tidak berhasil dibuat.");
      restoreSelection();
      document.execCommand("insertImage", false, publicUrl);
      editor.dispatchEvent(new Event("input", { bubbles: true }));
      if (typeof window.preview === "function") window.preview();
      imageButton.textContent = "🖼️ Upload";
      setStatus("Upload gambar dari komputer");
    } catch (error) {
      console.error("Upload gambar gagal:", error);
      alert("Upload gambar gagal: " + (error?.message || "Kesalahan tidak diketahui"));
      imageButton.textContent = originalLabel || "🖼️ Upload";
      setStatus("Upload gambar dari komputer");
    } finally {
      imageButton.disabled = false;
    }
  });
});
