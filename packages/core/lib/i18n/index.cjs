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

var event = require('../utils/event.cjs');

class I18nManager extends event.EventEmitter {
  constructor(config) {
    super();
    this.messages = /* @__PURE__ */ new Map();
    this.loadedLocales = /* @__PURE__ */ new Set();
    this.currentLocale = config?.defaultLocale || "zh-CN";
    this.fallbackLocale = config?.fallbackLocale || "en-US";
    if (config?.messages) {
      Object.entries(config.messages).forEach(([locale, messages]) => {
        this.addMessages(locale, messages);
      });
    }
    this.loadBuiltinLocales();
  }
  /**
   * 加载内置语言包
   */
  loadBuiltinLocales() {
    this.addMessages("zh-CN", {
      editor: {
        toolbar: {
          bold: "\u52A0\u7C97",
          italic: "\u659C\u4F53",
          underline: "\u4E0B\u5212\u7EBF",
          strikethrough: "\u5220\u9664\u7EBF",
          heading: "\u6807\u9898",
          paragraph: "\u6BB5\u843D",
          blockquote: "\u5F15\u7528",
          codeBlock: "\u4EE3\u7801\u5757",
          bulletList: "\u65E0\u5E8F\u5217\u8868",
          orderedList: "\u6709\u5E8F\u5217\u8868",
          taskList: "\u4EFB\u52A1\u5217\u8868",
          link: "\u94FE\u63A5",
          image: "\u56FE\u7247",
          video: "\u89C6\u9891",
          table: "\u8868\u683C",
          horizontalRule: "\u5206\u5272\u7EBF",
          undo: "\u64A4\u9500",
          redo: "\u91CD\u505A",
          alignLeft: "\u5DE6\u5BF9\u9F50",
          alignCenter: "\u5C45\u4E2D\u5BF9\u9F50",
          alignRight: "\u53F3\u5BF9\u9F50",
          alignJustify: "\u4E24\u7AEF\u5BF9\u9F50",
          indent: "\u589E\u52A0\u7F29\u8FDB",
          outdent: "\u51CF\u5C11\u7F29\u8FDB",
          textColor: "\u6587\u5B57\u989C\u8272",
          backgroundColor: "\u80CC\u666F\u989C\u8272",
          fontSize: "\u5B57\u53F7",
          fontFamily: "\u5B57\u4F53",
          lineHeight: "\u884C\u9AD8",
          fullscreen: "\u5168\u5C4F",
          findReplace: "\u67E5\u627E\u66FF\u6362",
          ai: "AI \u52A9\u624B",
          template: "\u6A21\u677F",
          export: "\u5BFC\u51FA",
          print: "\u6253\u5370",
          help: "\u5E2E\u52A9"
        },
        dialog: {
          confirm: "\u786E\u5B9A",
          cancel: "\u53D6\u6D88",
          close: "\u5173\u95ED",
          save: "\u4FDD\u5B58",
          delete: "\u5220\u9664",
          edit: "\u7F16\u8F91",
          insert: "\u63D2\u5165",
          upload: "\u4E0A\u4F20",
          browse: "\u6D4F\u89C8"
        },
        placeholder: {
          search: "\u641C\u7D22...",
          find: "\u67E5\u627E\u5185\u5BB9",
          replace: "\u66FF\u6362\u4E3A",
          url: "\u8F93\u5165\u94FE\u63A5\u5730\u5740",
          imageUrl: "\u8F93\u5165\u56FE\u7247\u5730\u5740",
          videoUrl: "\u8F93\u5165\u89C6\u9891\u5730\u5740",
          altText: "\u66FF\u4EE3\u6587\u672C",
          title: "\u6807\u9898",
          width: "\u5BBD\u5EA6",
          height: "\u9AD8\u5EA6"
        },
        message: {
          success: "\u64CD\u4F5C\u6210\u529F",
          error: "\u64CD\u4F5C\u5931\u8D25",
          warning: "\u8B66\u544A",
          info: "\u63D0\u793A",
          loading: "\u52A0\u8F7D\u4E2D...",
          copySuccess: "\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
          copyError: "\u590D\u5236\u5931\u8D25",
          saveSuccess: "\u4FDD\u5B58\u6210\u529F",
          saveError: "\u4FDD\u5B58\u5931\u8D25",
          deleteConfirm: "\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F",
          unsavedChanges: "\u6709\u672A\u4FDD\u5B58\u7684\u66F4\u6539\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F"
        },
        ai: {
          title: "AI \u52A9\u624B",
          optimize: "\u4F18\u5316\u6587\u672C",
          translate: "\u7FFB\u8BD1",
          summarize: "\u603B\u7ED3",
          expand: "\u6269\u5199",
          shorten: "\u7F29\u5199",
          fixGrammar: "\u4FEE\u6B63\u8BED\u6CD5",
          changeTone: "\u6539\u53D8\u8BED\u6C14",
          generateIdeas: "\u751F\u6210\u521B\u610F",
          loading: "AI \u6B63\u5728\u601D\u8003...",
          error: "AI \u670D\u52A1\u51FA\u9519"
        }
      }
    });
    this.addMessages("en-US", {
      editor: {
        toolbar: {
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          strikethrough: "Strikethrough",
          heading: "Heading",
          paragraph: "Paragraph",
          blockquote: "Blockquote",
          codeBlock: "Code Block",
          bulletList: "Bullet List",
          orderedList: "Ordered List",
          taskList: "Task List",
          link: "Link",
          image: "Image",
          video: "Video",
          table: "Table",
          horizontalRule: "Horizontal Rule",
          undo: "Undo",
          redo: "Redo",
          alignLeft: "Align Left",
          alignCenter: "Align Center",
          alignRight: "Align Right",
          alignJustify: "Justify",
          indent: "Indent",
          outdent: "Outdent",
          textColor: "Text Color",
          backgroundColor: "Background Color",
          fontSize: "Font Size",
          fontFamily: "Font Family",
          lineHeight: "Line Height",
          fullscreen: "Fullscreen",
          findReplace: "Find & Replace",
          ai: "AI Assistant",
          template: "Template",
          export: "Export",
          print: "Print",
          help: "Help"
        },
        dialog: {
          confirm: "OK",
          cancel: "Cancel",
          close: "Close",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          insert: "Insert",
          upload: "Upload",
          browse: "Browse"
        },
        placeholder: {
          search: "Search...",
          find: "Find",
          replace: "Replace with",
          url: "Enter URL",
          imageUrl: "Enter image URL",
          videoUrl: "Enter video URL",
          altText: "Alt text",
          title: "Title",
          width: "Width",
          height: "Height"
        },
        message: {
          success: "Success",
          error: "Error",
          warning: "Warning",
          info: "Info",
          loading: "Loading...",
          copySuccess: "Copied to clipboard",
          copyError: "Failed to copy",
          saveSuccess: "Saved successfully",
          saveError: "Failed to save",
          deleteConfirm: "Are you sure to delete?",
          unsavedChanges: "You have unsaved changes. Continue?"
        },
        ai: {
          title: "AI Assistant",
          optimize: "Optimize Text",
          translate: "Translate",
          summarize: "Summarize",
          expand: "Expand",
          shorten: "Shorten",
          fixGrammar: "Fix Grammar",
          changeTone: "Change Tone",
          generateIdeas: "Generate Ideas",
          loading: "AI is thinking...",
          error: "AI service error"
        }
      }
    });
    this.addMessages("ja-JP", {
      editor: {
        toolbar: {
          bold: "\u592A\u5B57",
          italic: "\u659C\u4F53",
          underline: "\u4E0B\u7DDA",
          strikethrough: "\u53D6\u308A\u6D88\u3057\u7DDA",
          heading: "\u898B\u51FA\u3057",
          paragraph: "\u6BB5\u843D",
          blockquote: "\u5F15\u7528",
          codeBlock: "\u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF",
          bulletList: "\u7B87\u6761\u66F8\u304D",
          orderedList: "\u756A\u53F7\u4ED8\u304D\u30EA\u30B9\u30C8",
          taskList: "\u30BF\u30B9\u30AF\u30EA\u30B9\u30C8",
          link: "\u30EA\u30F3\u30AF",
          image: "\u753B\u50CF",
          video: "\u52D5\u753B",
          table: "\u8868",
          horizontalRule: "\u6C34\u5E73\u7DDA",
          undo: "\u5143\u306B\u623B\u3059",
          redo: "\u3084\u308A\u76F4\u3059",
          alignLeft: "\u5DE6\u63C3\u3048",
          alignCenter: "\u4E2D\u592E\u63C3\u3048",
          alignRight: "\u53F3\u63C3\u3048",
          alignJustify: "\u4E21\u7AEF\u63C3\u3048",
          indent: "\u30A4\u30F3\u30C7\u30F3\u30C8",
          outdent: "\u30A4\u30F3\u30C7\u30F3\u30C8\u89E3\u9664",
          textColor: "\u6587\u5B57\u8272",
          backgroundColor: "\u80CC\u666F\u8272",
          fontSize: "\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA",
          fontFamily: "\u30D5\u30A9\u30F3\u30C8",
          lineHeight: "\u884C\u306E\u9AD8\u3055",
          fullscreen: "\u5168\u753B\u9762",
          findReplace: "\u691C\u7D22\u3068\u7F6E\u63DB",
          ai: "AI\u30A2\u30B7\u30B9\u30BF\u30F3\u30C8",
          template: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8",
          export: "\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8",
          print: "\u5370\u5237",
          help: "\u30D8\u30EB\u30D7"
        },
        dialog: {
          confirm: "OK",
          cancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
          close: "\u9589\u3058\u308B",
          save: "\u4FDD\u5B58",
          delete: "\u524A\u9664",
          edit: "\u7DE8\u96C6",
          insert: "\u633F\u5165",
          upload: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
          browse: "\u53C2\u7167"
        },
        placeholder: {
          search: "\u691C\u7D22...",
          find: "\u691C\u7D22",
          replace: "\u7F6E\u63DB",
          url: "URL\u3092\u5165\u529B",
          imageUrl: "\u753B\u50CFURL\u3092\u5165\u529B",
          videoUrl: "\u52D5\u753BURL\u3092\u5165\u529B",
          altText: "\u4EE3\u66FF\u30C6\u30AD\u30B9\u30C8",
          title: "\u30BF\u30A4\u30C8\u30EB",
          width: "\u5E45",
          height: "\u9AD8\u3055"
        },
        message: {
          success: "\u6210\u529F",
          error: "\u30A8\u30E9\u30FC",
          warning: "\u8B66\u544A",
          info: "\u60C5\u5831",
          loading: "\u8AAD\u307F\u8FBC\u307F\u4E2D...",
          copySuccess: "\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u306B\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",
          copyError: "\u30B3\u30D4\u30FC\u306B\u5931\u6557\u3057\u307E\u3057\u305F",
          saveSuccess: "\u4FDD\u5B58\u3057\u307E\u3057\u305F",
          saveError: "\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F",
          deleteConfirm: "\u524A\u9664\u3057\u3066\u3082\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
          unsavedChanges: "\u672A\u4FDD\u5B58\u306E\u5909\u66F4\u304C\u3042\u308A\u307E\u3059\u3002\u7D9A\u884C\u3057\u307E\u3059\u304B\uFF1F"
        },
        ai: {
          title: "AI\u30A2\u30B7\u30B9\u30BF\u30F3\u30C8",
          optimize: "\u30C6\u30AD\u30B9\u30C8\u3092\u6700\u9069\u5316",
          translate: "\u7FFB\u8A33",
          summarize: "\u8981\u7D04",
          expand: "\u62E1\u5F35",
          shorten: "\u77ED\u7E2E",
          fixGrammar: "\u6587\u6CD5\u3092\u4FEE\u6B63",
          changeTone: "\u30C8\u30FC\u30F3\u3092\u5909\u66F4",
          generateIdeas: "\u30A2\u30A4\u30C7\u30A2\u3092\u751F\u6210",
          loading: "AI\u304C\u8003\u3048\u3066\u3044\u307E\u3059...",
          error: "AI\u30B5\u30FC\u30D3\u30B9\u30A8\u30E9\u30FC"
        }
      }
    });
  }
  /**
   * 添加语言包
   */
  addMessages(locale, messages) {
    this.messages.set(locale, messages);
    this.loadedLocales.add(locale);
  }
  /**
   * 动态加载语言包
   */
  async loadLocale(locale) {
    if (this.loadedLocales.has(locale))
      return;
    try {
      const messages = await import(`./locales/${locale}.json`);
      this.addMessages(locale, messages.default);
    } catch (error) {
      console.error(`Failed to load locale: ${locale}`, error);
    }
  }
  /**
   * 切换语言
   */
  async setLocale(locale) {
    if (!this.loadedLocales.has(locale))
      await this.loadLocale(locale);
    const oldLocale = this.currentLocale;
    this.currentLocale = locale;
    this.emit("localeChange", {
      oldLocale,
      newLocale: locale
    });
  }
  /**
   * 获取当前语言
   */
  getLocale() {
    return this.currentLocale;
  }
  /**
   * 获取支持的语言列表
   */
  getAvailableLocales() {
    return Array.from(this.loadedLocales);
  }
  /**
   * 翻译文本
   */
  t(key, params) {
    const keys = key.split(".");
    let message = this.getMessage(this.currentLocale, keys);
    if (!message && this.currentLocale !== this.fallbackLocale)
      message = this.getMessage(this.fallbackLocale, keys);
    if (!message)
      return key;
    if (params && typeof message === "string") {
      Object.entries(params).forEach(([param, value]) => {
        message = message.replace(`{${param}}`, String(value));
      });
    }
    return message;
  }
  /**
   * 获取消息
   */
  getMessage(locale, keys) {
    const messages = this.messages.get(locale);
    if (!messages)
      return void 0;
    let current = messages;
    for (const key of keys) {
      if (current[key] === void 0)
        return void 0;
      current = current[key];
    }
    return typeof current === "string" ? current : void 0;
  }
  /**
   * 检查是否有某个翻译键
   */
  has(key) {
    const keys = key.split(".");
    return !!this.getMessage(this.currentLocale, keys);
  }
}
let i18nInstance = null;
function getI18n(config) {
  if (!i18nInstance)
    i18nInstance = new I18nManager(config);
  return i18nInstance;
}
function t(key, params) {
  return getI18n().t(key, params);
}

exports.I18nManager = I18nManager;
exports.getI18n = getI18n;
exports.t = t;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
