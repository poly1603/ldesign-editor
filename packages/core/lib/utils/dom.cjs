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

function createButton(text, className) {
  const button = document.createElement("button");
  button.textContent = text;
  if (className)
    button.className = className;
  return button;
}

exports.createButton = createButton;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=dom.cjs.map
