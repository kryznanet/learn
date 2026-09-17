// Kryzna Learn — Supabase client
// This file is intentionally self-contained so every page gets the same client.
const SUPABASE_URL = "https://wtmkudojxenkjkoegibf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh";

if (!window.supabase || typeof window.supabase.createClient !== "function") {
  throw new Error("Supabase JS belum termuat. Pastikan CDN @supabase/supabase-js dapat diakses.");
}

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

// Expose the client explicitly for pages that load this config.
window.supabaseClient = supabaseClient;
window.KryznaSupabase = {
  client: supabaseClient,
  url: SUPABASE_URL,
};

// Compatibility for the admin editor's image upload controls.
document.addEventListener(
  "click",
  function (event) {
    const button = event.target?.closest?.("#image");
    if (!button) return;
    const input = document.getElementById("k-image-upload-input");
    if (!input) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    input.click();
  },
  true,
);

const kryznaOriginalPrompt = window.prompt.bind(window);
window.prompt = function (message, defaultValue) {
  if (/url\s+gambar/i.test(String(message || ""))) {
    const input = document.getElementById("k-image-upload-input");
    if (input) {
      input.click();
      return defaultValue || "";
    }
  }
  return kryznaOriginalPrompt(message, defaultValue);
};
