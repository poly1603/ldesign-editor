/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getPluginRegistry, PluginCategory } from '../core/PluginRegistry.js';

const imageResizeStyles = `
.image-resize-overlay {
  position: absolute;
  border: 2px solid #3b82f6;
  pointer-events: none;
  z-index: 10000;
  box-sizing: border-box;
  animation: resize-overlay-show 0.15s ease-out;
}
@keyframes resize-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}
.image-resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.1s, background 0.1s;
}
.image-resize-handle:hover {
  background: #3b82f6;
  transform: scale(1.2);
}
.handle-nw { top: -6px; left: -6px; cursor: nw-resize; }
.handle-n { top: -6px; left: 50%; margin-left: -5px; cursor: n-resize; }
.handle-ne { top: -6px; right: -6px; cursor: ne-resize; }
.handle-e { top: 50%; right: -6px; margin-top: -5px; cursor: e-resize; }
.handle-se { bottom: -6px; right: -6px; cursor: se-resize; }
.handle-s { bottom: -6px; left: 50%; margin-left: -5px; cursor: s-resize; }
.handle-sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.handle-w { top: 50%; left: -6px; margin-top: -5px; cursor: w-resize; }
.image-resize-dimensions {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  pointer-events: none;
  white-space: nowrap;
}
body.image-resizing {
  user-select: none !important;
  cursor: inherit;
}
body.image-resizing * {
  cursor: inherit !important;
}
`;
function registerBuiltinPlugins() {
  const registry = getPluginRegistry();
  registry.register("bold", () => import('./formatting/index.js').then((m) => m.BoldPlugin), {
    name: "bold",
    category: PluginCategory.FORMAT,
    description: "\u7C97\u4F53"
  }, {
    enabled: true,
    priority: 100
  });
  registry.register("italic", () => import('./formatting/index.js').then((m) => m.ItalicPlugin), {
    name: "italic",
    category: PluginCategory.FORMAT,
    description: "\u659C\u4F53"
  }, {
    enabled: true,
    priority: 99
  });
  registry.register("underline", () => import('./formatting/index.js').then((m) => m.UnderlinePlugin), {
    name: "underline",
    category: PluginCategory.FORMAT,
    description: "\u4E0B\u5212\u7EBF"
  }, {
    enabled: true,
    priority: 98
  });
  registry.register("strike", () => import('./formatting/index.js').then((m) => m.StrikePlugin), {
    name: "strike",
    category: PluginCategory.FORMAT,
    description: "\u5220\u9664\u7EBF"
  }, {
    enabled: true,
    priority: 97
  });
  registry.register("textColor", () => import('./formatting/index.js').then((m) => m.TextColorPlugin), {
    name: "textColor",
    category: PluginCategory.FORMAT,
    description: "\u6587\u5B57\u989C\u8272"
  }, {
    enabled: true,
    priority: 90
  });
  registry.register("backgroundColor", () => import('./formatting/index.js').then((m) => m.BackgroundColorPlugin), {
    name: "backgroundColor",
    category: PluginCategory.FORMAT,
    description: "\u80CC\u666F\u989C\u8272"
  }, {
    enabled: true,
    priority: 89
  });
  registry.register("fontSize", () => import('./formatting/index.js').then((m) => m.FontSizePlugin), {
    name: "fontSize",
    category: PluginCategory.FORMAT,
    description: "\u5B57\u4F53\u5927\u5C0F"
  }, {
    enabled: true,
    priority: 88
  });
  registry.register("fontFamily", () => import('./formatting/index.js').then((m) => m.FontFamilyPlugin), {
    name: "fontFamily",
    category: PluginCategory.FORMAT,
    description: "\u5B57\u4F53"
  }, {
    enabled: true,
    priority: 87
  });
  registry.register("align", () => import('./formatting/index.js').then((m) => m.AlignPlugin), {
    name: "align",
    category: PluginCategory.FORMAT,
    description: "\u5BF9\u9F50\u65B9\u5F0F"
  }, {
    enabled: true,
    priority: 85
  });
  registry.register("heading", () => import('./text/index.js').then((m) => m.HeadingPlugin), {
    name: "heading",
    category: PluginCategory.BLOCK,
    description: "\u6807\u9898"
  }, {
    enabled: true,
    priority: 80
  });
  registry.register("bulletList", () => import('./text/index.js').then((m) => m.BulletListPlugin), {
    name: "bulletList",
    category: PluginCategory.BLOCK,
    description: "\u65E0\u5E8F\u5217\u8868"
  }, {
    enabled: true,
    priority: 79
  });
  registry.register("orderedList", () => import('./text/index.js').then((m) => m.OrderedListPlugin), {
    name: "orderedList",
    category: PluginCategory.BLOCK,
    description: "\u6709\u5E8F\u5217\u8868"
  }, {
    enabled: true,
    priority: 78
  });
  registry.register("taskList", () => import('./text/index.js').then((m) => m.TaskListPlugin), {
    name: "taskList",
    category: PluginCategory.BLOCK,
    description: "\u4EFB\u52A1\u5217\u8868"
  }, {
    enabled: true,
    priority: 77
  });
  registry.register("blockquote", () => import('./text/index.js').then((m) => m.BlockquotePlugin), {
    name: "blockquote",
    category: PluginCategory.BLOCK,
    description: "\u5F15\u7528"
  }, {
    enabled: true,
    priority: 76
  });
  registry.register("link", () => import('./text/index.js').then((m) => m.LinkPlugin), {
    name: "link",
    category: PluginCategory.INLINE,
    description: "\u94FE\u63A5"
  }, {
    enabled: true,
    priority: 75
  });
  registry.register("linkPreview", () => import('./text/index.js').then((m) => m.LinkPreviewPlugin), {
    name: "linkPreview",
    category: PluginCategory.TOOL,
    description: "\u94FE\u63A5\u9884\u89C8"
  }, {
    enabled: true,
    priority: 74,
    dependencies: ["link"]
  });
  registry.register("image", () => import('./media/image.js').then((m) => m.default), {
    name: "image",
    category: PluginCategory.MEDIA,
    description: "\u56FE\u7247"
  }, {
    enabled: true,
    priority: 70
  });
  registry.register("imageResize", async () => {
    injectStyles("imageResize", imageResizeStyles);
    const module = await import('./media/image-resize/index.js');
    return new module.default({
      minWidth: 50,
      minHeight: 50,
      preserveAspectRatio: true,
      showDimensions: true
    });
  }, {
    name: "imageResize",
    category: PluginCategory.MEDIA,
    description: "\u56FE\u7247\u8C03\u6574\u5927\u5C0F"
  }, {
    enabled: true,
    priority: 69,
    dependencies: ["image"]
  });
  registry.register("imageToolbar", async () => {
    const module = await import('./media/image-toolbar.js');
    return new module.default({
      position: "top",
      showAlign: true,
      showLink: true,
      showEdit: true,
      showDelete: true
    });
  }, {
    name: "imageToolbar",
    category: PluginCategory.MEDIA,
    description: "\u56FE\u7247\u5DE5\u5177\u680F"
  }, {
    enabled: true,
    priority: 68,
    dependencies: ["image"]
  });
  registry.register("imageStyleDialog", async () => {
    const module = await import('./media/image-style-dialog.js');
    return new module.default();
  }, {
    name: "imageStyleDialog",
    category: PluginCategory.MEDIA,
    description: "\u56FE\u7247\u6837\u5F0F\u5BF9\u8BDD\u6846"
  }, {
    enabled: true,
    priority: 67,
    dependencies: ["image"]
  });
  registry.register("mediaDialog", () => import('./media/media-dialog.js').then((m) => m.default), {
    name: "mediaDialog",
    category: PluginCategory.MEDIA,
    description: "\u5A92\u4F53\u5BF9\u8BDD\u6846"
  }, {
    enabled: true,
    priority: 66
  });
  registry.register("mediaCommands", () => import('./media/media-commands.js').then((m) => m.default), {
    name: "mediaCommands",
    category: PluginCategory.MEDIA,
    description: "\u5A92\u4F53\u547D\u4EE4"
  }, {
    enabled: true,
    priority: 65
  });
  registry.register("table", () => import('./table/index.js').then((m) => m.TablePlugin), {
    name: "table",
    category: PluginCategory.BLOCK,
    description: "\u8868\u683C"
  }, {
    enabled: true,
    priority: 60
  });
  registry.register("tableToolbar", () => import('./table/index.js').then((m) => m.TableToolbarPlugin), {
    name: "tableToolbar",
    category: PluginCategory.TOOL,
    description: "\u8868\u683C\u5DE5\u5177\u680F"
  }, {
    enabled: true,
    priority: 59,
    dependencies: ["table"]
  });
  registry.register("horizontalRule", () => import('./horizontal-rule/index.js').then((m) => m.HorizontalRulePlugin), {
    name: "horizontalRule",
    category: PluginCategory.BLOCK,
    description: "\u5206\u5272\u7EBF"
  }, {
    enabled: true,
    priority: 58
  });
  registry.register("codeBlock", () => import('./codeblock/index.js').then((m) => m.CodeBlockPlugin), {
    name: "codeBlock",
    category: PluginCategory.BLOCK,
    description: "\u4EE3\u7801\u5757"
  }, {
    enabled: true,
    priority: 55
  });
  registry.register("codeBlockToolbar", () => import('./codeblock/index.js').then((m) => m.CodeBlockToolbarPlugin), {
    name: "codeBlockToolbar",
    category: PluginCategory.TOOL,
    description: "\u4EE3\u7801\u5757\u5DE5\u5177\u680F"
  }, {
    enabled: true,
    priority: 54,
    dependencies: ["codeBlock"]
  });
  registry.register("inlineCode", () => import('./formatting/index.js').then((m) => m.InlineCodePlugin), {
    name: "inlineCode",
    category: PluginCategory.INLINE,
    description: "\u884C\u5185\u4EE3\u7801"
  }, {
    enabled: true,
    priority: 54
  });
  registry.register("history", () => import('./utils/history.js').then((m) => m.default), {
    name: "history",
    category: PluginCategory.TOOL,
    description: "\u5386\u53F2\u8BB0\u5F55"
  }, {
    enabled: true,
    priority: 100
  });
  registry.register("findReplace", () => import('./utils/find-replace.js').then((m) => m.default), {
    name: "findReplace",
    category: PluginCategory.TOOL,
    description: "\u67E5\u627E\u66FF\u6362"
  }, {
    enabled: true,
    priority: 50
  });
  registry.register("wordCount", () => import('./utils/word-count.js').then((m) => m.default), {
    name: "wordCount",
    category: PluginCategory.TOOL,
    description: "\u5B57\u6570\u7EDF\u8BA1"
  }, {
    enabled: true,
    priority: 49
  });
  registry.register("fullscreen", () => import('./utils/fullscreen.js').then((m) => m.default), {
    name: "fullscreen",
    category: PluginCategory.TOOL,
    description: "\u5168\u5C4F"
  }, {
    enabled: true,
    priority: 48
  });
  registry.register("exportMarkdown", () => import('./utils/export-markdown.js').then((m) => m.default), {
    name: "exportMarkdown",
    category: PluginCategory.TOOL,
    description: "\u5BFC\u51FAMarkdown"
  }, {
    enabled: true,
    priority: 47
  });
  registry.register("contextMenu", () => import('./utils/context-menu.js').then((m) => m.default), {
    name: "contextMenu",
    category: PluginCategory.TOOL,
    description: "\u53F3\u952E\u83DC\u5355"
  }, {
    enabled: true,
    priority: 46
  });
  registry.register("emoji", () => import('./emoji/index.js').then((m) => m.EmojiPlugin), {
    name: "emoji",
    category: PluginCategory.INLINE,
    description: "Emoji"
  }, {
    enabled: true,
    priority: 45,
    lazy: true
  });
  registry.register("ai", () => import('./ai/index.js').then((m) => m.default), {
    name: "ai",
    category: PluginCategory.AI,
    description: "AI \u52A9\u624B"
  }, {
    enabled: false,
    priority: 30,
    lazy: true
  });
  console.log("[PluginRegistry] Built-in plugins registered:", registry.getStats());
}
const injectedStyles = /* @__PURE__ */ new Set();
function injectStyles(name, css) {
  if (injectedStyles.has(name))
    return;
  const style = document.createElement("style");
  style.id = `ldesign-plugin-${name}-styles`;
  style.textContent = css;
  document.head.appendChild(style);
  injectedStyles.add(name);
}
const PluginPresets = {
  /** 最小配置 - 仅基础格式化 */
  minimal: ["bold", "italic", "underline", "history"],
  /** 基础配置 */
  basic: ["bold", "italic", "underline", "strike", "heading", "bulletList", "orderedList", "link", "history"],
  /** 标准配置 */
  standard: ["bold", "italic", "underline", "strike", "inlineCode", "heading", "bulletList", "orderedList", "blockquote", "link", "image", "imageResize", "mediaCommands", "textColor", "backgroundColor", "fontSize", "align", "history", "findReplace"],
  /** 完整配置 */
  full: [
    // 格式化
    "bold",
    "italic",
    "underline",
    "strike",
    "inlineCode",
    "textColor",
    "backgroundColor",
    "fontSize",
    "fontFamily",
    "align",
    // 结构
    "heading",
    "bulletList",
    "orderedList",
    "taskList",
    "blockquote",
    // 链接
    "link",
    "linkPreview",
    // 媒体
    "image",
    "imageResize",
    "imageToolbar",
    "imageStyleDialog",
    "mediaDialog",
    "mediaCommands",
    // 表格和代码
    "table",
    "tableToolbar",
    "horizontalRule",
    "codeBlock",
    "codeBlockToolbar",
    // 工具
    "history",
    "findReplace",
    "wordCount",
    "fullscreen",
    "exportMarkdown",
    "contextMenu",
    "emoji"
  ],
  /** 文档模式 */
  document: ["bold", "italic", "underline", "strike", "inlineCode", "heading", "bulletList", "orderedList", "taskList", "blockquote", "link", "image", "imageResize", "table", "horizontalRule", "codeBlock", "textColor", "fontSize", "align", "history", "findReplace", "wordCount", "exportMarkdown"],
  /** 博客模式 */
  blog: ["bold", "italic", "underline", "strike", "inlineCode", "heading", "bulletList", "orderedList", "blockquote", "link", "image", "imageResize", "imageToolbar", "mediaDialog", "codeBlock", "history", "emoji", "exportMarkdown"]
};

export { PluginPresets, registerBuiltinPlugins };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=registry.js.map
