/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { showUnifiedDialog } from './UnifiedDialog.js';

function createTableSelector(onChange) {
  const container = document.createElement("div");
  container.style.cssText = `
    padding: 16px 0;
    text-align: center;
  `;
  const selectorTitle = document.createElement("div");
  selectorTitle.style.cssText = `
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 12px;
  `;
  selectorTitle.textContent = "\u9F20\u6807\u60AC\u505C\u9009\u62E9\u8868\u683C\u5927\u5C0F";
  container.appendChild(selectorTitle);
  const selector = document.createElement("div");
  selector.style.cssText = `
    display: inline-grid;
    grid-template-columns: repeat(10, 20px);
    grid-template-rows: repeat(10, 20px);
    gap: 2px;
    padding: 8px;
    background: #f9fafb;
    border-radius: 6px;
  `;
  const maxRows = 10;
  const maxCols = 10;
  let selectedRows = 0;
  let selectedCols = 0;
  for (let i = 0; i < maxRows; i++) {
    for (let j = 0; j < maxCols; j++) {
      const cell = document.createElement("div");
      cell.style.cssText = `
        background: white;
        border: 1px solid #d1d5db;
        cursor: pointer;
        transition: all 0.15s;
      `;
      cell.dataset.row = String(i);
      cell.dataset.col = String(j);
      cell.addEventListener("mouseenter", () => {
        selectedRows = i + 1;
        selectedCols = j + 1;
        updatePreview();
        updateLabel();
        onChange(selectedRows, selectedCols);
      });
      cell.addEventListener("mouseleave", () => {
        if (!selector.matches(":hover")) {
          selectedRows = 0;
          selectedCols = 0;
          updatePreview();
          updateLabel();
        }
      });
      selector.appendChild(cell);
    }
  }
  function updatePreview() {
    const cells = selector.querySelectorAll("div");
    cells.forEach((cell) => {
      const el = cell;
      const row = Number.parseInt(el.dataset.row || "0");
      const col = Number.parseInt(el.dataset.col || "0");
      if (row < selectedRows && col < selectedCols) {
        el.style.background = "#3b82f6";
        el.style.borderColor = "#3b82f6";
      } else {
        el.style.background = "white";
        el.style.borderColor = "#d1d5db";
      }
    });
  }
  const label = document.createElement("div");
  label.style.cssText = `
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  `;
  label.textContent = "0 \xD7 0";
  function updateLabel() {
    label.textContent = selectedRows > 0 ? `${selectedRows} \xD7 ${selectedCols}` : "\u8BF7\u9009\u62E9\u8868\u683C\u5927\u5C0F";
  }
  container.appendChild(selector);
  container.appendChild(label);
  return container;
}
function showTableDialog(options) {
  const {
    onConfirm,
    onCancel
  } = options;
  let previewRows = 3;
  let previewCols = 3;
  const selectorComponent = createTableSelector((rows, cols) => {
    previewRows = rows;
    previewCols = cols;
  });
  const content = document.createElement("div");
  content.appendChild(selectorComponent);
  showUnifiedDialog({
    title: "\u63D2\u5165\u8868\u683C",
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
      <line x1="15" y1="3" x2="15" y2="21"/>
    </svg>`,
    content,
    fields: [{
      id: "rows",
      type: "number",
      label: "\u884C\u6570",
      placeholder: "\u8BF7\u8F93\u5165\u884C\u6570",
      defaultValue: 3,
      min: 1,
      max: 50,
      required: true
    }, {
      id: "cols",
      type: "number",
      label: "\u5217\u6570",
      placeholder: "\u8BF7\u8F93\u5165\u5217\u6570",
      defaultValue: 3,
      min: 1,
      max: 50,
      required: true
    }],
    buttons: [{
      id: "cancel",
      label: "\u53D6\u6D88",
      type: "secondary",
      onClick: () => onCancel?.(),
      closeOnClick: true
    }, {
      id: "confirm",
      label: "\u63D2\u5165",
      type: "primary",
      onClick: (dialog) => {
        const rows = dialog.getFieldValue("rows") || previewRows;
        const cols = dialog.getFieldValue("cols") || previewCols;
        if (rows >= 1 && cols >= 1 && rows <= 50 && cols <= 50) {
          onConfirm(rows, cols);
          dialog.close();
        } else {
          dialog.showError("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u884C\u6570\u548C\u5217\u6570\uFF081-50\uFF09");
        }
      }
    }],
    onSubmit: (data) => {
      const rows = data.rows || previewRows;
      const cols = data.cols || previewCols;
      if (rows >= 1 && cols >= 1 && rows <= 50 && cols <= 50)
        onConfirm(rows, cols);
    }
  });
}

export { showTableDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=TableDialog.js.map
