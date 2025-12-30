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

var basic = require('./basic.cjs');
var formatting = require('./formatting.cjs');
var lucide = require('./lucide.cjs');
var media = require('./media.cjs');

const icons = {
  ...basic.basicIcons,
  ...formatting.formattingIcons,
  ...media.mediaIcons,
  ...lucide.lucideIcons
};
function createIcon(name) {
  const iconSVG = icons[name];
  if (!iconSVG) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  const template = document.createElement("template");
  template.innerHTML = iconSVG.trim();
  const element = template.content.firstChild;
  if (element) {
    element.classList.add("editor-icon");
    if (!element.getAttribute("width"))
      element.setAttribute("width", "18");
    if (!element.getAttribute("height"))
      element.setAttribute("height", "18");
  }
  return element;
}
function getIconHTML(name) {
  return icons[name] || "";
}

exports.basicIcons = basic.basicIcons;
exports.formattingIcons = formatting.formattingIcons;
exports.lucideIcons = lucide.lucideIcons;
exports.mediaIcons = media.mediaIcons;
exports.Icons = icons;
exports.createIcon = createIcon;
exports.createIconElement = createIcon;
exports.getIcon = getIconHTML;
exports.getIconHTML = getIconHTML;
exports.icons = icons;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
