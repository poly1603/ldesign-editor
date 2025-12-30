/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
function createFindReplaceDialog(options) {
  const {
    onFind,
    onReplace,
    onReplaceAll,
    onClose
  } = options;
  const dialog = document.createElement("div");
  dialog.className = "editor-dialog editor-find-dialog enhanced no-overlay";
  dialog.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    z-index: 1000;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    min-width: 400px;
    max-width: 500px;
    animation: slideIn 0.3s ease-out;
  `;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dialogStartX = 0;
  let dialogStartY = 0;
  const startDrag = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = dialog.getBoundingClientRect();
    dialogStartX = rect.left;
    dialogStartY = rect.top;
    dialog.style.cursor = "grabbing";
    e.preventDefault();
  };
  const onDrag = (e) => {
    if (!isDragging)
      return;
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    dialog.style.left = `${dialogStartX + deltaX}px`;
    dialog.style.top = `${dialogStartY + deltaY}px`;
    dialog.style.right = "auto";
  };
  const stopDrag = () => {
    if (isDragging) {
      isDragging = false;
      dialog.style.cursor = "move";
    }
  };
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  const header = document.createElement("div");
  header.className = "editor-dialog-header";
  header.style.cssText = "cursor: move; user-select: none;";
  header.innerHTML = `
    <div class="editor-dialog-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <span>\u67E5\u627E\u548C\u66FF\u6362</span>
    </div>
    <button class="editor-dialog-close" type="button" aria-label="\u5173\u95ED">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;
  dialog.appendChild(header);
  header.addEventListener("mousedown", startDrag);
  const cleanup = () => {
    onClose?.();
    dialog.remove();
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };
  const closeBtn = header.querySelector(".editor-dialog-close");
  closeBtn.addEventListener("click", cleanup);
  const content = document.createElement("div");
  content.className = "editor-find-content";
  const findGroup = document.createElement("div");
  findGroup.className = "editor-find-input-group";
  const findLabel = document.createElement("label");
  findLabel.textContent = "\u67E5\u627E";
  findGroup.appendChild(findLabel);
  const findInputWrapper = document.createElement("div");
  findInputWrapper.className = "editor-find-input-wrapper";
  const findInput = document.createElement("input");
  findInput.type = "text";
  findInput.id = "find-input";
  findInput.className = "editor-find-input";
  findInput.placeholder = "\u8F93\u5165\u8981\u67E5\u627E\u7684\u6587\u672C\uFF08\u652F\u6301\u6A21\u7CCA\u641C\u7D22\uFF09";
  findInput.value = options.initialText || "";
  const findCounter = document.createElement("span");
  findCounter.className = "editor-find-counter";
  findCounter.textContent = "";
  const findNav = document.createElement("div");
  findNav.className = "editor-find-nav";
  findNav.innerHTML = `
    <button type="button" class="find-nav-btn" id="find-prev" title="\u4E0A\u4E00\u4E2A (Shift+Enter)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button type="button" class="find-nav-btn" id="find-next" title="\u4E0B\u4E00\u4E2A (Enter)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  `;
  findInputWrapper.appendChild(findInput);
  findInputWrapper.appendChild(findCounter);
  findInputWrapper.appendChild(findNav);
  findGroup.appendChild(findInputWrapper);
  content.appendChild(findGroup);
  const replaceGroup = document.createElement("div");
  replaceGroup.className = "editor-find-input-group";
  const replaceLabel = document.createElement("label");
  replaceLabel.textContent = "\u66FF\u6362\u4E3A";
  replaceGroup.appendChild(replaceLabel);
  const replaceInputWrapper = document.createElement("div");
  replaceInputWrapper.className = "editor-find-input-wrapper";
  const replaceInput = document.createElement("input");
  replaceInput.type = "text";
  replaceInput.id = "replace-input";
  replaceInput.className = "editor-find-input";
  replaceInput.placeholder = "\u8F93\u5165\u66FF\u6362\u6587\u672C";
  const replacePreview = document.createElement("span");
  replacePreview.className = "editor-replace-preview";
  replacePreview.style.display = "none";
  replaceInputWrapper.appendChild(replaceInput);
  replaceInputWrapper.appendChild(replacePreview);
  replaceGroup.appendChild(replaceInputWrapper);
  content.appendChild(replaceGroup);
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "editor-find-options";
  const caseSensitiveCheckbox = createCheckbox("case-sensitive", "\u533A\u5206\u5927\u5C0F\u5199", "A");
  const wholeWordCheckbox = createCheckbox("whole-word", "\u5168\u5B57\u5339\u914D", "W");
  const regexCheckbox = createCheckbox("use-regex", "\u6B63\u5219\u8868\u8FBE\u5F0F", ".*");
  const fuzzyCheckbox = createCheckbox("fuzzy-search", "\u6A21\u7CCA\u641C\u7D22", "\u2248");
  optionsDiv.appendChild(caseSensitiveCheckbox);
  optionsDiv.appendChild(wholeWordCheckbox);
  optionsDiv.appendChild(regexCheckbox);
  optionsDiv.appendChild(fuzzyCheckbox);
  const regexInput = regexCheckbox.querySelector("input");
  const fuzzyInput = fuzzyCheckbox.querySelector("input");
  regexInput.addEventListener("change", () => {
    if (regexInput.checked)
      fuzzyInput.checked = false;
  });
  fuzzyInput.addEventListener("change", () => {
    if (fuzzyInput.checked)
      regexInput.checked = false;
  });
  content.appendChild(optionsDiv);
  const resultDiv = document.createElement("div");
  resultDiv.className = "editor-find-result";
  resultDiv.style.display = "none";
  content.appendChild(resultDiv);
  const advancedSection = document.createElement("details");
  advancedSection.className = "editor-find-advanced";
  advancedSection.innerHTML = `
    <summary>\u9AD8\u7EA7\u9009\u9879</summary>
    <div class="editor-find-advanced-content">
      <div class="editor-find-scope">
        <label>\u641C\u7D22\u8303\u56F4\uFF1A</label>
        <select id="search-scope">
          <option value="all">\u5168\u6587\u6863</option>
          <option value="selection">\u9009\u4E2D\u6587\u672C</option>
          <option value="current-block">\u5F53\u524D\u6BB5\u843D</option>
        </select>
      </div>
      <div class="editor-find-history">
        <label>\u641C\u7D22\u5386\u53F2\uFF1A</label>
        <select id="search-history">
          <option value="">-- \u9009\u62E9\u5386\u53F2\u8BB0\u5F55 --</option>
        </select>
      </div>
    </div>
  `;
  content.appendChild(advancedSection);
  dialog.appendChild(content);
  const actions = document.createElement("div");
  actions.className = "editor-dialog-actions";
  const findBtn = document.createElement("button");
  findBtn.type = "button";
  findBtn.className = "editor-dialog-button editor-dialog-button-primary";
  findBtn.innerHTML = "<span>\u67E5\u627E\u5168\u90E8</span><kbd>Ctrl+Enter</kbd>";
  const replaceBtn = document.createElement("button");
  replaceBtn.type = "button";
  replaceBtn.className = "editor-dialog-button editor-dialog-button-warning";
  replaceBtn.innerHTML = "<span>\u66FF\u6362</span>";
  const replaceAllBtn = document.createElement("button");
  replaceAllBtn.type = "button";
  replaceAllBtn.className = "editor-dialog-button editor-dialog-button-danger";
  replaceAllBtn.innerHTML = "<span>\u5168\u90E8\u66FF\u6362</span><kbd>Ctrl+Shift+Enter</kbd>";
  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "editor-dialog-button editor-dialog-button-cancel";
  cancelBtn.textContent = "\u53D6\u6D88";
  function getSearchOptions() {
    return {
      caseSensitive: document.getElementById("case-sensitive")?.checked || false,
      wholeWord: document.getElementById("whole-word")?.checked || false,
      useRegex: document.getElementById("use-regex")?.checked || false,
      fuzzySearch: document.getElementById("fuzzy-search")?.checked || false
    };
  }
  const currentSearchResult = {
    count: 0};
  const searchHistory = loadSearchHistory();
  function showResult(message, type = "info") {
    resultDiv.textContent = message;
    resultDiv.className = `editor-find-result editor-find-result-${type}`;
    resultDiv.style.display = "block";
    setTimeout(() => {
      resultDiv.style.display = "none";
    }, 3e3);
  }
  function updateFindCounter(current, total) {
    {
      findCounter.textContent = "\u65E0\u7ED3\u679C";
      findCounter.className = "editor-find-counter no-results";
    }
  }
  let searchDebounceTimer = null;
  findInput.addEventListener("input", () => {
    if (searchDebounceTimer)
      clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      const searchText = findInput.value;
      if (searchText) {
        const searchOptions = getSearchOptions();
        onFind?.(searchText, searchOptions);
        saveToHistory(searchText);
      } else {
        updateFindCounter();
      }
    }, 300);
  });
  findBtn.addEventListener("click", () => {
    const searchText = findInput.value;
    if (!searchText) {
      showResult("\u8BF7\u8F93\u5165\u8981\u67E5\u627E\u7684\u6587\u672C", "warning");
      return;
    }
    const searchOptions = getSearchOptions();
    onFind?.(searchText, searchOptions);
    saveToHistory(searchText);
  });
  const prevBtn = findNav.querySelector("#find-prev");
  const nextBtn = findNav.querySelector("#find-next");
  prevBtn.addEventListener("click", () => {
  });
  nextBtn.addEventListener("click", () => {
  });
  replaceBtn.addEventListener("click", () => {
    const searchText = findInput.value;
    const replaceText = replaceInput.value || "";
    if (!searchText) {
      showResult("\u8BF7\u8F93\u5165\u8981\u67E5\u627E\u7684\u6587\u672C", "warning");
      return;
    }
    const searchOptions = getSearchOptions();
    onReplace?.(searchText, replaceText, searchOptions);
    showResult("\u66FF\u6362\u6210\u529F", "success");
  });
  replaceAllBtn.addEventListener("click", () => {
    const searchText = findInput.value;
    const replaceText = replaceInput.value || "";
    if (!searchText) {
      showResult("\u8BF7\u8F93\u5165\u8981\u67E5\u627E\u7684\u6587\u672C", "warning");
      return;
    }
    const confirmDialog = document.createElement("div");
    confirmDialog.className = "editor-confirm-dialog";
    confirmDialog.innerHTML = `
      <div class="editor-confirm-content">
        <p>\u786E\u5B9A\u8981\u5C06\u6240\u6709 <strong>"${searchText}"</strong> \u66FF\u6362\u4E3A <strong>"${replaceText || "(\u7A7A)"}"</strong> \u5417\uFF1F</p>
        <p class="editor-confirm-count">\u5C06\u5F71\u54CD ${currentSearchResult.count} \u5904</p>
      </div>
      <div class="editor-confirm-actions">
        <button type="button" class="confirm-yes">\u786E\u5B9A\u66FF\u6362</button>
        <button type="button" class="confirm-no">\u53D6\u6D88</button>
      </div>
    `;
    dialog.appendChild(confirmDialog);
    const yesBtn = confirmDialog.querySelector(".confirm-yes");
    const noBtn = confirmDialog.querySelector(".confirm-no");
    yesBtn.addEventListener("click", () => {
      const searchOptions = getSearchOptions();
      onReplaceAll?.(searchText, replaceText, searchOptions);
      showResult(`\u6210\u529F\u66FF\u6362 ${currentSearchResult.count} \u5904`, "success");
      confirmDialog.remove();
    });
    noBtn.addEventListener("click", () => {
      confirmDialog.remove();
    });
  });
  cancelBtn.addEventListener("click", () => {
    onClose?.();
    dialog.remove();
  });
  actions.appendChild(findBtn);
  actions.appendChild(replaceBtn);
  actions.appendChild(replaceAllBtn);
  actions.appendChild(cancelBtn);
  dialog.appendChild(actions);
  document.body.appendChild(dialog);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose?.();
      dialog.remove();
      document.removeEventListener("keydown", handleKeyDown);
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      if (document.activeElement === findInput) {
        e.preventDefault();
        nextBtn.click();
      }
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      findBtn.click();
    } else if (e.key === "Enter" && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      replaceAllBtn.click();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "h") {
      e.preventDefault();
      replaceInput.focus();
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  function saveToHistory(text) {
    if (!searchHistory.includes(text)) {
      searchHistory.unshift(text);
      if (searchHistory.length > 10)
        searchHistory.pop();
      localStorage.setItem("editor-search-history", JSON.stringify(searchHistory));
      updateHistoryDropdown();
    }
  }
  function loadSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem("editor-search-history") || "[]");
    } catch {
      return [];
    }
  }
  function updateHistoryDropdown() {
    const historySelect2 = document.getElementById("search-history");
    if (historySelect2) {
      historySelect2.innerHTML = '<option value="">-- \u9009\u62E9\u5386\u53F2\u8BB0\u5F55 --</option>';
      searchHistory.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item.length > 30 ? `${item.substring(0, 30)}...` : item;
        historySelect2.appendChild(option);
      });
    }
  }
  const historySelect = document.getElementById("search-history");
  if (historySelect) {
    updateHistoryDropdown();
    historySelect.addEventListener("change", () => {
      if (historySelect.value) {
        findInput.value = historySelect.value;
        findInput.dispatchEvent(new Event("input"));
      }
    });
  }
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      cleanup();
  });
  return dialog;
}
function createCheckbox(id, label, icon) {
  const wrapper = document.createElement("div");
  wrapper.className = "editor-find-checkbox";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.className = "editor-checkbox-input";
  const labelElement = document.createElement("label");
  labelElement.htmlFor = id;
  labelElement.className = "editor-checkbox-label";
  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "checkbox-icon";
    iconSpan.textContent = icon;
    labelElement.appendChild(iconSpan);
  }
  const labelText = document.createElement("span");
  labelText.textContent = label;
  labelElement.appendChild(labelText);
  wrapper.appendChild(checkbox);
  wrapper.appendChild(labelElement);
  return wrapper;
}
function showFindReplaceDialog(options) {
  const existing = document.querySelector(".editor-find-dialog");
  if (existing)
    existing.remove();
  const dialog = createFindReplaceDialog(options);
  document.body.appendChild(dialog);
  setTimeout(() => {
    const findInput = dialog.querySelector("#find-input");
    findInput?.focus();
  }, 100);
}

export { createFindReplaceDialog, showFindReplaceDialog as default, showFindReplaceDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=FindReplaceDialog.js.map
