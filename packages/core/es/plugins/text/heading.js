/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createPlugin } from '../../core/Plugin.js';

function setHeadingCommand(level) {
  return (state, dispatch) => {
    if (!dispatch)
      return true;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.warn("[Heading] No selection available");
      return false;
    }
    let range = selection.getRangeAt(0);
    if (range.collapsed) {
      const container = range.commonAncestorContainer;
      const block = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      if (block) {
        let blockElement = block;
        while (blockElement && !["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"].includes(blockElement.tagName)) {
          if (blockElement.parentElement)
            blockElement = blockElement.parentElement;
          else
            break;
        }
        if (blockElement) {
          range = document.createRange();
          range.selectNodeContents(blockElement);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
    let success = document.execCommand("formatBlock", false, `H${level}`);
    if (!success)
      success = document.execCommand("formatBlock", false, `<h${level}>`);
    if (!success)
      success = document.execCommand("formatBlock", false, `h${level}`);
    if (success)
      console.log(`[Heading] Successfully set heading level ${level}`);
    else
      console.warn(`[Heading] Failed to set heading level ${level}`);
    return success;
  };
}
function setParagraphCommand() {
  return (state, dispatch) => {
    if (!dispatch)
      return true;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.warn("[Heading] No selection available for paragraph");
      return false;
    }
    let range = selection.getRangeAt(0);
    if (range.collapsed) {
      const container = range.commonAncestorContainer;
      const block = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
      if (block) {
        let blockElement = block;
        while (blockElement && !["DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"].includes(blockElement.tagName)) {
          if (blockElement.parentElement)
            blockElement = blockElement.parentElement;
          else
            break;
        }
        if (blockElement) {
          range = document.createRange();
          range.selectNodeContents(blockElement);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
    let success = document.execCommand("formatBlock", false, "P");
    if (!success)
      success = document.execCommand("formatBlock", false, "<p>");
    if (!success)
      success = document.execCommand("formatBlock", false, "p");
    if (success)
      console.log("[Heading] Successfully set paragraph");
    else
      console.warn("[Heading] Failed to set paragraph");
    return success;
  };
}
function isHeadingActive(level) {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    const node = selection.anchorNode?.parentElement;
    return node?.tagName === `H${level}`;
  };
}
const HeadingPlugin = createPlugin({
  name: "heading",
  commands: {
    setHeading1: setHeadingCommand(1),
    setHeading2: setHeadingCommand(2),
    setHeading3: setHeadingCommand(3),
    setHeading4: setHeadingCommand(4),
    setHeading5: setHeadingCommand(5),
    setHeading6: setHeadingCommand(6),
    setParagraph: setParagraphCommand()
  },
  keys: {
    "Mod-Alt-1": setHeadingCommand(1),
    "Mod-Alt-2": setHeadingCommand(2),
    "Mod-Alt-3": setHeadingCommand(3),
    "Mod-Alt-4": setHeadingCommand(4),
    "Mod-Alt-5": setHeadingCommand(5),
    "Mod-Alt-6": setHeadingCommand(6),
    "Mod-Alt-0": setParagraphCommand()
  },
  toolbar: [{
    name: "heading1",
    title: "\u6807\u9898 1",
    icon: "heading-1",
    command: setHeadingCommand(1),
    active: isHeadingActive(1)
  }, {
    name: "heading2",
    title: "\u6807\u9898 2",
    icon: "heading-2",
    command: setHeadingCommand(2),
    active: isHeadingActive(2)
  }, {
    name: "heading3",
    title: "\u6807\u9898 3",
    icon: "heading-3",
    command: setHeadingCommand(3),
    active: isHeadingActive(3)
  }]
});

export { HeadingPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=heading.js.map
