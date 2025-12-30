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

function createElement(tag, attrs, ...children) {
  const element = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "style") {
        if (typeof value === "string")
          element.style.cssText = value;
        else if (typeof value === "object")
          Object.assign(element.style, value);
      } else if (key === "className") {
        element.className = value;
      } else if (key.startsWith("data-")) {
        element.setAttribute(key, String(value));
      } else {
        element[key] = value;
      }
    });
  }
  children.forEach((child) => {
    if (typeof child === "string")
      element.appendChild(document.createTextNode(child));
    else
      element.appendChild(child);
  });
  return element;
}
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

exports.$ = $;
exports.createElement = createElement;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=DOMUtils.cjs.map
