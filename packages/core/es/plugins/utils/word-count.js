/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const WordCountPlugin = {
  name: "WordCount",
  install(editor) {
    let countElement = null;
    function createCountElement() {
      const div = document.createElement("div");
      div.className = "word-count-status";
      div.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
      `;
      document.body.appendChild(div);
      return div;
    }
    function countWords(text) {
      const cleanText = text.replace(/<[^>]*>/g, "").trim();
      const words = cleanText.match(/\S+/g) || [];
      const chars = cleanText.length;
      const charsNoSpaces = cleanText.replace(/\s/g, "").length;
      return {
        words: words.length,
        chars,
        charsNoSpaces
      };
    }
    function updateCount() {
      const content = editor.getHTML();
      const stats = countWords(content);
      if (!countElement)
        countElement = createCountElement();
      countElement.innerHTML = `
        Words: ${stats.words} | 
        Chars: ${stats.chars} | 
        Chars (no spaces): ${stats.charsNoSpaces}
      `;
    }
    editor.commands.register("toggleWordCount", () => {
      if (countElement)
        countElement.style.display = countElement.style.display === "none" ? "block" : "none";
      else
        updateCount();
      return true;
    });
    editor.on("input", () => {
      if (countElement && countElement.style.display !== "none")
        updateCount();
    });
    console.log("[WordCountPlugin] Installed");
  }
};

export { WordCountPlugin as default };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=word-count.js.map
