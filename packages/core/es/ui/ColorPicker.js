/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { PRESET_COLORS } from '../plugins/formatting/color.js';

const recentColorsList = [];
const MAX_RECENT_COLORS = 10;
function addRecentColor(color) {
  const index = recentColorsList.indexOf(color);
  if (index > -1)
    recentColorsList.splice(index, 1);
  recentColorsList.unshift(color);
  if (recentColorsList.length > MAX_RECENT_COLORS)
    recentColorsList.pop();
  try {
    localStorage.setItem("editor-recent-colors", JSON.stringify(recentColorsList));
  } catch (e) {
    console.error("Failed to save recent colors:", e);
  }
}
function loadRecentColors() {
  try {
    const saved = localStorage.getItem("editor-recent-colors");
    if (saved) {
      const colors = JSON.parse(saved);
      recentColorsList.length = 0;
      recentColorsList.push(...colors.slice(0, MAX_RECENT_COLORS));
    }
  } catch (e) {
    console.error("Failed to load recent colors:", e);
  }
}
loadRecentColors();
function createColorPicker(options) {
  const {
    onSelect,
    colors = PRESET_COLORS,
    customColors = true,
    recentColors = true
  } = options;
  const picker = document.createElement("div");
  picker.className = "editor-color-picker";
  if (recentColors && recentColorsList.length > 0) {
    const recentTitle = document.createElement("div");
    recentTitle.className = "editor-color-section-title";
    recentTitle.textContent = "\u6700\u8FD1\u4F7F\u7528";
    picker.appendChild(recentTitle);
    const recentContainer = document.createElement("div");
    recentContainer.className = "editor-color-preset editor-color-recent";
    recentColorsList.forEach((color) => {
      const colorItem = createColorButton(color, (selectedColor) => {
        onSelect(selectedColor);
        picker.remove();
      });
      recentContainer.appendChild(colorItem);
    });
    picker.appendChild(recentContainer);
  }
  const presetTitle = document.createElement("div");
  presetTitle.className = "editor-color-section-title";
  presetTitle.textContent = "\u9884\u8BBE\u989C\u8272";
  picker.appendChild(presetTitle);
  const presetContainer = document.createElement("div");
  presetContainer.className = "editor-color-preset";
  colors.forEach((color) => {
    const colorItem = createColorButton(color, (selectedColor) => {
      addRecentColor(selectedColor);
      onSelect(selectedColor);
      picker.remove();
    });
    presetContainer.appendChild(colorItem);
  });
  picker.appendChild(presetContainer);
  if (customColors) {
    const customTitle = document.createElement("div");
    customTitle.className = "editor-color-section-title";
    customTitle.textContent = "\u81EA\u5B9A\u4E49\u989C\u8272";
    picker.appendChild(customTitle);
    const customContainer = document.createElement("div");
    customContainer.className = "editor-color-custom";
    const hexInputGroup = document.createElement("div");
    hexInputGroup.className = "editor-color-hex-group";
    const hexLabel = document.createElement("label");
    hexLabel.textContent = "HEX:";
    hexLabel.className = "editor-color-hex-label";
    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.className = "editor-color-hex-input";
    hexInput.placeholder = "#000000";
    hexInput.maxLength = 7;
    const hexApplyBtn = document.createElement("button");
    hexApplyBtn.type = "button";
    hexApplyBtn.className = "editor-color-hex-apply";
    hexApplyBtn.textContent = "\u5E94\u7528";
    hexApplyBtn.addEventListener("click", () => {
      const color = hexInput.value.trim();
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        addRecentColor(color);
        onSelect(color);
        picker.remove();
      } else {
        hexInput.style.borderColor = "#ef4444";
        setTimeout(() => {
          hexInput.style.borderColor = "";
        }, 1e3);
      }
    });
    hexInputGroup.appendChild(hexLabel);
    hexInputGroup.appendChild(hexInput);
    hexInputGroup.appendChild(hexApplyBtn);
    customContainer.appendChild(hexInputGroup);
    const colorInputGroup = document.createElement("div");
    colorInputGroup.className = "editor-color-input-group";
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "\u9009\u62E9\u5668:";
    colorLabel.className = "editor-color-input-label";
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "editor-color-input";
    colorInput.value = "#000000";
    colorInput.addEventListener("input", (e) => {
      const color = e.target.value;
      hexInput.value = color;
    });
    colorInput.addEventListener("change", (e) => {
      const color = e.target.value;
      addRecentColor(color);
      onSelect(color);
      picker.remove();
    });
    colorInputGroup.appendChild(colorLabel);
    colorInputGroup.appendChild(colorInput);
    customContainer.appendChild(colorInputGroup);
    picker.appendChild(customContainer);
  }
  return picker;
}
function createColorButton(color, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "editor-color-item";
  button.style.backgroundColor = color;
  button.title = color;
  const rgb = hexToRgb(color);
  if (rgb && rgb.r + rgb.g + rgb.b > 650)
    button.style.border = "1px solid #e5e7eb";
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(color);
  });
  return button;
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : null;
}
function showColorPicker(button, options) {
  const existing = document.querySelector(".editor-color-picker");
  if (existing)
    existing.remove();
  const picker = createColorPicker(options);
  const rect = button.getBoundingClientRect();
  picker.style.position = "absolute";
  picker.style.top = `${rect.bottom + 5}px`;
  picker.style.left = `${rect.left}px`;
  picker.style.zIndex = "10000";
  document.body.appendChild(picker);
  const closeOnClickOutside = (e) => {
    if (!picker.contains(e.target) && e.target !== button) {
      picker.remove();
      document.removeEventListener("click", closeOnClickOutside);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", closeOnClickOutside);
  }, 0);
}

export { createColorPicker, showColorPicker };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ColorPicker.js.map
