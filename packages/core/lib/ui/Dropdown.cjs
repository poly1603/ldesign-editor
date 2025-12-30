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

var index = require('./icons/index.cjs');

function createDropdown(options) {
  const {
    options: items,
    onSelect,
    customContent,
    width,
    maxHeight,
    selectedValue,
    renderOption
  } = options;
  const dropdown = document.createElement("div");
  dropdown.className = "editor-dropdown";
  if (width)
    dropdown.style.width = typeof width === "number" ? `${width}px` : width;
  if (maxHeight)
    dropdown.style.maxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  if (customContent) {
    dropdown.appendChild(customContent);
    return dropdown;
  }
  const list = document.createElement("div");
  list.className = "editor-dropdown-list";
  if (items && items.length > 0) {
    items.forEach((item) => {
      if (renderOption) {
        const customElement = renderOption(item);
        if (customElement) {
          list.appendChild(customElement);
          return;
        }
      }
      if (item.value === "separator" || item.label === "---") {
        const separator = document.createElement("div");
        separator.className = "editor-dropdown-separator";
        separator.style.cssText = "height: 1px; background: #e0e0e0; margin: 4px 8px;";
        list.appendChild(separator);
        return;
      }
      const optionElement = document.createElement("div");
      optionElement.className = "editor-dropdown-option";
      optionElement.dataset.value = item.value;
      if (selectedValue && item.value === selectedValue)
        optionElement.classList.add("active");
      if (item.icon) {
        const iconElement = index.createIcon(item.icon);
        if (iconElement) {
          iconElement.style.width = "16px";
          iconElement.style.height = "16px";
          iconElement.style.marginRight = "8px";
          iconElement.style.verticalAlign = "middle";
          iconElement.style.opacity = "0.7";
          optionElement.appendChild(iconElement);
        }
      }
      if (item.color) {
        const colorPreview = document.createElement("span");
        colorPreview.className = "editor-dropdown-color-preview";
        colorPreview.style.backgroundColor = item.color;
        optionElement.appendChild(colorPreview);
      }
      if (item.emoji) {
        const emojiSpan = document.createElement("span");
        emojiSpan.className = "editor-dropdown-emoji";
        emojiSpan.textContent = item.emoji;
        optionElement.appendChild(emojiSpan);
      }
      const labelSpan = document.createElement("span");
      labelSpan.className = "editor-dropdown-label";
      labelSpan.textContent = item.label;
      optionElement.appendChild(labelSpan);
      if (item.value !== "inherit" && item.value.includes(",") && !item.color && !item.emoji)
        optionElement.style.fontFamily = item.value;
      optionElement.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      optionElement.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSelect) {
          dropdown.classList.add("closing");
          setTimeout(() => {
            onSelect(item.value);
            dropdown.remove();
          }, 150);
        }
      });
      list.appendChild(optionElement);
    });
  }
  dropdown.appendChild(list);
  return dropdown;
}
function showDropdown(button, options) {
  const existing = document.querySelector(".editor-dropdown");
  if (existing) {
    if (existing.classList.contains("closing")) {
      existing.remove();
    } else {
      existing.classList.add("closing");
      setTimeout(() => {
        existing.remove();
      }, 150);
    }
  }
  const dropdown = createDropdown(options);
  const rect = button.getBoundingClientRect();
  dropdown.style.position = "fixed";
  dropdown.style.zIndex = "10000";
  dropdown.style.visibility = "hidden";
  dropdown.style.opacity = "0";
  document.body.appendChild(dropdown);
  const dropdownRect = dropdown.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const padding = 10;
  let top = rect.bottom + 5;
  let left = rect.left;
  if (left + dropdownRect.width > windowWidth - padding) {
    left = rect.right - dropdownRect.width;
    if (left < padding)
      left = windowWidth - dropdownRect.width - padding;
  }
  if (left < padding)
    left = padding;
  if (top + dropdownRect.height > windowHeight - padding) {
    const topAbove = rect.top - dropdownRect.height - 5;
    if (topAbove >= padding) {
      top = topAbove;
      dropdown.style.transformOrigin = "bottom";
    } else {
      top = rect.bottom + 5;
      const maxHeight = windowHeight - top - padding;
      dropdown.style.maxHeight = `${maxHeight}px`;
      dropdown.style.overflowY = "auto";
    }
  }
  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;
  dropdown.style.visibility = "visible";
  dropdown.style.opacity = "1";
  dropdown.classList.remove("editor-dropdown");
  void dropdown.offsetWidth;
  dropdown.classList.add("editor-dropdown");
  const closeOnClickOutside = (e) => {
    if (!dropdown.contains(e.target) && e.target !== button) {
      dropdown.classList.add("closing");
      setTimeout(() => {
        dropdown.remove();
      }, 150);
      document.removeEventListener("click", closeOnClickOutside);
    }
  };
  const closeOnEsc = (e) => {
    if (e.key === "Escape") {
      dropdown.classList.add("closing");
      setTimeout(() => {
        dropdown.remove();
      }, 150);
      document.removeEventListener("keydown", closeOnEsc);
      document.removeEventListener("click", closeOnClickOutside);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", closeOnClickOutside);
    document.addEventListener("keydown", closeOnEsc);
  }, 0);
}

exports.createDropdown = createDropdown;
exports.showDropdown = showDropdown;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Dropdown.cjs.map
