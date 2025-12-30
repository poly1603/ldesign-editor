/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

const blogPreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light",
    followSystem: true
  },
  i18n: {
    defaultLocale: "zh-CN",
    fallbackLocale: "en-US"
  },
  // 启用功能
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "underline", "strikethrough", "heading", "paragraph", "blockquote", "bullet-list", "ordered-list", "link", "image", "codeblock", "horizontal-rule", "emoji", "word-count"],
    disabled: ["video", "audio", "file", "table", "ai-service", "collaboration", "version-control"]
  }
};
const cmsPreset = {
  icons: {
    defaultSet: "material",
    enableCache: true
  },
  theme: {
    defaultTheme: "light",
    customThemes: []
  },
  i18n: {
    defaultLocale: "zh-CN"
  },
  features: {
    enabled: [
      // 所有格式化功能
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "subscript",
      "superscript",
      "text-color",
      "background-color",
      "font-size",
      "font-family",
      "line-height",
      // 所有插入功能
      "heading",
      "paragraph",
      "blockquote",
      "codeblock",
      "bullet-list",
      "ordered-list",
      "task-list",
      // 媒体
      "link",
      "image",
      "video",
      "table",
      // 工具
      "find-replace",
      "word-count",
      "fullscreen",
      "export",
      "template"
    ],
    disabled: ["audio", "file", "ai-service", "collaboration"]
  }
};
const collaborationPreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light",
    followSystem: false
  },
  i18n: {
    defaultLocale: "zh-CN"
  },
  features: {
    enabled: [
      // 完整功能
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "heading",
      "paragraph",
      "blockquote",
      "bullet-list",
      "ordered-list",
      "task-list",
      "link",
      "image",
      "table",
      "find-replace",
      "word-count",
      "template",
      "emoji",
      // 高级功能
      "collaboration",
      "version-control",
      "comments"
    ]
  }
};
const markdownPreset = {
  icons: {
    defaultSet: "feather",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  i18n: {
    defaultLocale: "en-US"
  },
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "strikethrough", "code", "heading", "paragraph", "blockquote", "codeblock", "bullet-list", "ordered-list", "task-list", "link", "image", "horizontal-rule", "table", "emoji"],
    disabled: ["text-color", "background-color", "font-size", "font-family", "video", "audio", "ai-service"]
  }
};
const notePreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light",
    followSystem: true
  },
  i18n: {
    defaultLocale: "zh-CN"
  },
  autoSave: true,
  autoSaveInterval: 1e4,
  // 10秒自动保存
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "underline", "strikethrough", "code", "text-color", "background-color", "heading", "paragraph", "blockquote", "bullet-list", "ordered-list", "task-list", "link", "image", "codeblock", "horizontal-rule", "table", "template", "emoji", "find-replace", "word-count"]
  }
};
const emailPreset = {
  icons: {
    defaultSet: "material",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "underline", "text-color", "background-color", "font-size", "font-family", "paragraph", "blockquote", "bullet-list", "ordered-list", "link", "image"],
    disabled: ["heading", "codeblock", "video", "audio", "table", "ai-service"]
  }
};
const commentPreset = {
  icons: {
    defaultSet: "feather",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: ["basic-editing", "selection", "bold", "italic", "code", "link", "emoji"],
    disabled: [
      // 禁用大部分功能
      "heading",
      "blockquote",
      "codeblock",
      "bullet-list",
      "ordered-list",
      "image",
      "video",
      "table",
      "ai-service"
    ]
  }
};
const mobilePreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light",
    followSystem: true
  },
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "heading", "paragraph", "bullet-list", "ordered-list", "link", "image", "emoji"]
  }
};
const richTextPreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: [
      // 完整格式化
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "subscript",
      "superscript",
      "text-color",
      "background-color",
      "font-size",
      "font-family",
      "line-height",
      // 完整插入
      "heading",
      "paragraph",
      "blockquote",
      "codeblock",
      "bullet-list",
      "ordered-list",
      "task-list",
      "horizontal-rule",
      // 完整媒体
      "link",
      "image",
      "video",
      // 表格
      "table",
      "table-row",
      "table-column",
      "table-cell",
      // 工具
      "find-replace",
      "word-count",
      "fullscreen",
      "export",
      "template",
      "emoji"
    ]
  }
};
const aiEnhancedPreset = {
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: [
      // 基础功能
      "basic-editing",
      "selection",
      "history",
      "bold",
      "italic",
      "underline",
      "heading",
      "paragraph",
      "blockquote",
      "bullet-list",
      "ordered-list",
      "link",
      "image",
      // AI功能全开
      "ai-service",
      "ai-correct",
      "ai-complete",
      "ai-rewrite",
      "ai-translate",
      // 工具
      "word-count",
      "template"
    ]
  }
};
const codeDocPreset = {
  icons: {
    defaultSet: "feather",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: ["basic-editing", "selection", "history", "bold", "italic", "code", "heading", "paragraph", "blockquote", "codeblock", "bullet-list", "ordered-list", "task-list", "link", "image", "table", "horizontal-rule", "find-replace", "word-count", "template"]
  }
};
const minimalPreset = {
  icons: {
    defaultSet: "feather",
    enableCache: true
  },
  theme: {
    defaultTheme: "light"
  },
  features: {
    enabled: ["basic-editing", "selection", "bold", "italic", "link"]
  }
};
const presets = {
  blog: blogPreset,
  cms: cmsPreset,
  collaboration: collaborationPreset,
  markdown: markdownPreset,
  note: notePreset,
  email: emailPreset,
  comment: commentPreset,
  mobile: mobilePreset,
  richText: richTextPreset,
  aiEnhanced: aiEnhancedPreset,
  codeDoc: codeDocPreset,
  minimal: minimalPreset
};
function getPreset(name) {
  return presets[name];
}
function getPresetNames() {
  return Object.keys(presets);
}
const presetDescriptions = {
  blog: {
    name: "\u535A\u5BA2\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u4E2A\u4EBA\u535A\u5BA2\u548C\u6587\u7AE0\u5199\u4F5C\uFF0C\u5305\u542B\u57FA\u7840\u683C\u5F0F\u5316\u548C\u5A92\u4F53\u529F\u80FD",
    icon: "\u{1F4DD}"
  },
  cms: {
    name: "CMS\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u5185\u5BB9\u7BA1\u7406\u7CFB\u7EDF\uFF0C\u529F\u80FD\u5B8C\u6574\uFF0C\u652F\u6301\u9AD8\u7EA7\u683C\u5F0F\u5316\u548C\u5A92\u4F53",
    icon: "\u{1F3E2}"
  },
  collaboration: {
    name: "\u534F\u4F5C\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u56E2\u961F\u534F\u4F5C\uFF0C\u652F\u6301\u5B9E\u65F6\u534F\u4F5C\u3001\u7248\u672C\u63A7\u5236\u548C\u8BC4\u8BBA",
    icon: "\u{1F465}"
  },
  markdown: {
    name: "Markdown\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u6280\u672F\u6587\u6863\uFF0C\u4E13\u6CE8Markdown\u8BED\u6CD5\u548C\u4EE3\u7801\u5757",
    icon: "\u{1F4C4}"
  },
  note: {
    name: "\u7B14\u8BB0\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u4E2A\u4EBA\u7B14\u8BB0\u548C\u77E5\u8BC6\u7BA1\u7406\uFF0C\u652F\u6301\u81EA\u52A8\u4FDD\u5B58",
    icon: "\u{1F4D2}"
  },
  email: {
    name: "\u90AE\u4EF6\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u90AE\u4EF6\u5BA2\u6237\u7AEF\uFF0C\u7B80\u5316\u7684\u683C\u5F0F\u5316\u529F\u80FD",
    icon: "\u2709\uFE0F"
  },
  comment: {
    name: "\u8BC4\u8BBA\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u8BC4\u8BBA\u6846\u548C\u53CD\u9988\u8868\u5355\uFF0C\u6700\u7B80\u529F\u80FD\u96C6",
    icon: "\u{1F4AC}"
  },
  mobile: {
    name: "\u79FB\u52A8\u7AEF\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u624B\u673A\u548C\u5E73\u677F\uFF0C\u4F18\u5316\u89E6\u6478\u64CD\u4F5C",
    icon: "\u{1F4F1}"
  },
  richText: {
    name: "\u5BCC\u6587\u672C\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u9875\u9762\u7F16\u8F91\u5668\uFF0C\u5B8C\u6574\u7684WYSIWYG\u529F\u80FD",
    icon: "\u{1F3A8}"
  },
  aiEnhanced: {
    name: "AI\u589E\u5F3A\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u5185\u5BB9\u521B\u4F5C\uFF0C\u96C6\u6210AI\u8F85\u52A9\u5199\u4F5C\u529F\u80FD",
    icon: "\u{1F916}"
  },
  codeDoc: {
    name: "\u4EE3\u7801\u6587\u6863\u7F16\u8F91\u5668",
    description: "\u9002\u5408API\u6587\u6863\u548C\u6280\u672F\u8BF4\u660E\uFF0C\u4F18\u5316\u4EE3\u7801\u5C55\u793A",
    icon: "\u{1F4BB}"
  },
  minimal: {
    name: "\u6700\u5C0F\u5316\u7F16\u8F91\u5668",
    description: "\u9002\u5408\u5D4C\u5165\u5F0F\u573A\u666F\uFF0C\u53EA\u5305\u542B\u6700\u57FA\u672C\u529F\u80FD",
    icon: "\u{1F539}"
  }
};

exports.aiEnhancedPreset = aiEnhancedPreset;
exports.blogPreset = blogPreset;
exports.cmsPreset = cmsPreset;
exports.codeDocPreset = codeDocPreset;
exports.collaborationPreset = collaborationPreset;
exports.commentPreset = commentPreset;
exports.emailPreset = emailPreset;
exports.getPreset = getPreset;
exports.getPresetNames = getPresetNames;
exports.markdownPreset = markdownPreset;
exports.minimalPreset = minimalPreset;
exports.mobilePreset = mobilePreset;
exports.notePreset = notePreset;
exports.presetDescriptions = presetDescriptions;
exports.presets = presets;
exports.richTextPreset = richTextPreset;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
