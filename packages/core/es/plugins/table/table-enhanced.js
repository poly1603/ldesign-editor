/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createPlugin } from '../../core/Plugin.js';
import { showEnhancedTableGridSelector } from '../../ui/TableGridSelector.js';

function createTableElement(rows, cols) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.margin = "10px 0";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (let j = 0; j < cols; j++) {
    const th = document.createElement("th");
    th.textContent = `\u5217 ${j + 1}`;
    th.style.border = "1px solid #ddd";
    th.style.padding = "8px";
    th.style.backgroundColor = "#f5f5f5";
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
      td.style.border = "1px solid #ddd";
      td.style.padding = "8px";
      td.setAttribute("contenteditable", "true");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}
const insertTableEnhanced = (state, dispatch) => {
  console.log("\u{1F4CA} [Enhanced Table] Command called");
  if (!dispatch)
    return true;
  const editorContent = document.querySelector(".ldesign-editor-content");
  if (!editorContent) {
    console.error("\u274C Editor content not found");
    return false;
  }
  const selection = window.getSelection();
  let savedRange = null;
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorContent.contains(range.commonAncestorContainer))
      savedRange = range.cloneRange();
  }
  const tableButton = document.querySelector('[data-name="enhancedTable"]') || document.querySelector('[data-name="table"]');
  showEnhancedTableGridSelector({
    button: tableButton,
    onSelect: (rows, cols) => {
      console.log(`\u{1F4CA} Inserting ${rows}x${cols} table`);
      if (rows < 1 || cols < 1 || rows > 50 || cols > 20) {
        console.error("Invalid table size");
        return;
      }
      const tableWrapper = createTableElement(rows, cols);
      editorContent.focus();
      if (savedRange) {
        const currentSelection = window.getSelection();
        if (currentSelection) {
          currentSelection.removeAllRanges();
          currentSelection.addRange(savedRange);
          try {
            savedRange.deleteContents();
            const container = savedRange.commonAncestorContainer;
            const parentElement = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
            if (parentElement && parentElement.tagName === "P") {
              parentElement.insertAdjacentElement("afterend", tableWrapper);
              const newP = document.createElement("p");
              newP.innerHTML = "<br>";
              tableWrapper.insertAdjacentElement("afterend", newP);
              setTimeout(() => {
                const newRange = document.createRange();
                newRange.selectNodeContents(newP);
                newRange.collapse(false);
                currentSelection.removeAllRanges();
                currentSelection.addRange(newRange);
              }, 50);
            } else {
              savedRange.insertNode(tableWrapper);
            }
          } catch (error) {
            console.error("Error inserting table:", error);
            editorContent.appendChild(tableWrapper);
          }
        }
      } else {
        const lastElement = editorContent.lastElementChild;
        if (lastElement && lastElement.tagName === "P")
          lastElement.insertAdjacentElement("afterend", tableWrapper);
        else
          editorContent.appendChild(tableWrapper);
        const newP = document.createElement("p");
        newP.innerHTML = "<br>";
        tableWrapper.insertAdjacentElement("afterend", newP);
      }
      const event = new Event("input", {
        bubbles: true
      });
      editorContent.dispatchEvent(event);
      tableWrapper.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
      console.log("\u2705 Table inserted successfully");
    }
  });
  return true;
};
const EnhancedTablePlugin = createPlugin({
  name: "enhancedTable",
  commands: {
    insertTableEnhanced
  },
  toolbar: [{
    name: "enhancedTable",
    title: "\u63D2\u5165\u8868\u683C\uFF08\u589E\u5F3A\u7248\uFF09",
    icon: "table",
    command: insertTableEnhanced
  }]
});

export { EnhancedTablePlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=table-enhanced.js.map
