/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
function showCodeBlockDialog(options = {}) {
  const {
    selectedText = "",
    onConfirm,
    onCancel
  } = options;
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;
  `;
  const dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease-out;
  `;
  dialog.innerHTML = `
    <div style="padding: 24px;">
      <h3 style="
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        \u63D2\u5165\u4EE3\u7801\u5757
      </h3>
      
      <!-- \u9009\u9879\u533A\u57DF -->
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <div style="flex: 1;">
          <label style="
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          ">\u7F16\u7A0B\u8BED\u8A00</label>
          <select id="codeblock-language-select" style="
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            background: white;
            color: #374151;
            cursor: pointer;
            outline: none;
            transition: all 0.2s;
            box-sizing: border-box;
          ">
            <option value="plaintext">\u7EAF\u6587\u672C</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="markdown">Markdown</option>
            <option value="bash">Bash/Shell</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
        
        <div style="flex: 1;">
          <label style="
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          ">\u4E3B\u9898\u6837\u5F0F</label>
          <select id="codeblock-theme-select" style="
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            background: white;
            color: #374151;
            cursor: pointer;
            outline: none;
            transition: all 0.2s;
            box-sizing: border-box;
          ">
            <option value="oneDark">One Dark (\u6697\u8272)</option>
            <option value="vsLight">VS Light (\u4EAE\u8272)</option>
            <option value="monokai">Monokai</option>
            <option value="dracula">Dracula</option>
          </select>
        </div>
      </div>
      
      <!-- \u4EE3\u7801\u7F16\u8F91\u5668\u533A\u57DF -->
      <div style="margin-bottom: 16px;">
        <label style="
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        ">\u4EE3\u7801\u5185\u5BB9</label>
        <textarea id="codeblock-textarea" placeholder="\u5728\u6B64\u8F93\u5165\u6216\u7C98\u8D34\u4EE3\u7801..." style="
          width: 100%;
          height: 400px;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          resize: vertical;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        ">${selectedText}</textarea>
        <div style="
          margin-top: 6px;
          font-size: 12px;
          color: #6b7280;
        ">\u63D0\u793A\uFF1A\u4F7F\u7528 Tab \u952E\u63D2\u5165\u7F29\u8FDB\uFF0CCtrl+Enter \u5FEB\u901F\u63D2\u5165</div>
      </div>
      
      <!-- \u6309\u94AE\u533A\u57DF -->
      <div style="
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      ">
        <button id="codeblock-cancel-btn" style="
          padding: 10px 20px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        ">\u53D6\u6D88</button>
        <button id="codeblock-confirm-btn" style="
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          background: #3b82f6;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        ">\u63D2\u5165\u4EE3\u7801</button>
      </div>
    </div>
  `;
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    #codeblock-language-select:focus,
    #codeblock-theme-select:focus,
    #codeblock-textarea:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    #codeblock-cancel-btn:hover {
      background: #f9fafb !important;
      border-color: #9ca3af !important;
    }
    
    #codeblock-confirm-btn:hover {
      background: #2563eb !important;
    }
    
    #codeblock-confirm-btn:disabled {
      background: #9ca3af !important;
      cursor: not-allowed !important;
    }
  `;
  document.head.appendChild(style);
  const textarea = document.getElementById("codeblock-textarea");
  const languageSelect = document.getElementById("codeblock-language-select");
  const themeSelect = document.getElementById("codeblock-theme-select");
  const confirmBtn = document.getElementById("codeblock-confirm-btn");
  const cancelBtn = document.getElementById("codeblock-cancel-btn");
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value = `${value.substring(0, start)}  ${value.substring(end)}`;
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  });
  setTimeout(() => {
    textarea.focus();
  }, 100);
  const validateInputs = () => {
    const code = textarea.value.trim();
    if (code)
      confirmBtn.disabled = false;
    else
      confirmBtn.disabled = true;
  };
  textarea.addEventListener("input", validateInputs);
  validateInputs();
  const closeDialog = () => {
    overlay.style.animation = "fadeIn 0.2s ease-out reverse";
    dialog.style.animation = "slideUp 0.2s ease-out reverse";
    setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 200);
  };
  confirmBtn.addEventListener("click", () => {
    const code = textarea.value.trim();
    const language = languageSelect.value;
    const theme = themeSelect.value;
    if (code && onConfirm) {
      onConfirm(code, language, theme);
      closeDialog();
    }
  });
  cancelBtn.addEventListener("click", () => {
    if (onCancel)
      onCancel();
    closeDialog();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      if (onCancel)
        onCancel();
      closeDialog();
    }
  });
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      if (onCancel)
        onCancel();
      closeDialog();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);
  textarea.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter" && !confirmBtn.disabled)
      confirmBtn.click();
  });
}

export { showCodeBlockDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=CodeBlockDialog.js.map
