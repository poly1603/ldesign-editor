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

var color = require('../plugins/formatting/color.cjs');
var Dropdown = require('./Dropdown.cjs');

const EMOJI_CATEGORIES = {
  smileys: {
    name: "\u7B11\u8138",
    emojis: ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}", "\u{1F619}", "\u{1F61A}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}"]
  },
  gestures: {
    name: "\u624B\u52BF",
    emojis: ["\u{1F44B}", "\u{1F91A}", "\u{1F590}", "\u270B", "\u{1F596}", "\u{1F44C}", "\u{1F90F}", "\u270C\uFE0F", "\u{1F91E}", "\u{1F91F}", "\u{1F918}", "\u{1F919}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F447}", "\u261D\uFE0F", "\u{1F44D}", "\u{1F44E}", "\u270A", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}", "\u{1F932}", "\u{1F91D}", "\u{1F64F}"]
  },
  hearts: {
    name: "\u7231\u5FC3",
    emojis: ["\u2764\uFE0F", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}", "\u{1F49C}", "\u{1F5A4}", "\u{1F90D}", "\u{1F90E}", "\u{1F494}", "\u2763\uFE0F", "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F496}", "\u{1F498}", "\u{1F49D}"]
  },
  animals: {
    name: "\u52A8\u7269",
    emojis: ["\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F437}", "\u{1F438}", "\u{1F435}", "\u{1F412}", "\u{1F414}", "\u{1F427}", "\u{1F426}", "\u{1F424}", "\u{1F423}", "\u{1F986}", "\u{1F985}", "\u{1F989}", "\u{1F987}", "\u{1F43A}", "\u{1F417}", "\u{1F434}"]
  },
  food: {
    name: "\u98DF\u7269",
    emojis: ["\u{1F34F}", "\u{1F34E}", "\u{1F350}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1F348}", "\u{1F352}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F95D}", "\u{1F345}", "\u{1F346}", "\u{1F951}", "\u{1F966}", "\u{1F96C}", "\u{1F952}", "\u{1F336}", "\u{1F33D}", "\u{1F955}", "\u{1F9C4}", "\u{1F9C5}", "\u{1F954}"]
  }
};
function showColorDropdown(button, onSelect, includeCustom = true, title = "\u9009\u62E9\u989C\u8272") {
  const colorOptions = color.PRESET_COLORS.slice(0, 20).map((color) => ({
    label: color,
    value: color,
    color
  }));
  if (includeCustom) {
    const customContent = document.createElement("div");
    customContent.style.cssText = "width: 100%; box-sizing: border-box;";
    const titleElement = document.createElement("div");
    titleElement.className = "editor-dropdown-title";
    titleElement.textContent = title;
    customContent.appendChild(titleElement);
    const colorGrid = document.createElement("div");
    colorGrid.className = "editor-color-grid";
    color.PRESET_COLORS.forEach((color) => {
      const colorButton = document.createElement("button");
      colorButton.type = "button";
      colorButton.className = "editor-color-item-dropdown";
      colorButton.style.backgroundColor = color;
      colorButton.title = color;
      const rgb = hexToRgb(color);
      if (rgb && rgb.r + rgb.g + rgb.b > 650)
        colorButton.style.border = "1px solid #e5e7eb";
      colorButton.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      colorButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = customContent.closest(".editor-dropdown");
        if (dropdown) {
          dropdown.classList.add("closing");
          setTimeout(() => {
            onSelect(color);
            dropdown.remove();
          }, 150);
        }
      });
      colorGrid.appendChild(colorButton);
    });
    customContent.appendChild(colorGrid);
    const customSection = document.createElement("div");
    customSection.className = "editor-color-custom-section";
    const inputGroup = document.createElement("div");
    inputGroup.style.cssText = "display: flex; gap: 8px; align-items: center; width: 100%; box-sizing: border-box;";
    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.placeholder = "#000000";
    hexInput.maxLength = 7;
    hexInput.style.cssText = "flex: 1; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; box-sizing: border-box; min-width: 0;";
    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.textContent = "\u5E94\u7528";
    applyButton.style.cssText = "padding: 6px 12px; border: none; border-radius: 4px; background: #3b82f6; color: white; font-size: 12px; cursor: pointer; flex-shrink: 0;";
    applyButton.addEventListener("click", () => {
      const color = hexInput.value.trim();
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        const dropdown = customContent.closest(".editor-dropdown");
        if (dropdown) {
          dropdown.classList.add("closing");
          setTimeout(() => {
            onSelect(color);
            dropdown.remove();
          }, 150);
        }
      } else {
        hexInput.style.borderColor = "#ef4444";
        setTimeout(() => {
          hexInput.style.borderColor = "";
        }, 1e3);
      }
    });
    inputGroup.appendChild(hexInput);
    inputGroup.appendChild(applyButton);
    customSection.appendChild(inputGroup);
    customContent.appendChild(customSection);
    Dropdown.showDropdown(button, {
      customContent,
      width: 300,
      maxHeight: 420
    });
  } else {
    Dropdown.showDropdown(button, {
      options: colorOptions,
      onSelect,
      width: 200
    });
  }
}
function showEmojiDropdown(button, onSelect) {
  const customContent = document.createElement("div");
  const tabs = document.createElement("div");
  tabs.className = "editor-dropdown-tabs";
  const emojiGrid = document.createElement("div");
  emojiGrid.className = "editor-emoji-grid";
  let activeTab = null;
  Object.entries(EMOJI_CATEGORIES).forEach(([key, category], index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.textContent = category.name;
    tab.className = "editor-dropdown-tab";
    if (index === 0) {
      tab.classList.add("active");
      activeTab = tab;
      showEmojiCategory(category.emojis, emojiGrid, customContent, onSelect);
    }
    tab.addEventListener("click", () => {
      if (activeTab)
        activeTab.classList.remove("active");
      tab.classList.add("active");
      activeTab = tab;
      showEmojiCategory(category.emojis, emojiGrid, customContent, onSelect);
    });
    tabs.appendChild(tab);
  });
  customContent.appendChild(tabs);
  customContent.appendChild(emojiGrid);
  Dropdown.showDropdown(button, {
    customContent,
    width: 380,
    maxHeight: 320
  });
}
function showEmojiCategory(emojis, container, dropdownContent, onSelect) {
  container.innerHTML = "";
  emojis.forEach((emoji) => {
    const emojiButton = document.createElement("button");
    emojiButton.type = "button";
    emojiButton.className = "editor-emoji-item";
    emojiButton.textContent = emoji;
    emojiButton.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    emojiButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = dropdownContent.closest(".editor-dropdown");
      if (dropdown) {
        dropdown.classList.add("closing");
        setTimeout(() => {
          onSelect(emoji);
          dropdown.remove();
        }, 150);
      }
    });
    container.appendChild(emojiButton);
  });
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : null;
}

exports.showColorDropdown = showColorDropdown;
exports.showEmojiDropdown = showEmojiDropdown;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=UnifiedDropdown.cjs.map
