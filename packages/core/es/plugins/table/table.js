/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { registerContextMenu } from '../../core/ContextMenuManager.js';
import { createPlugin } from '../../core/Plugin.js';

const tableSelections = /* @__PURE__ */ new WeakMap();
function setupTableSelection(table) {
  let isSelecting = false;
  let startCell = null;
  const selectedCells = /* @__PURE__ */ new Set();
  let cachedGrid = null;
  const clearSelection = () => {
    selectedCells.forEach((cell) => {
      cell.classList.remove("table-cell-selected");
    });
    selectedCells.clear();
    startCell = null;
    isSelecting = false;
    cachedGrid = null;
    table.classList.remove("selecting");
  };
  const selectColumn = (colIndex) => {
    clearSelection();
    Array.from(table.rows).forEach((row) => {
      const cell = row.cells[colIndex];
      if (cell) {
        cell.classList.add("table-cell-selected");
        selectedCells.add(cell);
      }
    });
    saveSelection();
  };
  const selectRow = (rowIndex) => {
    clearSelection();
    const row = table.rows[rowIndex];
    if (row) {
      Array.from(row.cells).forEach((cell) => {
        cell.classList.add("table-cell-selected");
        selectedCells.add(cell);
      });
    }
    saveSelection();
  };
  const getCellPosition = (cell, grid) => {
    const logicalGrid = grid || createLogicalGrid();
    let cellRow = -1;
    let cellCol = -1;
    let cellRowEnd = -1;
    let cellColEnd = -1;
    for (let r = 0; r < logicalGrid.length; r++) {
      for (let c = 0; c < logicalGrid[r].length; c++) {
        if (logicalGrid[r][c] === cell) {
          if (cellRow === -1) {
            cellRow = r;
            cellCol = c;
          }
          cellRowEnd = r;
          cellColEnd = c;
        }
      }
    }
    return {
      row: cellRow,
      col: cellCol,
      rowEnd: cellRowEnd,
      colEnd: cellColEnd
    };
  };
  const createLogicalGrid = () => {
    const rowCount = table.rows.length;
    const colCount = Math.max(...Array.from(table.rows).map((row) => {
      let count = 0;
      Array.from(row.cells).forEach((cell) => {
        count += Number.parseInt(cell.getAttribute("colspan") || "1");
      });
      return count;
    }));
    const grid = new Array(rowCount).fill(null).map(() => new Array(colCount).fill(null));
    for (let r = 0; r < table.rows.length; r++) {
      const row = table.rows[r];
      let logicalCol = 0;
      for (let c = 0; c < row.cells.length; c++) {
        const cell = row.cells[c];
        const rowspan = Number.parseInt(cell.getAttribute("rowspan") || "1");
        const colspan = Number.parseInt(cell.getAttribute("colspan") || "1");
        while (logicalCol < colCount && grid[r][logicalCol] !== null) {
          logicalCol++;
        }
        for (let dr = 0; dr < rowspan && r + dr < rowCount; dr++) {
          for (let dc = 0; dc < colspan && logicalCol + dc < colCount; dc++)
            grid[r + dr][logicalCol + dc] = cell;
        }
        logicalCol += colspan;
      }
    }
    return grid;
  };
  const updateSelection = (endCell) => {
    if (!startCell)
      return;
    selectedCells.forEach((cell) => {
      cell.classList.remove("table-cell-selected");
    });
    selectedCells.clear();
    if (!cachedGrid)
      cachedGrid = createLogicalGrid();
    const grid = cachedGrid;
    const startPos = getCellPosition(startCell, grid);
    const endPos = getCellPosition(endCell, grid);
    let minRow = Math.min(startPos.row, endPos.row);
    let maxRow = Math.max(startPos.rowEnd, endPos.rowEnd);
    let minCol = Math.min(startPos.col, endPos.col);
    let maxCol = Math.max(startPos.colEnd, endPos.colEnd);
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (let r = minRow; r <= maxRow && r < grid.length; r++) {
        for (let c = minCol; c <= maxCol && c < grid[r].length; c++) {
          const cell = grid[r][c];
          if (cell && !selectedCells.has(cell)) {
            const pos = getCellPosition(cell);
            if (pos.row < minRow) {
              minRow = pos.row;
              expanded = true;
            }
            if (pos.rowEnd > maxRow) {
              maxRow = pos.rowEnd;
              expanded = true;
            }
            if (pos.col < minCol) {
              minCol = pos.col;
              expanded = true;
            }
            if (pos.colEnd > maxCol) {
              maxCol = pos.colEnd;
              expanded = true;
            }
          }
        }
      }
    }
    const addedCells = /* @__PURE__ */ new Set();
    for (let r = minRow; r <= maxRow && r < grid.length; r++) {
      for (let c = minCol; c <= maxCol && c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell && !addedCells.has(cell)) {
          cell.classList.add("table-cell-selected");
          selectedCells.add(cell);
          addedCells.add(cell);
        }
      }
    }
    saveSelection();
  };
  const saveSelection = () => {
    tableSelections.set(table, {
      startCell,
      endCell: null,
      selectedCells
    });
  };
  table.addEventListener("contextmenu", (e) => {
    const cell = e.target.closest("th");
    if (cell) {
      const row = cell.parentElement;
      const colIndex = Array.from(row.cells).indexOf(cell);
      selectColumn(colIndex);
    }
  });
  table.addEventListener("mousedown", (e) => {
    if (e.button === 2)
      return;
    const target = e.target;
    const cell = target.closest("td, th");
    if (!cell)
      return;
    if (target.classList.contains("table-column-resizer"))
      return;
    if (target === cell || cell.contains(target)) {
      if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        clearSelection();
        return;
      }
    }
    if (e.ctrlKey) {
      const row = cell.parentElement;
      const rowIndex = Array.from(table.rows).indexOf(row);
      selectRow(rowIndex);
      e.preventDefault();
      return;
    }
    if (e.altKey) {
      const row = cell.parentElement;
      const colIndex = Array.from(row.cells).indexOf(cell);
      selectColumn(colIndex);
      e.preventDefault();
      return;
    }
    if (e.shiftKey && startCell) {
      e.preventDefault();
      updateSelection(cell);
      return;
    }
    if (e.shiftKey) {
      clearSelection();
      isSelecting = true;
      startCell = cell;
      cachedGrid = null;
      cell.classList.add("table-cell-selected");
      selectedCells.add(cell);
      saveSelection();
      table.classList.add("selecting");
      e.preventDefault();
    }
  });
  table.addEventListener("mousemove", (e) => {
    if (!isSelecting || !startCell || !e.shiftKey) {
      if (isSelecting && !e.shiftKey) {
        isSelecting = false;
      }
      return;
    }
    const cell = e.target.closest("td, th");
    if (cell && table.contains(cell))
      updateSelection(cell);
  });
  const handleMouseUp = () => {
    isSelecting = false;
    table.classList.remove("selecting");
  };
  document.addEventListener("mouseup", handleMouseUp);
  const cleanupObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
        for (const node of mutation.removedNodes) {
          if (node === table || node?.contains?.(table)) {
            document.removeEventListener("mouseup", handleMouseUp);
            cleanupObserver.disconnect();
            return;
          }
        }
      }
    }
  });
  if (table.parentElement)
    cleanupObserver.observe(table.parentElement, {
      childList: true,
      subtree: true
    });
  table.addEventListener("selectstart", (e) => {
    if (isSelecting)
      e.preventDefault();
  });
  setupColumnResize(table);
  const observer = new MutationObserver(() => {
    cachedGrid = null;
  });
  observer.observe(table, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["colspan", "rowspan"]
  });
}
function setupColumnResize(table) {
  const headerCells = table.querySelectorAll("th");
  headerCells.forEach((th, index) => {
    if (index === headerCells.length - 1)
      return;
    const resizer = document.createElement("div");
    resizer.className = "table-column-resizer";
    resizer.style.cssText = `
      position: absolute;
      right: -3px;
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 10;
      background: transparent;
    `;
    resizer.addEventListener("mouseenter", () => {
      resizer.style.background = "rgba(59, 130, 246, 0.5)";
    });
    resizer.addEventListener("mouseleave", () => {
      resizer.style.background = "transparent";
    });
    let startX = 0;
    let startWidth = 0;
    const currentColumn = index;
    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX;
      startWidth = th.offsetWidth;
      table.classList.add("resizing");
      document.body.style.cursor = "col-resize";
      const handleMouseMove = (e2) => {
        const diff = e2.clientX - startX;
        const newWidth = Math.max(60, startWidth + diff);
        Array.from(table.rows).forEach((row) => {
          const cell = row.cells[currentColumn];
          if (cell) {
            cell.style.width = `${newWidth}px`;
            cell.style.minWidth = `${newWidth}px`;
            cell.style.maxWidth = `${newWidth}px`;
          }
        });
        table.style.tableLayout = "fixed";
      };
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        table.classList.remove("resizing");
        document.body.style.cursor = "";
        const event = new Event("input", {
          bubbles: true
        });
        table.dispatchEvent(event);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });
    th.style.position = "relative";
    th.appendChild(resizer);
  });
}
function getSelectedCells(table) {
  const selection = tableSelections.get(table);
  if (!selection)
    return [];
  return Array.from(selection.selectedCells);
}
function insertRowAbove(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetRow = null;
  while (node && node !== table) {
    if (node.nodeName === "TR") {
      targetRow = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetRow)
    return;
  const newRow = targetRow.cloneNode(true);
  Array.from(newRow.cells).forEach((cell) => {
    cell.innerHTML = "&nbsp;";
  });
  targetRow.parentNode?.insertBefore(newRow, targetRow);
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function insertRowBelow(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetRow = null;
  while (node && node !== table) {
    if (node.nodeName === "TR") {
      targetRow = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetRow)
    return;
  const newRow = targetRow.cloneNode(true);
  Array.from(newRow.cells).forEach((cell) => {
    cell.innerHTML = "&nbsp;";
  });
  targetRow.parentNode?.insertBefore(newRow, targetRow.nextSibling);
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function insertColumnLeft(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const targetRow = targetCell.parentElement;
  const colIndex = Array.from(targetRow.cells).indexOf(targetCell);
  Array.from(table.rows).forEach((row) => {
    const newCell = row.cells[colIndex].cloneNode(false);
    newCell.innerHTML = "&nbsp;";
    newCell.setAttribute("contenteditable", "true");
    row.insertBefore(newCell, row.cells[colIndex]);
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function insertColumnRight(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const targetRow = targetCell.parentElement;
  const colIndex = Array.from(targetRow.cells).indexOf(targetCell);
  Array.from(table.rows).forEach((row) => {
    const newCell = row.cells[colIndex].cloneNode(false);
    newCell.innerHTML = "&nbsp;";
    newCell.setAttribute("contenteditable", "true");
    if (colIndex + 1 < row.cells.length)
      row.insertBefore(newCell, row.cells[colIndex + 1]);
    else
      row.appendChild(newCell);
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function deleteCurrentRow(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetRow = null;
  while (node && node !== table) {
    if (node.nodeName === "TR") {
      targetRow = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetRow)
    return;
  const tbody = targetRow.parentElement;
  if (tbody && tbody.children.length > 1) {
    targetRow.remove();
    const event = new Event("input", {
      bubbles: true
    });
    table.dispatchEvent(event);
  }
}
function deleteCurrentColumn(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const targetRow = targetCell.parentElement;
  const colIndex = Array.from(targetRow.cells).indexOf(targetCell);
  const firstRow = table.rows[0];
  if (firstRow && firstRow.cells.length > 1) {
    Array.from(table.rows).forEach((row) => {
      if (row.cells[colIndex])
        row.cells[colIndex].remove();
    });
    const event = new Event("input", {
      bubbles: true
    });
    table.dispatchEvent(event);
  }
}
function deleteEntireTable(table) {
  if (confirm("\u786E\u5B9A\u8981\u5220\u9664\u6574\u4E2A\u8868\u683C\u5417\uFF1F")) {
    table.remove();
    const editorContent = document.querySelector(".ldesign-editor-content");
    if (editorContent) {
      const event = new Event("input", {
        bubbles: true
      });
      editorContent.dispatchEvent(event);
    }
  }
}
function clearTable(table) {
  const cells = table.querySelectorAll("td");
  cells.forEach((cell) => {
    cell.innerHTML = "&nbsp;";
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function mergeCells(table) {
  const selectedCells = getSelectedCells(table);
  if (selectedCells.length < 2) {
    alert("\u8BF7\u9009\u62E9\u591A\u4E2A\u5355\u5143\u683C\u8FDB\u884C\u5408\u5E76");
    return;
  }
  const createLogicalGrid = () => {
    const rowCount = table.rows.length;
    const colCount = Math.max(...Array.from(table.rows).map((row) => {
      let count = 0;
      Array.from(row.cells).forEach((cell) => {
        count += Number.parseInt(cell.getAttribute("colspan") || "1");
      });
      return count;
    }));
    const grid2 = new Array(rowCount).fill(null).map(() => new Array(colCount).fill(null));
    for (let r = 0; r < table.rows.length; r++) {
      const row = table.rows[r];
      let logicalCol = 0;
      for (let c = 0; c < row.cells.length; c++) {
        const cell = row.cells[c];
        const rowspan = Number.parseInt(cell.getAttribute("rowspan") || "1");
        const colspan = Number.parseInt(cell.getAttribute("colspan") || "1");
        while (logicalCol < colCount && grid2[r][logicalCol] !== null) {
          logicalCol++;
        }
        for (let dr = 0; dr < rowspan && r + dr < rowCount; dr++) {
          for (let dc = 0; dc < colspan && logicalCol + dc < colCount; dc++)
            grid2[r + dr][logicalCol + dc] = cell;
        }
        logicalCol += colspan;
      }
    }
    return grid2;
  };
  const grid = createLogicalGrid();
  let minRow = Infinity;
  let maxRow = -1;
  let minCol = Infinity;
  let maxCol = -1;
  let topLeftCell = null;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (cell && selectedCells.includes(cell)) {
        if (r < minRow) {
          minRow = r;
          minCol = c;
          topLeftCell = cell;
        } else if (r === minRow && c < minCol) {
          minCol = c;
          topLeftCell = cell;
        }
        maxRow = Math.max(maxRow, r);
        maxCol = Math.max(maxCol, c);
      }
    }
  }
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const cell = grid[r][c];
      if (!cell || !selectedCells.includes(cell)) {
        alert("\u8BF7\u9009\u62E9\u4E00\u4E2A\u5B8C\u6574\u7684\u77E9\u5F62\u533A\u57DF\u8FDB\u884C\u5408\u5E76");
        return;
      }
    }
  }
  if (!topLeftCell) {
    alert("\u65E0\u6CD5\u627E\u5230\u5408\u5E76\u7684\u8D77\u59CB\u5355\u5143\u683C");
    return;
  }
  const contents = [];
  const cellsToRemove = /* @__PURE__ */ new Set();
  selectedCells.forEach((cell) => {
    const text = cell.textContent?.trim();
    if (text && text !== "\xA0" && text !== "")
      contents.push(text);
    if (cell !== topLeftCell)
      cellsToRemove.add(cell);
  });
  const rowSpan = maxRow - minRow + 1;
  const colSpan = maxCol - minCol + 1;
  topLeftCell.setAttribute("rowspan", String(rowSpan));
  topLeftCell.setAttribute("colspan", String(colSpan));
  topLeftCell.textContent = contents.join(" ") || "\xA0";
  cellsToRemove.forEach((cell) => {
    cell.remove();
  });
  selectedCells.forEach((cell) => {
    cell.classList.remove("table-cell-selected");
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function splitCell(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const colspan = Number.parseInt(targetCell.getAttribute("colspan") || "1");
  const rowspan = Number.parseInt(targetCell.getAttribute("rowspan") || "1");
  if (colspan === 1 && rowspan === 1) {
    alert("\u8BE5\u5355\u5143\u683C\u672A\u88AB\u5408\u5E76\uFF0C\u65E0\u9700\u62C6\u5206");
    return;
  }
  targetCell.removeAttribute("colspan");
  targetCell.removeAttribute("rowspan");
  const row = targetCell.parentElement;
  for (let i = 1; i < colspan; i++) {
    const newCell = document.createElement(targetCell.tagName.toLowerCase());
    newCell.innerHTML = "&nbsp;";
    newCell.setAttribute("contenteditable", "true");
    row.insertBefore(newCell, targetCell.nextSibling);
  }
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function toggleTableHeader(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const row = targetCell.parentElement;
  const cells = Array.from(row.cells);
  const isHeader = cells.every((cell) => cell.tagName === "TH");
  cells.forEach((cell) => {
    const newCell = document.createElement(isHeader ? "td" : "th");
    newCell.innerHTML = cell.innerHTML;
    newCell.setAttribute("contenteditable", "true");
    Array.from(cell.attributes).forEach((attr) => {
      if (attr.name !== "contenteditable")
        newCell.setAttribute(attr.name, attr.value);
    });
    cell.parentNode?.replaceChild(newCell, cell);
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function increaseColumnWidth(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const targetRow = targetCell.parentElement;
  const colIndex = Array.from(targetRow.cells).indexOf(targetCell);
  Array.from(table.rows).forEach((row) => {
    const cell = row.cells[colIndex];
    if (cell) {
      const currentWidth = cell.offsetWidth;
      const newWidth = currentWidth + 20;
      cell.style.width = `${newWidth}px`;
      cell.style.minWidth = `${newWidth}px`;
    }
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function decreaseColumnWidth(table) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return;
  let node = selection.anchorNode;
  let targetCell = null;
  while (node && node !== table) {
    if (node.nodeName === "TD" || node.nodeName === "TH") {
      targetCell = node;
      break;
    }
    node = node.parentNode;
  }
  if (!targetCell)
    return;
  const targetRow = targetCell.parentElement;
  const colIndex = Array.from(targetRow.cells).indexOf(targetCell);
  Array.from(table.rows).forEach((row) => {
    const cell = row.cells[colIndex];
    if (cell) {
      const currentWidth = cell.offsetWidth;
      const newWidth = Math.max(60, currentWidth - 20);
      cell.style.width = `${newWidth}px`;
      cell.style.minWidth = `${newWidth}px`;
    }
  });
  const event = new Event("input", {
    bubbles: true
  });
  table.dispatchEvent(event);
}
function createTableElement(rows, cols) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  const table = document.createElement("table");
  table.style.position = "relative";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (let j = 0; j < cols; j++) {
    const th = document.createElement("th");
    th.textContent = `\u5217 ${j + 1}`;
    th.setAttribute("contenteditable", "true");
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");
      td.innerHTML = "&nbsp;";
      td.setAttribute("contenteditable", "true");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrapper.appendChild(table);
  setTimeout(() => setupTableSelection(table), 0);
  return wrapper;
}
const insertTable = (state, dispatch) => {
  console.log("\u{1F4CB} [Table] insertTable command called");
  console.log("\u{1F4CB} [Table] dispatch:", dispatch ? "exists" : "null");
  if (!dispatch) {
    console.log("\u{1F4CB} [Table] No dispatch, returning true");
    return true;
  }
  console.log("\u{1F4CB} [Table] Creating simple table selector");
  const editorContent = document.querySelector(".ldesign-editor-content");
  if (!editorContent) {
    console.log("\u274C [Table] Editor content not found");
    return false;
  }
  const originalSelection = window.getSelection();
  let savedRange = null;
  if (originalSelection && originalSelection.rangeCount > 0) {
    const range = originalSelection.getRangeAt(0);
    if (editorContent.contains(range.commonAncestorContainer)) {
      savedRange = range.cloneRange();
      console.log("\u{1F4CB} [Table] Saved selection range:", savedRange);
    }
  }
  try {
    const tableButton = document.querySelector('[data-name="table"]');
    console.log("\u{1F4CB} [Table] Table button found:", !!tableButton);
    const overlay = document.createElement("div");
    overlay.className = "editor-dialog-overlay editor-table-overlay";
    overlay.style.cssText = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: transparent; z-index: 10000;";
    const dialog = document.createElement("div");
    dialog.className = "editor-dialog editor-table-dialog";
    if (tableButton) {
      const rect = tableButton.getBoundingClientRect();
      dialog.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        visibility: hidden;
        max-width: 260px;
      `;
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      const dialogWidth2 = dialog.offsetWidth;
      const dialogHeight = dialog.offsetHeight;
      console.log("\u{1F4CB} [Table] Dialog actual size:", dialogWidth2, "x", dialogHeight);
      let left = rect.left;
      let top = rect.bottom + 8;
      const rightOverflow = left + dialogWidth2 - window.innerWidth;
      if (rightOverflow > 0)
        left = left - rightOverflow - 16;
      if (left < 16)
        left = 16;
      const bottomOverflow = top + dialogHeight - window.innerHeight;
      if (bottomOverflow > 0) {
        const topPosition = rect.top - dialogHeight - 8;
        if (topPosition >= 16) {
          top = topPosition;
        } else {
          top = Math.max(16, (window.innerHeight - dialogHeight) / 2 - 50);
        }
      }
      if (top < 16)
        top = 16;
      console.log("\u{1F4CB} [Table] Final position:", left, top);
      dialog.style.cssText = `
        position: fixed;
        left: ${left}px;
        top: ${top}px;
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        visibility: visible;
        max-width: 260px;
      `;
    } else {
      dialog.style.cssText = "position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; border-radius: 8px; padding: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); border: 1px solid #e5e7eb; max-width: 260px;";
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    }
    dialog.innerHTML = `
      <style>
        .editor-table-dialog-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .editor-table-dialog-title svg {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }
        .grid-table {
          display: grid;
          gap: 3px;
          background: #f9fafb;
          padding: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .grid-cell {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          min-height: 0;
          aspect-ratio: 1;
          box-sizing: border-box;
        }
        .grid-cell:hover {
          background: #dbeafe;
          border-color: #93c5fd;
          box-shadow: 0 0 0 1px #93c5fd inset;
        }
        .grid-cell.selected {
          background: #3b82f6;
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb inset;
        }
        .grid-cell:active {
          background: #2563eb;
          border-color: #1e40af;
          box-shadow: 0 0 0 1px #1e40af inset;
        }
        .grid-info {
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
          padding: 6px 8px;
          background: #f3f4f6;
          border-radius: 4px;
        }
        .close-hint {
          margin-top: 6px;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }
      </style>
      
      <div class="editor-table-dialog-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
        <span>\u9009\u62E9\u8868\u683C\u5927\u5C0F</span>
      </div>
      <div class="grid-table" id="grid-table"></div>
      <div class="grid-info" id="grid-info">0 \xD7 0 \u8868\u683C</div>
      <div class="close-hint">\u70B9\u51FB\u786E\u8BA4 \xB7 ESC\u53D6\u6D88</div>
    `;
    if (!document.body.contains(overlay)) {
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    }
    console.log("\u{1F4CB} [Table] Dialog created and appended");
    const gridTable = dialog.querySelector("#grid-table");
    const gridInfo = dialog.querySelector("#grid-info");
    const cellSize = 24;
    const gap = 3;
    const padding = 6;
    const border = 2;
    const maxRows = 8;
    const dialogWidth = dialog.offsetWidth;
    const dialogPadding = 12 * 2;
    const availableWidth = dialogWidth - dialogPadding - padding * 2 - border;
    const cols = Math.max(6, Math.min(15, Math.floor((availableWidth + gap) / (cellSize + gap))));
    const rows = maxRows;
    console.log("\u{1F4CB} [Table] Grid size:", cols, "x", rows, "available width:", availableWidth);
    gridTable.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridTable.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    const gridWidth = cols * cellSize + (cols - 1) * gap + padding * 2;
    const gridHeight = rows * cellSize + (rows - 1) * gap + padding * 2;
    gridTable.style.width = `${gridWidth}px`;
    gridTable.style.height = `${gridHeight}px`;
    const totalCells = cols * rows;
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.row = String(Math.floor(i / cols) + 1);
      cell.dataset.col = String(i % cols + 1);
      gridTable.appendChild(cell);
    }
    const closeDialog = () => {
      overlay.remove();
    };
    const insertTableWithSize = (rows2, cols2) => {
      console.log(`\u{1F4CB} [Table] Inserting table: ${rows2}x${cols2}`);
      closeDialog();
      if (rows2 < 1 || cols2 < 1 || rows2 > 100 || cols2 > 20) {
        console.log("\u274C [Table] Invalid table size");
        return;
      }
      if (!editorContent) {
        console.log("\u274C [Table] Editor content not found");
        return;
      }
      editorContent.focus();
      const selection = window.getSelection();
      console.log("\u{1F4CB} [Table] Selection after focus:", selection);
      let range;
      if (savedRange && selection) {
        range = savedRange;
        selection.removeAllRanges();
        selection.addRange(range);
        console.log("\u{1F4CB} [Table] Using saved range at cursor position");
      } else {
        console.log("\u26A0\uFE0F [Table] No saved range, appending at end");
        const tableWrapper2 = createTableElement(rows2, cols2);
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        const lastP = editorContent.querySelector("p:last-of-type");
        if (lastP) {
          lastP.insertAdjacentElement("afterend", tableWrapper2);
          tableWrapper2.insertAdjacentElement("afterend", p);
        } else {
          editorContent.appendChild(tableWrapper2);
          editorContent.appendChild(p);
        }
        console.log("\u{1F4CB} [Table] Table appended to editor");
        const event = new Event("input", {
          bubbles: true
        });
        editorContent.dispatchEvent(event);
        return;
      }
      const tableWrapper = createTableElement(rows2, cols2);
      const table = tableWrapper.querySelector("table");
      console.log("\u{1F4CB} [Table] Table element created:", table);
      console.log("\u{1F4CB} [Table] Before insertion - Editor HTML length:", editorContent.innerHTML.length);
      console.log("\u{1F4CB} [Table] Before insertion - Editor children:", editorContent.children.length);
      try {
        range.deleteContents();
        const container = range.commonAncestorContainer;
        if (container.nodeType === Node.TEXT_NODE || container.nodeType === Node.ELEMENT_NODE && container.tagName === "P") {
          const p = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
          if (p && p.tagName === "P") {
            p.insertAdjacentElement("afterend", tableWrapper);
            const newP = document.createElement("p");
            newP.innerHTML = "<br>";
            tableWrapper.insertAdjacentElement("afterend", newP);
            console.log("\u{1F4CB} [Table] Inserted after paragraph");
          } else {
            range.insertNode(tableWrapper);
            console.log("\u{1F4CB} [Table] Inserted at range");
          }
        } else {
          range.insertNode(tableWrapper);
          console.log("\u{1F4CB} [Table] Inserted at range");
        }
      } catch (error) {
        console.log("\u26A0\uFE0F [Table] Error inserting, appending to end:", error);
        editorContent.appendChild(tableWrapper);
      }
      let nextP = tableWrapper.nextElementSibling;
      if (!nextP || nextP.tagName !== "P") {
        nextP = document.createElement("p");
        nextP.innerHTML = "<br>";
        tableWrapper.insertAdjacentElement("afterend", nextP);
      }
      console.log("\u{1F4CB} [Table] After insertion - Table parent:", table.parentElement?.className);
      console.log("\u{1F4CB} [Table] After insertion - Editor HTML length:", editorContent.innerHTML.length);
      console.log("\u{1F4CB} [Table] After insertion - Editor children:", editorContent.children.length);
      console.log("\u{1F4CB} [Table] After insertion - Table in DOM:", document.body.contains(table));
      const tables = editorContent.querySelectorAll("table");
      console.log("\u{1F4CB} [Table] Tables in editor:", tables.length);
      setTimeout(() => {
        const newRange = document.createRange();
        newRange.selectNodeContents(nextP);
        newRange.collapse(false);
        const newSelection = window.getSelection();
        if (newSelection) {
          newSelection.removeAllRanges();
          newSelection.addRange(newRange);
          editorContent.focus();
          console.log("\u{1F4CB} [Table] Cursor set to paragraph after table");
        }
        table.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 50);
      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true
      });
      const changeEvent = new Event("change", {
        bubbles: true
      });
      editorContent.dispatchEvent(inputEvent);
      editorContent.dispatchEvent(changeEvent);
      console.log("\u2705 [Table] All events dispatched");
      setTimeout(() => {
        console.log("\u{1F4CB} [Table] Delayed check - Table still in DOM:", document.body.contains(table));
        console.log("\u{1F4CB} [Table] Delayed check - Editor HTML length:", editorContent.innerHTML.length);
        const tablesAfter = editorContent.querySelectorAll("table");
        console.log("\u{1F4CB} [Table] Delayed check - Tables in editor:", tablesAfter.length);
      }, 100);
    };
    const updateGridSelection = (rows2, cols2) => {
      const cells = gridTable.querySelectorAll(".grid-cell");
      cells.forEach((cell) => {
        const cellEl = cell;
        const r = Number.parseInt(cellEl.dataset.row || "0");
        const c = Number.parseInt(cellEl.dataset.col || "0");
        if (r <= rows2 && c <= cols2)
          cellEl.classList.add("selected");
        else
          cellEl.classList.remove("selected");
      });
      gridInfo.textContent = `${rows2} \xD7 ${cols2} \u8868\u683C`;
    };
    gridTable.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (target.classList.contains("grid-cell")) {
        const rows2 = Number.parseInt(target.dataset.row || "0");
        const cols2 = Number.parseInt(target.dataset.col || "0");
        updateGridSelection(rows2, cols2);
      }
    });
    gridTable.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("grid-cell")) {
        const rows2 = Number.parseInt(target.dataset.row || "0");
        const cols2 = Number.parseInt(target.dataset.col || "0");
        insertTableWithSize(rows2, cols2);
      }
    });
    gridTable.addEventListener("mouseleave", () => {
      updateGridSelection(0, 0);
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay)
        closeDialog();
    });
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        closeDialog();
        document.removeEventListener("keydown", handleKeydown);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    console.log("\u2705 [Table] Dialog setup complete");
  } catch (error) {
    console.error("\u274C [Table] Error creating dialog:", error);
    console.error("\u274C [Table] Error stack:", error.stack);
  }
  console.log("\u2705 [Table] Command returning true");
  return true;
};
const addTableRow = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  let node = selection.anchorNode;
  let tr = null;
  while (node && node !== document.body) {
    if (node.nodeName === "TR") {
      tr = node;
      break;
    }
    node = node.parentNode;
  }
  if (!tr)
    return false;
  const newRow = tr.cloneNode(true);
  Array.from(newRow.cells).forEach((cell) => {
    cell.textContent = " ";
  });
  tr.parentNode?.insertBefore(newRow, tr.nextSibling);
  return true;
};
const addTableColumn = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  let node = selection.anchorNode;
  let table = null;
  while (node && node !== document.body) {
    if (node.nodeName === "TABLE") {
      table = node;
      break;
    }
    node = node.parentNode;
  }
  if (!table)
    return false;
  Array.from(table.rows).forEach((row) => {
    const cell = row.insertCell(-1);
    cell.textContent = " ";
    cell.style.border = "1px solid #ddd";
    cell.style.padding = "8px";
  });
  return true;
};
const deleteTableCommand = (state, dispatch) => {
  if (!dispatch)
    return true;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  let node = selection.anchorNode;
  let table = null;
  while (node && node !== document.body) {
    if (node.nodeName === "TABLE") {
      table = node;
      break;
    }
    node = node.parentNode;
  }
  if (table) {
    table.remove();
    return true;
  }
  return false;
};
function isInTable() {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName === "TABLE")
        return true;
      node = node.parentNode;
    }
    return false;
  };
}
const TablePlugin = createPlugin({
  name: "table",
  commands: {
    insertTable,
    addTableRow,
    addTableColumn,
    deleteTableCommand
  },
  toolbar: [{
    name: "table",
    title: "\u8868\u683C",
    icon: "table",
    command: insertTable,
    active: isInTable()
  }],
  // 初始化时注册表格右键菜单
  init: (editor) => {
    console.log("[TablePlugin] init \u88AB\u8C03\u7528");
    setTimeout(() => {
      console.log("[TablePlugin] \u5F00\u59CB\u6CE8\u518C\u8868\u683C\u53F3\u952E\u83DC\u5355");
      registerContextMenu({
        id: "table-context-menu",
        selector: ".ldesign-editor-content table, .ldesign-editor-content table td, .ldesign-editor-content table th",
        priority: 100,
        // 设置更高优先级
        condition: (element) => {
          const table = element.closest("table");
          return !!table && table.closest(".ldesign-editor-content") !== null;
        },
        items: (context) => {
          console.log("[TablePlugin] \u751F\u6210\u8868\u683C\u83DC\u5355\u9879, context:", context);
          const table = context.element.closest("table");
          if (!table) {
            console.log("[TablePlugin] \u672A\u627E\u5230\u8868\u683C\u5143\u7D20");
            return [];
          }
          console.log("[TablePlugin] \u627E\u5230\u8868\u683C\u5143\u7D20:", table);
          return [{
            label: "\u63D2\u5165\u4E0A\u65B9\u884C",
            action: () => insertRowAbove(table)
          }, {
            label: "\u63D2\u5165\u4E0B\u65B9\u884C",
            action: () => insertRowBelow(table)
          }, {
            label: "\u63D2\u5165\u5DE6\u4FA7\u5217",
            action: () => insertColumnLeft(table)
          }, {
            label: "\u63D2\u5165\u53F3\u4FA6\u5217",
            action: () => insertColumnRight(table)
          }, {
            divider: true
          }, {
            label: "\u5408\u5E76\u5355\u5143\u683C",
            action: () => mergeCells(table)
          }, {
            label: "\u62C6\u5206\u5355\u5143\u683C",
            action: () => splitCell(table)
          }, {
            label: "\u8BBE\u4E3A\u8868\u5934",
            action: () => toggleTableHeader(table)
          }, {
            divider: true
          }, {
            label: "\u589E\u52A0\u5217\u5BBD",
            action: () => increaseColumnWidth(table)
          }, {
            label: "\u51CF\u5C11\u5217\u5BBD",
            action: () => decreaseColumnWidth(table)
          }, {
            divider: true
          }, {
            label: "\u5220\u9664\u884C",
            action: () => deleteCurrentRow(table),
            className: "danger"
          }, {
            label: "\u5220\u9664\u5217",
            action: () => deleteCurrentColumn(table),
            className: "danger"
          }, {
            label: "\u6E05\u7A7A\u5185\u5BB9",
            action: () => clearTable(table),
            className: "danger"
          }, {
            divider: true
          }, {
            label: "\u5220\u9664\u8868\u683C",
            action: () => deleteEntireTable(table),
            className: "danger"
          }];
        }
      });
      console.log("[TablePlugin] \u8868\u683C\u53F3\u952E\u83DC\u5355\u5DF2\u6CE8\u518C");
    }, 100);
  }
});

export { TablePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=table.js.map
