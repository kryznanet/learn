/* Kryzna Learn — Supabase compatibility configuration. */
(function () {
  const legacyPath = "supabase-config-legacy.js";
  const legacyUrl = legacyPath + "?v=20260917";
  try {
    document.write('<script src="' + legacyUrl + '"><\\/script>');
  } catch (e) {
    console.warn("Kryzna Learn: Supabase compatibility config could not load.", e);
  }
})();
