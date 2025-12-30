/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defaultSchema } from './Schema.js';

class Document {
  constructor(content, schema = defaultSchema) {
    this.schema = schema;
    if (typeof content === "string") {
      this.root = this.fromHTML(content);
    } else if (content) {
      this.root = content;
    } else {
      this.root = {
        type: "doc",
        content: [{
          type: "paragraph",
          content: []
        }]
      };
    }
  }
  /**
   * 从 HTML 解析文档
   */
  fromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return this.parseDOM(doc.body);
  }
  /**
   * 转换为 HTML
   */
  toHTML() {
    return this.nodeToHTML(this.root);
  }
  /**
   * 转换为 JSON
   */
  toJSON() {
    return JSON.parse(JSON.stringify(this.root));
  }
  /**
   * 转换为纯文本
   */
  toText() {
    return this.nodeToText(this.root);
  }
  /**
   * 从 JSON 创建文档
   */
  static fromJSON(json, schema) {
    return new Document(json, schema);
  }
  /**
   * 解析 DOM 节点
   */
  parseDOM(dom) {
    const children = [];
    for (let i = 0; i < dom.childNodes.length; i++) {
      const child = dom.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        if (text.trim()) {
          children.push({
            type: "text",
            text
          });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child;
        const node = this.parseElement(element);
        if (node)
          children.push(node);
      }
    }
    if (dom.tagName === "BODY" || !dom.tagName) {
      return {
        type: "doc",
        content: children.length > 0 ? children : [{
          type: "paragraph",
          content: []
        }]
      };
    }
    return {
      type: "paragraph",
      content: children
    };
  }
  /**
   * 解析元素节点
   */
  parseElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "p") {
      return {
        type: "paragraph",
        content: this.parseInlineContent(element)
      };
    }
    if (/^h[1-6]$/.test(tagName)) {
      return {
        type: "heading",
        attrs: {
          level: Number.parseInt(tagName[1])
        },
        content: this.parseInlineContent(element)
      };
    }
    if (tagName === "blockquote") {
      return {
        type: "blockquote",
        content: Array.from(element.children).map((child) => this.parseElement(child)).filter(Boolean)
      };
    }
    if (tagName === "pre") {
      const code = element.querySelector("code");
      return {
        type: "codeBlock",
        content: [{
          type: "text",
          text: (code || element).textContent || ""
        }]
      };
    }
    if (tagName === "hr")
      return {
        type: "horizontalRule"
      };
    if (tagName === "ul") {
      return {
        type: "bulletList",
        content: Array.from(element.children).filter((child) => child.tagName.toLowerCase() === "li").map((child) => ({
          type: "listItem",
          content: [this.parseDOM(child)]
        }))
      };
    }
    if (tagName === "ol") {
      return {
        type: "orderedList",
        attrs: {
          start: Number.parseInt(element.getAttribute("start") || "1")
        },
        content: Array.from(element.children).filter((child) => child.tagName.toLowerCase() === "li").map((child) => ({
          type: "listItem",
          content: [this.parseDOM(child)]
        }))
      };
    }
    if (tagName === "img") {
      return {
        type: "image",
        attrs: {
          src: element.getAttribute("src"),
          alt: element.getAttribute("alt"),
          title: element.getAttribute("title")
        }
      };
    }
    if (tagName === "video") {
      let src = element.getAttribute("src");
      let type = element.getAttribute("type");
      const source = element.querySelector("source");
      if (source) {
        src = src || source.getAttribute("src") || void 0;
        type = type || source.getAttribute("type") || void 0;
      }
      return {
        type: "video",
        attrs: {
          src,
          type,
          controls: element.hasAttribute("controls") ? true : void 0
        }
      };
    }
    if (tagName === "audio") {
      let src = element.getAttribute("src");
      let type = element.getAttribute("type");
      const source = element.querySelector("source");
      if (source) {
        src = src || source.getAttribute("src") || void 0;
        type = type || source.getAttribute("type") || void 0;
      }
      return {
        type: "audio",
        attrs: {
          src,
          type,
          controls: element.hasAttribute("controls") ? true : void 0
        }
      };
    }
    if (tagName === "table") {
      return {
        type: "table",
        attrs: {
          html: element.outerHTML
        }
      };
    }
    if (tagName === "thead" || tagName === "tbody" || tagName === "tr" || tagName === "th" || tagName === "td")
      return null;
    return {
      type: "paragraph",
      content: this.parseInlineContent(element)
    };
  }
  /**
   * 解析内联内容
   */
  parseInlineContent(element) {
    const nodes = [];
    const parseNode = (node, marks = []) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text) {
          nodes.push({
            type: "text",
            text,
            marks: marks.length > 0 ? marks : void 0
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        const tag = el.tagName.toLowerCase();
        const newMarks = [...marks];
        if (tag === "strong" || tag === "b") {
          newMarks.push({
            type: "bold"
          });
        } else if (tag === "em" || tag === "i") {
          newMarks.push({
            type: "italic"
          });
        } else if (tag === "u") {
          newMarks.push({
            type: "underline"
          });
        } else if (tag === "s" || tag === "strike") {
          newMarks.push({
            type: "strike"
          });
        } else if (tag === "code") {
          newMarks.push({
            type: "code"
          });
        } else if (tag === "a") {
          newMarks.push({
            type: "link",
            attrs: {
              href: el.getAttribute("href"),
              title: el.getAttribute("title")
            }
          });
        } else if (tag === "img") {
          nodes.push({
            type: "image",
            attrs: {
              src: el.getAttribute("src"),
              alt: el.getAttribute("alt"),
              title: el.getAttribute("title")
            }
          });
          return;
        }
        el.childNodes.forEach((child) => parseNode(child, newMarks));
      }
    };
    element.childNodes.forEach((node) => parseNode(node));
    return nodes;
  }
  /**
   * 节点转 HTML
   */
  nodeToHTML(node) {
    if (node.type === "text") {
      let html = this.escapeHTML(node.text || "");
      if (node.marks) {
        node.marks.forEach((mark) => {
          html = this.wrapMark(html, mark);
        });
      }
      return html;
    }
    const content = node.content?.map((child) => this.nodeToHTML(child)).join("") || "";
    switch (node.type) {
      case "doc":
        return content;
      case "paragraph":
        return `<p>${content}</p>`;
      case "heading":
        return `<h${node.attrs?.level || 1}>${content}</h${node.attrs?.level || 1}>`;
      case "blockquote":
        return `<blockquote>${content}</blockquote>`;
      case "codeBlock":
        return `<pre><code>${content}</code></pre>`;
      case "horizontalRule":
        return "<hr>";
      case "bulletList":
        return `<ul>${content}</ul>`;
      case "orderedList":
        return `<ol start="${node.attrs?.start || 1}">${content}</ol>`;
      case "listItem":
        return `<li>${content}</li>`;
      case "image":
        return `<img src="${node.attrs?.src || ""}" alt="${node.attrs?.alt || ""}" ${node.attrs?.title ? `title="${node.attrs.title}"` : ""}>`;
      case "video": {
        const src = node.attrs?.src || "";
        const type = node.attrs?.type ? ` type="${node.attrs.type}"` : "";
        const controls = node.attrs?.controls === false ? "" : " controls";
        return `<video${controls} src="${src}"${type} style="max-width: 100%; height: auto; display: block; margin: 10px auto;"></video>`;
      }
      case "audio": {
        const src = node.attrs?.src || "";
        const type = node.attrs?.type ? ` type="${node.attrs.type}"` : "";
        const controls = node.attrs?.controls === false ? "" : " controls";
        return `<audio${controls} src="${src}"${type} style="width: 100%; max-width: 400px; display: block; margin: 10px auto;"></audio>`;
      }
      case "table":
        return node.attrs?.html || "<table></table>";
      default:
        return content;
    }
  }
  /**
   * 包装标记
   */
  wrapMark(html, mark) {
    switch (mark.type) {
      case "bold":
        return `<strong>${html}</strong>`;
      case "italic":
        return `<em>${html}</em>`;
      case "underline":
        return `<u>${html}</u>`;
      case "strike":
        return `<s>${html}</s>`;
      case "code":
        return `<code>${html}</code>`;
      case "link":
        return `<a href="${mark.attrs?.href || ""}" ${mark.attrs?.title ? `title="${mark.attrs.title}"` : ""}>${html}</a>`;
      default:
        return html;
    }
  }
  /**
   * 转义 HTML
   */
  escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  /**
   * 节点转纯文本
   */
  nodeToText(node) {
    if (node.type === "text")
      return node.text || "";
    switch (node.type) {
      case "horizontalRule":
        return "---\n";
      case "image":
        return `[\u56FE\u7247: ${node.attrs?.alt || node.attrs?.src || ""}]
`;
      case "video":
        return `[\u89C6\u9891: ${node.attrs?.src || ""}]
`;
      case "audio":
        return `[\u97F3\u9891: ${node.attrs?.src || ""}]
`;
      case "table":
        return "[\u8868\u683C]\n";
    }
    let content = "";
    if (node.content)
      content = node.content.map((child) => this.nodeToText(child)).join("");
    switch (node.type) {
      case "paragraph":
      case "heading":
      case "blockquote":
      case "codeBlock":
      case "listItem":
        return `${content}
`;
      case "bulletList":
      case "orderedList":
        return `${content}
`;
      default:
        return content;
    }
  }
  /**
   * 获取文档大小
   */
  get size() {
    return this.getNodeSize(this.root);
  }
  /**
   * 计算节点大小
   */
  getNodeSize(node) {
    if (node.type === "text")
      return node.text?.length || 0;
    let size = 1;
    if (node.content) {
      node.content.forEach((child) => {
        size += this.getNodeSize(child);
      });
    }
    size += 1;
    return size;
  }
}

export { Document };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Document.js.map
