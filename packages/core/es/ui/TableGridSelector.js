/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { showDropdown } from './Dropdown.js';

function showTableGridSelector(options) {
  const {
    onSelect,
    maxRows = 10,
    maxCols = 10,
    button
  } = options;
  const container = document.createElement("div");
  container.style.cssText = `
    width: ${maxCols * 26 + 16}px;
    padding: 8px;
    user-select: none;
  `;
  const header = document.createElement("div");
  header.style.cssText = `
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
    text-align: center;
  `;
  header.textContent = "\u9009\u62E9\u8868\u683C\u5927\u5C0F";
  container.appendChild(header);
  const gridContainer = document.createElement("div");
  gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${maxCols}, 24px);
    grid-template-rows: repeat(${maxRows}, 24px);
    gap: 2px;
    background: #f9fafb;
    padding: 4px;
    border-radius: 6px;
    margin-bottom: 8px;
  `;
  const sizeDisplay = document.createElement("div");
  sizeDisplay.style.cssText = `
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: #1f2937;
    padding: 6px;
    background: #f3f4f6;
    border-radius: 4px;
    margin-bottom: 4px;
    min-height: 20px;
  `;
  sizeDisplay.textContent = "\u79FB\u52A8\u9F20\u6807\u9009\u62E9";
  const hint = document.createElement("div");
  hint.style.cssText = `
    text-align: center;
    font-size: 11px;
    color: #9ca3af;
  `;
  hint.textContent = "\u70B9\u51FB\u786E\u8BA4 \xB7 ESC\u53D6\u6D88";
  const cells = [];
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const cell = document.createElement("div");
      cell.style.cssText = `
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.1s ease;
      `;
      cell.dataset.row = String(row + 1);
      cell.dataset.col = String(col + 1);
      cells.push(cell);
      gridContainer.appendChild(cell);
    }
  }
  const updateHighlight = (rows, cols) => {
    cells.forEach((cell) => {
      const cellRow = Number.parseInt(cell.dataset.row || "0");
      const cellCol = Number.parseInt(cell.dataset.col || "0");
      if (cellRow <= rows && cellCol <= cols) {
        cell.style.background = "#3b82f6";
        cell.style.borderColor = "#2563eb";
      } else {
        cell.style.background = "white";
        cell.style.borderColor = "#e5e7eb";
      }
    });
    if (rows > 0 && cols > 0)
      sizeDisplay.textContent = `${rows} \xD7 ${cols} \u8868\u683C`;
    else
      sizeDisplay.textContent = "\u79FB\u52A8\u9F20\u6807\u9009\u62E9";
  };
  const handleMouseMove = (e) => {
    const target = e.target;
    if (target.dataset.row && target.dataset.col) {
      const row = Number.parseInt(target.dataset.row);
      const col = Number.parseInt(target.dataset.col);
      updateHighlight(row, col);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (target.dataset.row && target.dataset.col) {
      const row = Number.parseInt(target.dataset.row);
      const col = Number.parseInt(target.dataset.col);
      if (row > 0 && col > 0) {
        const dropdown = container.closest(".editor-dropdown");
        if (dropdown) {
          dropdown.classList.add("closing");
          setTimeout(() => {
            onSelect(row, col);
            dropdown.remove();
          }, 150);
        }
      }
    }
  };
  const handleMouseLeave = () => {
    updateHighlight(0, 0);
  };
  gridContainer.addEventListener("mousemove", handleMouseMove);
  gridContainer.addEventListener("click", handleClick);
  gridContainer.addEventListener("mouseleave", handleMouseLeave);
  gridContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
  container.appendChild(gridContainer);
  container.appendChild(sizeDisplay);
  container.appendChild(hint);
  if (button) {
    showDropdown(button, {
      customContent: container,
      width: "auto",
      maxHeight: 400
    });
  } else {
    return container;
  }
}
function showEnhancedTableGridSelector(options) {
  const {
    onSelect,
    button
  } = options;
  let displayRows = 5;
  let displayCols = 5;
  const maxDisplayRows = 15;
  const maxDisplayCols = 15;
  const container = document.createElement("div");
  container.style.cssText = `
    padding: 8px;
    user-select: none;
  `;
  const gridWrapper = document.createElement("div");
  gridWrapper.style.cssText = `
    overflow: hidden;
    transition: all 0.2s ease;
  `;
  const gridContainer = document.createElement("div");
  gridContainer.style.cssText = `
    display: grid;
    gap: 2px;
    background: #f9fafb;
    padding: 4px;
    border-radius: 6px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  `;
  const sizeDisplay = document.createElement("div");
  sizeDisplay.style.cssText = `
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    padding: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 4px;
    margin-bottom: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `;
  sizeDisplay.textContent = "\u79FB\u52A8\u9F20\u6807\u9009\u62E9\u5927\u5C0F";
  let currentRows = 0;
  let currentCols = 0;
  const cells = /* @__PURE__ */ new Map();
  const getOrCreateCell = (row, col) => {
    const key = `${row}-${col}`;
    if (cells.has(key))
      return cells.get(key);
    const cell = document.createElement("div");
    cell.style.cssText = `
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 2px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      transition: all 0.1s ease;
    `;
    cell.dataset.row = String(row);
    cell.dataset.col = String(col);
    cells.set(key, cell);
    return cell;
  };
  const updateGridSize = (rows, cols) => {
    if (rows > displayRows - 1)
      displayRows = Math.min(rows + 2, maxDisplayRows);
    if (cols > displayCols - 1)
      displayCols = Math.min(cols + 2, maxDisplayCols);
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${displayCols}, 24px)`;
    gridContainer.style.gridTemplateRows = `repeat(${displayRows}, 24px)`;
    for (let r = 1; r <= displayRows; r++) {
      for (let c = 1; c <= displayCols; c++) {
        const cell = getOrCreateCell(r, c);
        if (r <= rows && c <= cols) {
          cell.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
          cell.style.borderColor = "#667eea";
          cell.style.transform = "scale(0.95)";
        } else {
          cell.style.background = "white";
          cell.style.borderColor = "#e5e7eb";
          cell.style.transform = "scale(1)";
        }
        gridContainer.appendChild(cell);
      }
    }
    currentRows = rows;
    currentCols = cols;
    if (rows > 0 && cols > 0) {
      sizeDisplay.innerHTML = `
        <div style="font-size: 20px; font-weight: bold;">${rows} \xD7 ${cols}</div>
        <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">\u70B9\u51FB\u63D2\u5165\u8868\u683C</div>
      `;
    } else {
      sizeDisplay.textContent = "\u79FB\u52A8\u9F20\u6807\u9009\u62E9\u5927\u5C0F";
    }
  };
  updateGridSize(0, 0);
  gridContainer.addEventListener("mousemove", (e) => {
    const target = e.target;
    if (target.dataset.row && target.dataset.col) {
      const row = Number.parseInt(target.dataset.row);
      const col = Number.parseInt(target.dataset.col);
      updateGridSize(row, col);
    }
  });
  gridContainer.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentRows > 0 && currentCols > 0) {
      const dropdown = container.closest(".editor-dropdown");
      if (dropdown) {
        dropdown.classList.add("closing");
        setTimeout(() => {
          onSelect(currentRows, currentCols);
          dropdown.remove();
        }, 150);
      }
    }
  });
  gridContainer.addEventListener("mouseleave", () => {
    displayRows = 5;
    displayCols = 5;
    updateGridSize(0, 0);
  });
  gridContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });
  gridWrapper.appendChild(gridContainer);
  container.appendChild(sizeDisplay);
  container.appendChild(gridWrapper);
  if (button) {
    showDropdown(button, {
      customContent: container,
      width: "auto",
      maxHeight: 500
    });
  }
}

export { showEnhancedTableGridSelector, showTableGridSelector };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=TableGridSelector.js.map
