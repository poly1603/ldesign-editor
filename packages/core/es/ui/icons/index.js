/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { basicIcons } from './basic.js';
import { formattingIcons } from './formatting.js';
import { lucideIcons } from './lucide.js';
import { mediaIcons } from './media.js';

const icons = {
  ...basicIcons,
  ...formattingIcons,
  ...mediaIcons,
  ...lucideIcons
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

export { icons as Icons, basicIcons, createIcon, createIcon as createIconElement, formattingIcons, getIconHTML as getIcon, getIconHTML, icons, lucideIcons, mediaIcons };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
