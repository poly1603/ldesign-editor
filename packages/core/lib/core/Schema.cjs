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

class Schema {
  constructor(spec) {
    this.nodes = new Map(Object.entries(spec.nodes || {}));
    this.marks = new Map(Object.entries(spec.marks || {}));
  }
  /**
   * 获取节点规范
   */
  getNodeSpec(type) {
    return this.nodes.get(type);
  }
  /**
   * 获取标记规范
   */
  getMarkSpec(type) {
    return this.marks.get(type);
  }
  /**
   * 检查节点类型是否有效
   */
  hasNode(type) {
    return this.nodes.has(type);
  }
  /**
   * 检查标记类型是否有效
   */
  hasMark(type) {
    return this.marks.has(type);
  }
  /**
   * 创建节点
   */
  node(type, attrs, content, marks) {
    if (!this.hasNode(type))
      throw new Error(`Node type "${type}" not found in schema`);
    return {
      type,
      attrs,
      content,
      marks
    };
  }
  /**
   * 创建文本节点
   */
  text(text, marks) {
    return {
      type: "text",
      text,
      marks
    };
  }
  /**
   * 创建标记
   */
  mark(type, attrs) {
    if (!this.hasMark(type))
      throw new Error(`Mark type "${type}" not found in schema`);
    return {
      type,
      attrs
    };
  }
}
const defaultSchema = new Schema({
  nodes: {
    doc: {
      content: "block+"
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{
        tag: "p"
      }],
      toDOM: () => ["p", 0]
    },
    text: {
      group: "inline"
    },
    heading: {
      content: "inline*",
      group: "block",
      attrs: {
        level: {
          default: 1
        }
      },
      parseDOM: [{
        tag: "h1",
        attrs: {
          level: 1
        }
      }, {
        tag: "h2",
        attrs: {
          level: 2
        }
      }, {
        tag: "h3",
        attrs: {
          level: 3
        }
      }, {
        tag: "h4",
        attrs: {
          level: 4
        }
      }, {
        tag: "h5",
        attrs: {
          level: 5
        }
      }, {
        tag: "h6",
        attrs: {
          level: 6
        }
      }],
      toDOM: (node) => [`h${node.attrs?.level || 1}`, 0]
    },
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{
        tag: "blockquote"
      }],
      toDOM: () => ["blockquote", 0]
    },
    codeBlock: {
      content: "text*",
      group: "block",
      marks: "",
      parseDOM: [{
        tag: "pre"
      }],
      toDOM: () => ["pre", ["code", 0]]
    },
    horizontalRule: {
      group: "block",
      parseDOM: [{
        tag: "hr"
      }],
      toDOM: () => ["hr"]
    },
    bulletList: {
      content: "listItem+",
      group: "block",
      parseDOM: [{
        tag: "ul"
      }],
      toDOM: () => ["ul", 0]
    },
    orderedList: {
      content: "listItem+",
      group: "block",
      attrs: {
        start: {
          default: 1
        }
      },
      parseDOM: [{
        tag: "ol"
      }],
      toDOM: (node) => ["ol", {
        start: node.attrs?.start || 1
      }, 0]
    },
    listItem: {
      content: "paragraph block*",
      parseDOM: [{
        tag: "li"
      }],
      toDOM: () => ["li", 0]
    },
    image: {
      group: "inline",
      inline: true,
      attrs: {
        src: {
          default: null
        },
        alt: {
          default: null
        },
        title: {
          default: null
        }
      },
      parseDOM: [{
        tag: "img"
      }],
      toDOM: (node) => ["img", node.attrs || {}]
    },
    video: {
      group: "block",
      inline: false,
      attrs: {
        src: {
          default: null
        },
        type: {
          default: null
        },
        controls: {
          default: true
        }
      },
      parseDOM: [{
        tag: "video"
      }],
      toDOM: (node) => {
        const attrs = {
          controls: node.attrs?.controls !== false
        };
        if (node.attrs?.src)
          attrs.src = node.attrs.src;
        if (node.attrs?.type)
          attrs.type = node.attrs.type;
        return ["video", attrs];
      }
    },
    audio: {
      group: "block",
      inline: false,
      attrs: {
        src: {
          default: null
        },
        type: {
          default: null
        },
        controls: {
          default: true
        }
      },
      parseDOM: [{
        tag: "audio"
      }],
      toDOM: (node) => {
        const attrs = {
          controls: node.attrs?.controls !== false
        };
        if (node.attrs?.src)
          attrs.src = node.attrs.src;
        if (node.attrs?.type)
          attrs.type = node.attrs.type;
        return ["audio", attrs];
      }
    }
  },
  marks: {
    bold: {
      parseDOM: [{
        tag: "strong"
      }, {
        tag: "b"
      }],
      toDOM: () => ["strong", 0]
    },
    italic: {
      parseDOM: [{
        tag: "em"
      }, {
        tag: "i"
      }],
      toDOM: () => ["em", 0]
    },
    underline: {
      parseDOM: [{
        tag: "u"
      }],
      toDOM: () => ["u", 0]
    },
    strike: {
      parseDOM: [{
        tag: "s"
      }, {
        tag: "strike"
      }],
      toDOM: () => ["s", 0]
    },
    code: {
      parseDOM: [{
        tag: "code"
      }],
      toDOM: () => ["code", 0]
    },
    link: {
      attrs: {
        href: {
          default: null
        },
        title: {
          default: null
        }
      },
      inclusive: false,
      parseDOM: [{
        tag: "a"
      }],
      toDOM: (mark) => ["a", mark.attrs || {}, 0]
    }
  }
});

exports.Schema = Schema;
exports.defaultSchema = defaultSchema;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Schema.cjs.map
