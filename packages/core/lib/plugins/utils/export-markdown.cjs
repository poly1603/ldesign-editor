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

Object.defineProperty(exports, '__esModule', { value: true });

var Plugin = require('../../core/Plugin.cjs');

function htmlToMarkdown(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return convertNodeToMarkdown(temp);
}
function convertNodeToMarkdown(node) {
  let markdown = "";
  if (node.nodeType === Node.TEXT_NODE)
    return node.textContent || "";
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node;
    const tagName = element.tagName.toLowerCase();
    switch (tagName) {
      case "h1":
        markdown += `# ${getTextContent(element)}

`;
        break;
      case "h2":
        markdown += `## ${getTextContent(element)}

`;
        break;
      case "h3":
        markdown += `### ${getTextContent(element)}

`;
        break;
      case "h4":
        markdown += `#### ${getTextContent(element)}

`;
        break;
      case "h5":
        markdown += `##### ${getTextContent(element)}

`;
        break;
      case "h6":
        markdown += `###### ${getTextContent(element)}

`;
        break;
      case "p":
        markdown += `${convertChildNodes(element)}

`;
        break;
      case "br":
        markdown += "\n";
        break;
      case "strong":
      case "b":
        markdown += `**${convertChildNodes(element)}**`;
        break;
      case "em":
      case "i":
        markdown += `*${convertChildNodes(element)}*`;
        break;
      case "del":
      case "s":
      case "strike":
        markdown += `~~${convertChildNodes(element)}~~`;
        break;
      case "u":
        markdown += `<u>${convertChildNodes(element)}</u>`;
        break;
      case "code":
        if (element.classList.contains("language-")) {
          const lang = Array.from(element.classList).find((c) => c.startsWith("language-"))?.replace("language-", "") || "";
          markdown += `\`\`\`${lang}
${getTextContent(element)}
\`\`\`

`;
        } else {
          markdown += `\`${getTextContent(element)}\``;
        }
        break;
      case "pre":
        const codeElement = element.querySelector("code");
        if (codeElement) {
          const lang = Array.from(codeElement.classList).find((c) => c.startsWith("language-"))?.replace("language-", "") || "";
          markdown += `\`\`\`${lang}
${getTextContent(codeElement)}
\`\`\`

`;
        } else {
          markdown += `\`\`\`
${getTextContent(element)}
\`\`\`

`;
        }
        break;
      case "a":
        const href = element.getAttribute("href") || "";
        const text = convertChildNodes(element);
        markdown += `[${text}](${href})`;
        break;
      case "img":
        const src = element.getAttribute("src") || "";
        const alt = element.getAttribute("alt") || "";
        markdown += `![${alt}](${src})`;
        break;
      case "ul":
        element.childNodes.forEach((child) => {
          if (child.tagName?.toLowerCase() === "li")
            markdown += `- ${convertChildNodes(child)}
`;
        });
        markdown += "\n";
        break;
      case "ol":
        let index = 1;
        element.childNodes.forEach((child) => {
          if (child.tagName?.toLowerCase() === "li") {
            markdown += `${index}. ${convertChildNodes(child)}
`;
            index++;
          }
        });
        markdown += "\n";
        break;
      case "blockquote":
        const lines = convertChildNodes(element).split("\n");
        markdown += `${lines.map((line) => `> ${line}`).join("\n")}

`;
        break;
      case "table":
        const rows = Array.from(element.querySelectorAll("tr"));
        if (rows.length > 0) {
          const headerCells = Array.from(rows[0].querySelectorAll("th, td"));
          if (headerCells.length > 0) {
            markdown += `| ${headerCells.map((cell) => getTextContent(cell)).join(" | ")} |
`;
            markdown += `| ${headerCells.map(() => "---").join(" | ")} |
`;
          }
          for (let i = 1; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll("td"));
            if (cells.length > 0)
              markdown += `| ${cells.map((cell) => getTextContent(cell)).join(" | ")} |
`;
          }
          markdown += "\n";
        }
        break;
      case "hr":
        markdown += "---\n\n";
        break;
      default:
        markdown += convertChildNodes(element);
        break;
    }
  }
  return markdown;
}
function convertChildNodes(element) {
  let markdown = "";
  element.childNodes.forEach((child) => {
    markdown += convertNodeToMarkdown(child);
  });
  return markdown;
}
function getTextContent(element) {
  return element.textContent || "";
}
const exportMarkdownCommand = {
  id: "exportMarkdown",
  name: "\u5BFC\u51FA\u4E3A Markdown",
  execute: (editor) => {
    const content = editor.getContent();
    const markdown = htmlToMarkdown(content);
    const blob = new Blob([markdown], {
      type: "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
    console.log("Markdown \u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
  }
};
const ExportMarkdownPlugin = Plugin.createPlugin({
  name: "export-markdown",
  version: "1.0.0",
  description: "\u5BFC\u51FA\u4E3A Markdown \u683C\u5F0F",
  author: "LDesign Team",
  install(editor) {
    editor.commands.register(exportMarkdownCommand);
    editor.toolbar.add({
      id: "export-markdown",
      type: "button",
      title: "\u5BFC\u51FA Markdown",
      icon: "download",
      onClick: () => {
        editor.commands.execute("exportMarkdown");
      }
    });
    console.log("Markdown\u5BFC\u51FA\u63D2\u4EF6\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
  },
  destroy() {
    console.log("\u9500\u6BC1\u5BFC\u51FA\u63D2\u4EF6");
  }
});

exports.ExportMarkdownPlugin = ExportMarkdownPlugin;
exports.default = ExportMarkdownPlugin;
exports.htmlToMarkdown = htmlToMarkdown;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=export-markdown.cjs.map
