/* Kryzna Learn — image upload compatibility wrapper. */
(function () {
  const legacyPath = "supabase-config-legacy.js";
  const legacyUrl = legacyPath + "?v=20260917-image-upload-fix-3";
  document.write('<script src="' + legacyUrl + '"><\\/script>');

  document.addEventListener("click", function (event) {
    const button = event.target && event.target.closest ? event.target.closest("#image") : null;
    if (!button) return;
    const input = document.getElementById("k-image-upload-input");
    if (!input) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    input.click();
  }, true);

  const previousPrompt = window.prompt;
  window.prompt = function (message, defaultValue) {
    if (/url\s+gambar/i.test(String(message || ""))) {
      const input = document.getElementById("k-image-upload-input");
      if (input) {
        input.click();
        return defaultValue || "";
      }
    }
    return previousPrompt.call(window, message, defaultValue);
  };
})();
