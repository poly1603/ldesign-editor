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

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

exports.escapeHTML = escapeHTML;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=StringUtils.cjs.map
