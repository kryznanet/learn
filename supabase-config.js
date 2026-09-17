/* Kryzna Learn — image upload compatibility wrapper.
   Keep the complete existing configuration in a versioned legacy copy, then
   make the old "URL gambar" handler open the computer file picker instead. */
(function () {
  const legacyPath = "supabase-config-legacy.js";
  const legacyUrl = legacyPath + "?v=20260917-image-upload-fix";
  document.write('<script src="' + legacyUrl + '"><\\/script>');

  const previousPrompt = window.prompt;
  window.prompt = function (message, defaultValue) {
    if (/url\\s+gambar/i.test(String(message || ""))) {
      const input = document.getElementById("k-image-upload-input");
      if (input) {
        input.click();
      }
      return null;
    }
    return previousPrompt.call(window, message, defaultValue);
  };
})();
