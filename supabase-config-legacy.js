// Konfigurasi Supabase untuk Kryzna Learn
// Publishable key aman digunakan di browser. Jangan pernah memasukkan
// service_role/secret key di sini.
const SUPABASE_URL = "https://wtmkudojxenkjkoegibf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_nk3PzGU0x2nEvku4g2mXTg_c82iN9jh";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: window.localStorage },
});
window.supabaseClient = supabaseClient;

/* Prevent the old dashboard inline handler from opening the URL-image prompt. */
(function blockLegacyImagePrompt(){
  const originalPrompt = window.prompt;
  window.prompt = function(message, defaultValue){
    if (/url\s+gambar/i.test(String(message || ""))) return null;
    return originalPrompt.call(window, message, defaultValue);
  };
})();
