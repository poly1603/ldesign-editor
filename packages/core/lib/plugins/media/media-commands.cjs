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

Object.defineProperty(exports, '__esModule', { value: true });

const MediaCommandsPlugin = {
  name: "MediaCommands",
  install(editor) {
    editor.commands.register("insertImage", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e2) => {
            const img = document.createElement("img");
            img.src = e2.target.result;
            img.style.maxWidth = "100%";
            editor.insertHTML(img.outerHTML);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return true;
    });
    editor.commands.register("insertVideo", () => {
      const url = prompt("Enter video URL:");
      if (url) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.style.maxWidth = "100%";
        editor.insertHTML(video.outerHTML);
      }
      return true;
    });
    editor.commands.register("insertAudio", () => {
      const url = prompt("Enter audio URL:");
      if (url) {
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        editor.insertHTML(audio.outerHTML);
      }
      return true;
    });
    editor.commands.register("insertTable", () => {
      console.log("[MediaCommands] insertTable called - showing grid selector");
      const tableButton = document.querySelector('[data-name="table"]');
      if (!tableButton) {
        console.error("[MediaCommands] Table button not found");
        return false;
      }
      const editorContent = document.querySelector(".ldesign-editor-content");
      if (!editorContent) {
        console.error("[MediaCommands] Editor content not found");
        return false;
      }
      const selection = window.getSelection();
      let savedRange = null;
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorContent.contains(range.commonAncestorContainer))
          savedRange = range.cloneRange();
      }
      const existing = document.querySelector(".table-grid-selector");
      if (existing)
        existing.remove();
      const selector = document.createElement("div");
      selector.className = "table-grid-selector";
      selector.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 12px;
        z-index: 999999;
      `;
      const title = document.createElement("div");
      title.style.cssText = "font-size: 13px; color: #666; margin-bottom: 8px; text-align: center;";
      title.textContent = "\u9009\u62E9\u8868\u683C\u5927\u5C0F";
      selector.appendChild(title);
      const grid = document.createElement("div");
      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(10, 24px);
        grid-template-rows: repeat(10, 24px);
        gap: 2px;
        background: #f5f5f5;
        padding: 4px;
        border-radius: 4px;
        margin-bottom: 8px;
      `;
      const sizeDisplay = document.createElement("div");
      sizeDisplay.style.cssText = "text-align: center; font-weight: bold; padding: 6px; background: #f0f0f0; border-radius: 4px;";
      sizeDisplay.textContent = "0 \xD7 0";
      const cells = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement("div");
          cell.style.cssText = `
            background: white;
            border: 1px solid #e0e0e0;
            cursor: pointer;
            transition: all 0.1s;
          `;
          cell.dataset.row = String(row + 1);
          cell.dataset.col = String(col + 1);
          cell.addEventListener("mouseenter", () => {
            const r = Number.parseInt(cell.dataset.row);
            const c = Number.parseInt(cell.dataset.col);
            cells.forEach((cellEl, idx) => {
              const cellRow = Math.floor(idx / 10) + 1;
              const cellCol = idx % 10 + 1;
              if (cellRow <= r && cellCol <= c) {
                cellEl.style.background = "#2196F3";
                cellEl.style.borderColor = "#1976D2";
              } else {
                cellEl.style.background = "white";
                cellEl.style.borderColor = "#e0e0e0";
              }
            });
            sizeDisplay.textContent = `${r} \xD7 ${c}`;
          });
          cell.addEventListener("click", () => {
            const rows = Number.parseInt(cell.dataset.row);
            const cols = Number.parseInt(cell.dataset.col);
            console.log(`[MediaCommands] Creating ${rows}\xD7${cols} table`);
            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.width = "100%";
            table.style.margin = "10px 0";
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
              const th = document.createElement("th");
              th.style.border = "1px solid #ddd";
              th.style.padding = "8px";
              th.style.backgroundColor = "#f5f5f5";
              th.textContent = `\u5217 ${j + 1}`;
              th.contentEditable = "true";
              headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
            const tbody = document.createElement("tbody");
            for (let i = 0; i < rows; i++) {
              const tr = document.createElement("tr");
              for (let j = 0; j < cols; j++) {
                const td = document.createElement("td");
                td.style.border = "1px solid #ddd";
                td.style.padding = "8px";
                td.innerHTML = "&nbsp;";
                td.contentEditable = "true";
                tr.appendChild(td);
              }
              tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            editorContent.focus();
            if (savedRange) {
              selection.removeAllRanges();
              selection.addRange(savedRange);
              try {
                savedRange.deleteContents();
                savedRange.insertNode(table);
              } catch (error) {
                editorContent.appendChild(table);
              }
            } else {
              editorContent.appendChild(table);
            }
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            table.parentNode?.insertBefore(p, table.nextSibling);
            editorContent.dispatchEvent(new Event("input", {
              bubbles: true
            }));
            selector.remove();
          });
          cells.push(cell);
          grid.appendChild(cell);
        }
      }
      grid.addEventListener("mouseleave", () => {
        cells.forEach((cell) => {
          cell.style.background = "white";
          cell.style.borderColor = "#e0e0e0";
        });
        sizeDisplay.textContent = "0 \xD7 0";
      });
      selector.appendChild(grid);
      selector.appendChild(sizeDisplay);
      document.body.appendChild(selector);
      const rect = tableButton.getBoundingClientRect();
      let left = rect.left;
      let top = rect.bottom + 5;
      if (left + 268 > window.innerWidth)
        left = window.innerWidth - 268 - 10;
      if (top + 320 > window.innerHeight)
        top = rect.top - 320 - 5;
      selector.style.left = `${left}px`;
      selector.style.top = `${top}px`;
      setTimeout(() => {
        const closeHandler = (e) => {
          if (!selector.contains(e.target) && e.target !== tableButton) {
            selector.remove();
            document.removeEventListener("click", closeHandler);
          }
        };
        document.addEventListener("click", closeHandler);
      }, 0);
      console.log("\u2705 [MediaCommands] Grid selector displayed");
      return true;
    });
    editor.commands.register("insertCodeBlock", () => {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = "// Enter your code here";
      pre.appendChild(code);
      pre.style.background = "#f4f4f4";
      pre.style.padding = "10px";
      pre.style.borderRadius = "4px";
      editor.insertHTML(pre.outerHTML);
      return true;
    });
    editor.commands.register("insertEmoji", () => {
      const emojis = ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}"];
      const emoji = prompt(`Select emoji (1-16):
${emojis.map((e, i) => `${i + 1}: ${e}`).join(" ")}`);
      if (emoji) {
        const index = Number.parseInt(emoji) - 1;
        if (index >= 0 && index < emojis.length)
          editor.insertHTML(emojis[index]);
      }
      return true;
    });
    console.log("[MediaCommandsPlugin] All media commands registered");
  }
};

exports.default = MediaCommandsPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=media-commands.cjs.map
