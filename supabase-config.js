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
