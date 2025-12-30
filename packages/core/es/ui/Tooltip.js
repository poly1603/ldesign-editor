/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
let currentTooltip = null;
function showTooltip(element, text) {
  hideTooltip();
  const tooltip = document.createElement("div");
  tooltip.className = "editor-tooltip";
  tooltip.textContent = text;
  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = rect.left + (rect.width - tooltipRect.width) / 2;
  const top = rect.bottom + 8;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  requestAnimationFrame(() => {
    tooltip.classList.add("show");
  });
}
function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}
function bindTooltip(element, text) {
  let timeoutId = null;
  element.addEventListener("mouseenter", () => {
    timeoutId = window.setTimeout(() => {
      showTooltip(element, text);
    }, 500);
  });
  element.addEventListener("mouseleave", () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    hideTooltip();
  });
}

export { bindTooltip, hideTooltip, showTooltip };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Tooltip.js.map
