// Kryzna Learn — Supabase client
// Safe browser-side initialization shared by every page.
(function () {
  const url = "https://wtmkudojxenkjkoegibf.supabase.co";
  const key = "sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh";

  window.KRYZNA_SUPABASE_URL = url;

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Kryzna Learn: Supabase JS CDN belum termuat.");
    return;
  }

  // Global loading indicator for database/storage actions.
  if (!window.__kryznaLoadingHooks) {
    window.__kryznaLoadingHooks = true;
    const style = document.createElement("style");
    style.textContent = `
      #kryzna-loading{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,.28);backdrop-filter:blur(2px)}
      #kryzna-loading.show{display:flex}
      .k-loading-card{min-width:190px;padding:18px 22px;border-radius:14px;background:#fff;box-shadow:0 18px 50px rgba(15,23,42,.22);text-align:center;color:#172033;font:600 14px/1.4 Segoe UI,Arial,sans-serif}
      .k-spinner{width:30px;height:30px;margin:0 auto 10px;border:3px solid #dbeafe;border-top-color:#2563eb;border-radius:50%;animation:kspin .75s linear infinite}
      @keyframes kspin{to{transform:rotate(360deg)}}
      body.k-loading-active{cursor:wait}
    `;
    document.head.appendChild(style);
    const overlay = document.createElement("div");
    overlay.id = "kryzna-loading";
    overlay.innerHTML = '<div class="k-loading-card"><div class="k-spinner"></div><div id="k-loading-text">Memproses...</div></div>';
    document.body.appendChild(overlay);

    let active = 0, timer = null, started = 0;
    const text = document.getElementById("k-loading-text");
    const show = (label = "Memproses...") => {
      active++;
      text.textContent = label;
      if (timer) clearTimeout(timer);
      overlay.classList.add("show");
      document.body.classList.add("k-loading-active");
      if (!started) started = Date.now();
    };
    const hide = () => {
      active = Math.max(0, active - 1);
      if (active) return;
      const wait = Math.max(0, 300 - (Date.now() - started));
      timer = setTimeout(() => {
        overlay.classList.remove("show");
        document.body.classList.remove("k-loading-active");
        started = 0;
      }, wait);
    };
    window.kryznaLoading = { show, hide };

    const originalFetch = window.fetch.bind(window);
    window.fetch = function (...args) {
      const input = args[0];
      const requestUrl = typeof input === "string" ? input : (input && input.url) || "";
      const isSupabase = requestUrl.indexOf(url) === 0;
      if (!isSupabase) return originalFetch(...args);
      let label = "Memproses...";
      if (/\/storage\/v1\//i.test(requestUrl)) label = "Mengunggah file...";
      else if (/\/rest\/v1\//i.test(requestUrl)) label = "Menyimpan data...";
      show(label);
      return originalFetch(...args).finally(hide);
    };
  }

  if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });
  }

  window.KryznaSupabase = {
    client: window.supabaseClient,
    url: url,
  };

  // Compatibility for the admin editor image controls.
  if (!window.__kryznaImageHooks) {
    window.__kryznaImageHooks = true;
    document.addEventListener("click", function (event) {
      const button = event.target && event.target.closest
        ? event.target.closest("#image")
        : null;
      if (!button) return;
      const input = document.getElementById("k-image-upload-input");
      if (!input) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      input.click();
    }, true);

    const originalPrompt = window.prompt.bind(window);
    window.prompt = function (message, defaultValue) {
      if (/url\s+gambar/i.test(String(message || ""))) {
        const input = document.getElementById("k-image-upload-input");
        if (input) {
          input.click();
          return defaultValue || "";
        }
      }
      return originalPrompt(message, defaultValue);
    };
  }
})();
