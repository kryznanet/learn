/* Kryzna Learn — image upload compatibility wrapper. */
(function () {
  const legacyPath = "supabase-config-legacy.js";
  const legacyUrl = legacyPath + "?v=20260917-image-upload-fix-3";
  document.write('<script src="' + legacyUrl + '"><\\/script>');

  /* The dashboard has an old #image handler that calls prompt("URL gambar").
     Intercept the click at document-capture level, before that handler runs. */
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

  /* Compatibility fallback for any remaining old code that calls prompt(). */
  const previousPrompt = window.prompt;
  window.prompt = function (message, defaultValue) {
    if (/url\s+gambar/i.test(String(message || ""))) {
      const input = document.getElementById("k-image-upload-input");
      if (input) input.click();
      return null;
    }
    return previousPrompt.call(window, message, defaultValue);
  };
})();
