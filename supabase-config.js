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
    :root {
      color-scheme: light;
    }

    [data-theme=dark] {
      color-scheme: dark;
    }

    body {
      color: #0f172a !important;
    }

    body,
    body * {
      text-shadow: none;
    }

    input,
    textarea,
    select {
      color: #0f172a !important;
      background: #fff !important;
    }

    input::placeholder,
    textarea::placeholder {
      color: #64748b !important;
      opacity: 1;
    }

    .hero p,
    .section-head p,
    .card p,
    .side a,
    .search-count,
    footer {
      color: #475569 !important;
    }

    .pill {
      color: #1d4ed8 !important;
      background: #fff !important;
    }

    .hero-card,
    .feature,
    .card,
    .side,
    .search,
    .empty {
      color: #0f172a;
    }

    .badge {
      color: #1d4ed8 !important;
      background: #eff6ff !important;
    }

    .read {
      color: #1d4ed8 !important;
    }

    [data-theme=dark] body {
      background: #07101d !important;
      color: #f8fafc !important;
    }

    [data-theme=dark] .hero p,
    [data-theme=dark] .section-head p,
    [data-theme=dark] .card p,
    [data-theme=dark] .side a,
    [data-theme=dark] .search-count,
    [data-theme=dark] footer {
      color: #cbd5e1 !important;
    }

    [data-theme=dark] .hero-card,
    [data-theme=dark] .feature,
    [data-theme=dark] .card,
    [data-theme=dark] .side,
    [data-theme=dark] .search,
    [data-theme=dark] .empty {
      background: #0f1a2c !important;
      color: #f8fafc !important;
      border-color: #334155 !important;
    }

    [data-theme=dark] input,
    [data-theme=dark] textarea,
    [data-theme=dark] select {
      color: #f8fafc !important;
      background: #111827 !important;
      border-color: #475569 !important;
    }

    body:has(.layout .nav) {
      color: #0f172a !important;
    }

    body:has(.layout .nav) .card,
    body:has(.layout .nav) .stat,
    body:has(.layout .nav) .item,
    body:has(.layout .nav) .nav {
      color: #0f172a;
    }

    body:has(.layout .nav) .meta,
    body:has(.layout .nav) .status,
    body:has(.layout .nav) .hint {
      color: #64748b !important;
    }

    body:has(.layout .nav) input,
    body:has(.layout .nav) textarea,
    body:has(.layout .nav) select {
      color: #0f172a !important;
      background: #fff !important;
    }

    .navlinks a,
    .btn,
    .chip,
    .badge,
    .read,
    .theme {
      overflow-wrap: normal;
      white-space: nowrap;
    }

    body.k-role-viewer .nav button[data-view="import"],
    body.k-role-viewer .nav button[data-view="editor"],
    body.k-role-viewer button[onclick*="newMaterial"],
    body.k-role-viewer button[type="submit"],
    body.k-role-viewer .edit,
    body.k-role-viewer .delete {
      display: none !important;
    }

    body.k-role-penulis .delete {
      display: none !important;
    }

    #k-user-role {
      display: inline-flex;
      align-items: center;
      padding: 5px 9px;
      border-radius: 999px;
      background: #1e293b;
      color: #dbeafe;
      font-size: 10px;
      font-weight: 900;
      border: 1px solid #334155;
    }

    #k-profile-link,
    #k-activity-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      padding: 8px 11px;
      border-radius: 9px;
      background: #ffffff14;
      color: #fff;
      border: 1px solid #ffffff33;
      font-size: 12px;
      font-weight: 800;
    }

    #k-users-shell {
      height: calc(100vh - 130px);
      min-height: 650px;
      padding: 0;
      overflow: hidden;
    }

    #k-users-frame {
      width: 100%;
      height: 100%;
      min-height: 650px;
      border: 0;
      display: block;
      background: transparent;
    }

    /* Admin rich-text editor: keep the Word-like toolbar visible and usable. */
    body:has(.layout .nav) .editor,
    body:has(.layout .nav) .editor .toolbar,
    body:has(.layout .nav) .editor .toolbar-row {
      visibility: visible !important;
      opacity: 1 !important;
    }

    body:has(.layout .nav) .editor .toolbar {
      display: block !important;
      position: sticky;
      top: 0;
      z-index: 20;
    }

    body:has(.layout .nav) .editor .toolbar-row {
      display: flex !important;
      align-items: flex-start;
    }

    body:has(.layout .nav) .editor .toolbar select,
    body:has(.layout .nav) .editor .toolbar button,
    body:has(.layout .nav) .editor .toolbar input[type="color"] {
      pointer-events: auto !important;
    }

    body:has(.layout .nav) .editor .body {
      display: block !important;
      min-height: 430px;
      background: #fff !important;
      color: #0f172a !important;
      cursor: text;
    }

    @media (max-width: 640px) {
      .hero p,
      .card p,
      .content p,
      .content li {
        line-height: 1.7 !important;
      }

      .card h3 {
        font-size: 18px !important;
      }

      #k-users-shell,
      #k-users-frame {
        min-height: 760px;
        height: calc(100vh - 100px);
      }

      body:has(.layout .nav) .editor .toolbar-row {
        gap: 6px;
      }

      body:has(.layout .nav) .editor .grp {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `;

  document.head.appendChild(style);
});

/*
 * The dashboard already contains a rich-text toolbar. This enhancement makes
 * its formatting commands reliable across browsers and ensures that the
 * font-size selector actually applies a CSS size to the current selection.
 */
window.addEventListener("DOMContentLoaded", function () {
  const editor = document.getElementById("konten");
  if (!editor || editor.dataset.kEditorEnhanced === "1") return;
  editor.dataset.kEditorEnhanced = "1";

  editor.setAttribute("contenteditable", "true");
  editor.setAttribute("spellcheck", "true");

  const focusEditor = () => {
    editor.focus();
  };

  const refreshPreview = () => {
    if (typeof window.preview === "function") {
      window.preview();
    } else {
      const live = document.getElementById("live");
      if (live) live.innerHTML = editor.innerHTML || "";
    }
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const exec = (command, value = null) => {
    focusEditor();
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      console.warn("Format command gagal:", command, e);
    }
    refreshPreview();
  };

  const applyInlineStyle = (property, value) => {
    focusEditor();
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      const span = document.createElement("span");
      span.style[property] = value;
      span.appendChild(document.createTextNode("\u200b"));
      range.insertNode(span);
      const next = document.createRange();
      next.selectNodeContents(span);
      next.collapse(false);
      selection.removeAllRanges();
      selection.addRange(next);
      refreshPreview();
      return;
    }

    const span = document.createElement("span");
    span.style[property] = value;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
    const next = document.createRange();
    next.selectNodeContents(span);
    selection.addRange(next);
    refreshPreview();
  };

  const block = document.getElementById("block");
  if (block) {
    block.onmousedown = (e) => e.preventDefault();
    block.onchange = (e) => {
      focusEditor();
      exec("formatBlock", e.target.value);
    };
  }

  const font = document.getElementById("font");
  if (font) {
    font.onmousedown = (e) => e.preventDefault();
    font.onchange = (e) => exec("fontName", e.target.value);
  }

  const size = document.getElementById("size");
  if (size) {
    size.onmousedown = (e) => e.preventDefault();
    size.onchange = (e) => {
      focusEditor();
      try {
        document.execCommand("styleWithCSS", false, true);
      } catch (_) {}
      try {
        document.execCommand("fontSize", false, "7");
        editor.querySelectorAll('font[size="7"]').forEach((node) => {
          const span = document.createElement("span");
          span.style.fontSize = e.target.value;
          span.innerHTML = node.innerHTML;
          node.replaceWith(span);
        });
      } catch (_) {
        applyInlineStyle("fontSize", e.target.value);
      }
      refreshPreview();
    };
  }

  const color = document.getElementById("color");
  if (color) {
    color.onmousedown = (e) => e.preventDefault();
    color.oninput = (e) => exec("foreColor", e.target.value);
  }

  const hilite = document.getElementById("hilite");
  if (hilite) {
    hilite.onmousedown = (e) => e.preventDefault();
    hilite.oninput = (e) => {
      focusEditor();
      try {
        document.execCommand("hiliteColor", false, e.target.value);
      } catch (_) {
        document.execCommand("backColor", false, e.target.value);
      }
      refreshPreview();
    };
  }

  document.querySelectorAll(".editor [data-cmd]").forEach((button) => {
    button.onmousedown = (e) => e.preventDefault();
    button.onclick = () => exec(button.dataset.cmd);
  });

  const clear = document.getElementById("clear");
  if (clear) {
    clear.onmousedown = (e) => e.preventDefault();
    clear.onclick = () => {
      exec("removeFormat");
      exec("unlink");
    };
  }

  /* Preserve the selection when opening prompts for link/image/table. */
  const link = document.getElementById("link");
  if (link) {
    link.onmousedown = (e) => e.preventDefault();
    link.onclick = () => {
      const url = prompt("URL tautan:", "https://");
      if (url) exec("createLink", url.trim());
    };
  }

  const image = document.getElementById("image");
  if (image) {
    image.onmousedown = (e) => e.preventDefault();
    image.onclick = () => {
      const url = prompt("URL gambar:", "https://");
      if (url) exec("insertImage", url.trim());
    };
  }

  editor.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      exec("bold");
    } else if (key === "i") {
      e.preventDefault();
      exec("italic");
    } else if (key === "u") {
      e.preventDefault();
      exec("underline");
    }
  });
});

window.addEventListener("DOMContentLoaded", async function () {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { data: staff, error } = await supabaseClient
      .from("admin_users")
      .select("role,active,display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !staff) return;

    if (!staff.active) {
      await supabaseClient.auth.signOut();

      if (/\/admin\/dashboard\.html$/i.test(location.pathname)) {
        location.replace("login.html");
      }

      return;
    }

    const role = String(staff.role || "viewer");
    document.body.classList.add("k-role-" + role);

    const top = document.querySelector(".top");

    if (top && !document.getElementById("k-user-role")) {
      const badge = document.createElement("span");
      badge.id = "k-user-role";
      badge.textContent = staff.display_name
        ? staff.display_name + " · " + roleLabel(role)
        : roleLabel(role);
      top.insertBefore(badge, top.firstChild);
    }

    if (top && !document.getElementById("k-profile-link")) {
      const p = document.createElement("a");
      p.id = "k-profile-link";
      p.href = "profile.html";
      p.textContent = "👤 Profile Saya";
      top.insertBefore(p, top.firstChild);
    }

    if (
      role === "super_admin" &&
      top &&
      !document.getElementById("k-activity-link")
    ) {
      const a = document.createElement("a");
      a.id = "k-activity-link";
      a.href = "activity.html";
      a.textContent = "📋 Aktivitas";
      top.insertBefore(a, top.firstChild);
    }

    const nav = document.querySelector(".layout .nav");
    const content = document.querySelector(".layout .content");

    if (
      role === "super_admin" &&
      nav &&
      content &&
      !document.querySelector('[data-view="users"]')
    ) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.view = "users";
      btn.textContent = "👥 Kelola User";
      btn.addEventListener("click", function () {
        if (typeof window.showView === "function") {
          window.showView("users");
        }
      });
      nav.appendChild(btn);

      const section = document.createElement("section");
      section.id = "users";
      section.className = "view";
      section.innerHTML =
        '<div id="k-users-shell" class="card">' +
        '<iframe id="k-users-frame" title="Kelola User" src="users.html"></iframe>' +
        "</div>";
      content.appendChild(section);
    }
  } catch (e) {
    console.warn("RBAC UI tidak dapat dimuat:", e);
  }
});

function roleLabel(role) {
  return (
    {
      super_admin: "Super Admin",
      admin: "Admin",
      penulis: "Penulis / Pemateri",
      viewer: "Viewer",
    }[role] || role
  );
}
