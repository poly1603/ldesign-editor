/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const ImagePlugin = {
  name: "image",
  install(editor) {
    if (!editor.commands.get("uploadImage")) {
      editor.commands.register("uploadImage", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e2) => {
              const url = e2.target?.result;
              const alt = file.name || "Image";
              const html = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;">`;
              if (typeof editor.insertHTML === "function")
                editor.insertHTML(html);
              else
                document.execCommand("insertHTML", false, html);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });
    }
    console.log("[ImagePlugin] Loaded");
  }
};

export { ImagePlugin, ImagePlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=image.js.map
