/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const FullscreenPlugin = {
  name: "Fullscreen",
  install(editor) {
    editor.commands.register("toggleFullscreen", () => {
      const element = editor.element;
      if (!element)
        return false;
      if (element.classList.contains("fullscreen")) {
        element.classList.remove("fullscreen");
        document.body.style.overflow = "";
      } else {
        element.classList.add("fullscreen");
        document.body.style.overflow = "hidden";
      }
      window.dispatchEvent(new Event("resize"));
      return true;
    });
    editor.keymap?.register({
      key: "F11",
      command: "toggleFullscreen",
      description: "Toggle fullscreen"
    });
    console.log("[FullscreenPlugin] Installed");
  }
};

export { FullscreenPlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=fullscreen.js.map
