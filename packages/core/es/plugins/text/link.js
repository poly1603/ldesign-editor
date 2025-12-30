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
import { showUnifiedDialog } from '../../ui/UnifiedDialog.js';

const toggleLink = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  let node = selection.anchorNode;
  let linkElement = null;
  while (node && node !== document.body) {
    if (node.nodeName === "A") {
      linkElement = node;
      break;
    }
    node = node.parentNode;
  }
  if (linkElement) {
    const text = document.createTextNode(linkElement.textContent || "");
    linkElement.parentNode?.replaceChild(text, linkElement);
  } else {
    const selectedText = selection.toString();
    showUnifiedDialog({
      title: "\u63D2\u5165\u94FE\u63A5",
      width: 500,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>`,
      fields: [{
        id: "text",
        type: "text",
        label: "\u94FE\u63A5\u6587\u672C",
        placeholder: "\u8BF7\u8F93\u5165\u94FE\u63A5\u6587\u672C",
        required: !selectedText,
        defaultValue: selectedText,
        disabled: !!selectedText
      }, {
        id: "url",
        type: "url",
        label: "\u94FE\u63A5\u5730\u5740",
        placeholder: "https://example.com",
        required: true,
        helpText: "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684URL\u5730\u5740\uFF0C\u5305\u62EC http:// \u6216 https://"
      }],
      onSubmit: (data) => {
        const text = selectedText || data.text;
        const url = data.url;
        if (selectedText) {
          document.execCommand("createLink", false, url);
        } else {
          const link = document.createElement("a");
          link.href = url;
          link.textContent = text;
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(link);
          range.setStartAfter(link);
          range.setEndAfter(link);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  }
  return true;
};
function isLinkActive() {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName === "A")
        return true;
      node = node.parentNode;
    }
    return false;
  };
}
const LinkPlugin = createPlugin({
  name: "link",
  commands: {
    toggleLink,
    insertLink: (state, dispatch) => {
      if (!dispatch)
        return true;
      const selection = window.getSelection();
      const selectedText = selection?.toString() || "";
      showUnifiedDialog({
        title: "\u63D2\u5165\u94FE\u63A5",
        width: 500,
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>`,
        fields: [{
          id: "text",
          type: "text",
          label: "\u94FE\u63A5\u6587\u672C",
          placeholder: "\u8BF7\u8F93\u5165\u94FE\u63A5\u6587\u672C",
          required: !selectedText,
          defaultValue: selectedText,
          disabled: !!selectedText
        }, {
          id: "url",
          type: "url",
          label: "\u94FE\u63A5\u5730\u5740",
          placeholder: "https://example.com",
          required: true,
          helpText: "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684URL\u5730\u5740\uFF0C\u5305\u62EC http:// \u6216 https://"
        }],
        onSubmit: (data) => {
          const text = selectedText || data.text;
          const url = data.url;
          if (selectedText) {
            document.execCommand("createLink", false, url);
          } else {
            const link = document.createElement("a");
            link.href = url;
            link.textContent = text;
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(link);
              range.setStartAfter(link);
              range.setEndAfter(link);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      });
      return true;
    },
    removeLink: (state, dispatch) => {
      if (!dispatch)
        return true;
      document.execCommand("unlink", false);
      return true;
    }
  },
  keys: {
    "Mod-K": toggleLink
  },
  toolbar: [{
    name: "link",
    title: "\u94FE\u63A5",
    icon: "link",
    command: toggleLink,
    active: isLinkActive()
  }]
});

export { LinkPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=link.js.map
