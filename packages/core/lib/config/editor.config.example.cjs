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

const pluginConfigExample = {
  // 格式化插件
  bold: {
    enabled: true,
    priority: 100,
    lazy: false,
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 1
      },
      hotkey: "Ctrl+B"
    }
  },
  italic: {
    enabled: true,
    priority: 99,
    lazy: false,
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 2
      },
      hotkey: "Ctrl+I"
    }
  },
  underline: {
    enabled: true,
    priority: 98,
    lazy: false,
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 3
      },
      hotkey: "Ctrl+U"
    }
  },
  // 标题插件
  heading: {
    enabled: true,
    priority: 90,
    lazy: false,
    config: {
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
      toolbar: {
        visible: true,
        position: "left",
        order: 10
      }
    }
  },
  // 列表插件
  bulletList: {
    enabled: true,
    priority: 80,
    lazy: false,
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 20
      }
    }
  },
  orderedList: {
    enabled: true,
    priority: 79,
    lazy: false,
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 21
      }
    }
  },
  taskList: {
    enabled: true,
    priority: 78,
    lazy: true,
    // 懒加载
    config: {
      toolbar: {
        visible: true,
        position: "left",
        order: 22
      }
    }
  },
  // 对齐插件
  align: {
    enabled: true,
    priority: 70,
    lazy: false,
    config: {
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: "left",
      toolbar: {
        visible: true,
        position: "center",
        order: 30
      }
    }
  },
  // 媒体插件
  image: {
    enabled: true,
    priority: 60,
    lazy: true,
    // 懒加载
    config: {
      maxSize: 5 * 1024 * 1024,
      // 5MB
      allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
      enableResize: true,
      toolbar: {
        visible: true,
        position: "center",
        order: 40
      }
    }
  },
  video: {
    enabled: true,
    priority: 59,
    lazy: true,
    // 懒加载
    config: {
      maxSize: 50 * 1024 * 1024,
      // 50MB
      allowedFormats: ["mp4", "webm", "ogg"],
      toolbar: {
        visible: true,
        position: "center",
        order: 41
      }
    }
  },
  // 表格插件
  table: {
    enabled: true,
    priority: 50,
    lazy: true,
    // 懒加载
    config: {
      defaultRows: 3,
      defaultCols: 3,
      maxRows: 20,
      maxCols: 10,
      toolbar: {
        visible: true,
        position: "center",
        order: 50
      }
    }
  },
  // AI插件
  ai: {
    enabled: false,
    // 默认禁用
    priority: 40,
    lazy: true,
    // 懒加载
    dependencies: ["aiService"],
    config: {
      provider: "deepseek",
      apiKey: "",
      // 需要配置
      model: "deepseek-chat",
      toolbar: {
        visible: false,
        position: "right",
        order: 100
      }
    }
  },
  // 模板插件
  template: {
    enabled: true,
    priority: 30,
    lazy: true,
    // 懒加载
    config: {
      defaultTemplates: true,
      customTemplates: [],
      toolbar: {
        visible: true,
        position: "right",
        order: 90
      }
    }
  },
  // 代码块插件
  codeblock: {
    enabled: true,
    priority: 20,
    lazy: true,
    // 懒加载
    config: {
      languages: ["javascript", "typescript", "python", "java", "html", "css"],
      theme: "github",
      lineNumbers: true,
      toolbar: {
        visible: true,
        position: "center",
        order: 60
      }
    }
  },
  // 查找替换插件
  findReplace: {
    enabled: true,
    priority: 10,
    lazy: true,
    // 懒加载
    config: {
      caseSensitive: false,
      wholeWord: false,
      regex: false,
      toolbar: {
        visible: true,
        position: "right",
        order: 80
      }
    }
  },
  // 全屏插件
  fullscreen: {
    enabled: true,
    priority: 5,
    lazy: false,
    config: {
      hotkey: "F11",
      toolbar: {
        visible: true,
        position: "right",
        order: 95
      }
    }
  }
};
const toolbarConfigExample = {
  position: "top",
  sticky: true,
  compact: false,
  showLabels: false,
  lazyLoad: true,
  groups: [{
    name: "history",
    label: "\u5386\u53F2",
    items: ["undo", "redo"],
    visible: true,
    order: 0
  }, {
    name: "format",
    label: "\u683C\u5F0F",
    items: ["bold", "italic", "underline", "strikethrough", "code"],
    visible: true,
    order: 1
  }, {
    name: "heading",
    label: "\u6807\u9898",
    items: ["heading"],
    visible: true,
    order: 2
  }, {
    name: "list",
    label: "\u5217\u8868",
    items: ["bulletList", "orderedList", "taskList"],
    visible: true,
    order: 3
  }, {
    name: "align",
    label: "\u5BF9\u9F50",
    items: ["align"],
    visible: true,
    order: 4
  }, {
    name: "media",
    label: "\u5A92\u4F53",
    items: ["image", "video", "table"],
    visible: true,
    order: 5
  }, {
    name: "insert",
    label: "\u63D2\u5165",
    items: ["link", "emoji", "horizontalRule"],
    visible: true,
    order: 6
  }, {
    name: "tools",
    label: "\u5DE5\u5177",
    items: ["findReplace", "wordCount", "fullscreen"],
    visible: true,
    order: 7
  }, {
    name: "ai",
    label: "AI",
    items: ["ai"],
    visible: false,
    // 默认隐藏
    order: 8
  }]
};
const performanceConfigExample = {
  // 懒加载配置
  lazyLoad: {
    enabled: true,
    threshold: 0.1,
    // 10%可见时加载
    rootMargin: "50px"
  },
  // 虚拟滚动配置
  virtualScroll: {
    enabled: false,
    // 大文档时启用
    itemHeight: 24,
    bufferSize: 10
  },
  // 防抖配置
  debounce: {
    input: 300,
    // 输入防抖300ms
    resize: 150,
    // 调整大小防抖150ms
    scroll: 100
    // 滚动防抖100ms
  },
  // 节流配置
  throttle: {
    render: 16,
    // 渲染节流16ms (60fps)
    update: 100
    // 更新节流100ms
  },
  // 缓存配置
  cache: {
    enabled: true,
    maxSize: 1e3,
    // 最大缓存条目
    ttl: 36e5
    // 缓存过期时间1小时
  },
  // 事件配置
  events: {
    maxListeners: 100,
    // 最大监听器数量
    enablePriority: true,
    // 启用优先级
    asyncEmit: false
    // 异步发射
  },
  // 监控配置
  monitoring: {
    enabled: true,
    reportInterval: 3e4,
    // 30秒报告一次
    metrics: ["fps", "memory", "loadTime", "renderTime"]
  }
};
const editorConfigExample = {
  // 基础配置
  element: "#editor",
  content: "",
  editable: true,
  // 插件配置
  plugins: pluginConfigExample,
  // 工具栏配置
  toolbar: toolbarConfigExample,
  // 性能配置
  performance: performanceConfigExample,
  // 图标配置
  icons: {
    defaultSet: "lucide",
    enableCache: true
  },
  // 主题配置
  theme: {
    defaultTheme: "light",
    followSystem: true
  },
  // 多语言配置
  i18n: {
    defaultLocale: "zh-CN",
    fallbackLocale: "en-US"
  },
  // 自动保存配置
  autoSave: {
    enabled: true,
    interval: 3e4,
    // 30秒
    storage: "localStorage"
  },
  // 协作配置
  collaboration: {
    enabled: false,
    serverUrl: "",
    roomId: ""
  }
};
const lightweightConfig = {
  ...editorConfigExample,
  plugins: {
    // 只启用核心插件
    bold: {
      enabled: true,
      lazy: false
    },
    italic: {
      enabled: true,
      lazy: false
    },
    underline: {
      enabled: true,
      lazy: false
    },
    heading: {
      enabled: true,
      lazy: false
    },
    bulletList: {
      enabled: true,
      lazy: false
    },
    orderedList: {
      enabled: true,
      lazy: false
    },
    // 其他插件全部懒加载
    image: {
      enabled: true,
      lazy: true
    },
    link: {
      enabled: true,
      lazy: true
    },
    table: {
      enabled: true,
      lazy: true
    }
  },
  toolbar: {
    ...toolbarConfigExample,
    compact: true,
    showLabels: false,
    lazyLoad: true
  },
  performance: {
    ...performanceConfigExample,
    virtualScroll: {
      enabled: true
    }
  }
};
const fullFeaturedConfig = {
  ...editorConfigExample,
  plugins: {
    ...pluginConfigExample,
    // 启用所有插件
    ai: {
      enabled: true,
      lazy: true
    },
    collaboration: {
      enabled: true,
      lazy: true
    }
  },
  toolbar: {
    ...toolbarConfigExample,
    compact: false,
    showLabels: true,
    groups: [...toolbarConfigExample.groups, {
      name: "advanced",
      label: "\u9AD8\u7EA7",
      items: ["ai", "collaboration", "export"],
      visible: true,
      order: 9
    }]
  }
};

exports.editorConfigExample = editorConfigExample;
exports.fullFeaturedConfig = fullFeaturedConfig;
exports.lightweightConfig = lightweightConfig;
exports.performanceConfigExample = performanceConfigExample;
exports.pluginConfigExample = pluginConfigExample;
exports.toolbarConfigExample = toolbarConfigExample;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=editor.config.example.cjs.map
