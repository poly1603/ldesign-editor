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

function findText(editorElement, searchText, options = {}) {
  if (!searchText)
    return 0;
  clearHighlights(editorElement);
  editorElement.textContent || "";
  let pattern;
  try {
    if (options.fuzzySearch) {
      const fuzzyPattern = searchText.split("").map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*?");
      pattern = new RegExp(fuzzyPattern, options.caseSensitive ? "g" : "gi");
    } else if (options.useRegex) {
      pattern = new RegExp(searchText, options.caseSensitive ? "g" : "gi");
    } else {
      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordBoundary = options.wholeWord ? "\\b" : "";
      pattern = new RegExp(`${wordBoundary}${escapedText}${wordBoundary}`, options.caseSensitive ? "g" : "gi");
    }
  } catch (e) {
    console.error("Invalid regex pattern:", e);
    return 0;
  }
  let count = 0;
  const walker = document.createTreeWalker(editorElement, NodeFilter.SHOW_TEXT, null);
  const nodesToProcess = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent || "";
    const matches = [];
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      matches.push([...match]);
      if (!pattern.global)
        break;
    }
    if (matches.length > 0) {
      nodesToProcess.push({
        node,
        matches
      });
      count += matches.length;
    }
  }
  nodesToProcess.forEach(({
    node,
    matches
  }) => {
    highlightMatches(node, matches);
  });
  const firstHighlight = editorElement.querySelector(".editor-highlight");
  if (firstHighlight) {
    firstHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    firstHighlight.classList.add("editor-highlight-active");
  }
  return count;
}
function highlightMatches(node, matches, pattern) {
  const parent = node.parentNode;
  if (!parent)
    return;
  const text = node.textContent || "";
  const fragments = [];
  let lastIndex = 0;
  matches.sort((a, b) => (a.index || 0) - (b.index || 0));
  matches.forEach((match) => {
    const matchIndex = match.index || 0;
    const matchText = match[0];
    if (matchIndex > lastIndex)
      fragments.push(document.createTextNode(text.slice(lastIndex, matchIndex)));
    const span = document.createElement("span");
    span.className = "editor-highlight";
    span.textContent = matchText;
    fragments.push(span);
    lastIndex = matchIndex + matchText.length;
  });
  if (lastIndex < text.length)
    fragments.push(document.createTextNode(text.slice(lastIndex)));
  fragments.forEach((fragment) => {
    parent.insertBefore(fragment, node);
  });
  parent.removeChild(node);
}
function replaceText(editorElement, searchText, replaceText2, options = {}) {
  if (!searchText)
    return 0;
  let count = 0;
  const selection = window.getSelection();
  const savedSelection = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  const walker = document.createTreeWalker(editorElement, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent || "";
    if (options.useRegex) {
      const pattern = new RegExp(searchText, options.caseSensitive ? "g" : "gi");
      const newText = text.replace(pattern, replaceText2);
      if (newText !== text) {
        node.textContent = newText;
        count++;
      }
    } else {
      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordBoundary = options.wholeWord ? "\\b" : "";
      const pattern = new RegExp(`${wordBoundary}${escapedText}${wordBoundary}`, options.caseSensitive ? "g" : "gi");
      const newText = text.replace(pattern, replaceText2);
      if (newText !== text) {
        node.textContent = newText;
        count++;
      }
    }
  }
  if (savedSelection && selection) {
    selection.removeAllRanges();
    selection.addRange(savedSelection);
  }
  clearHighlights(editorElement);
  return count;
}
function replaceAll(editorElement, searchText, replaceText2, options = {}) {
  return replaceText2(editorElement, searchText, replaceText2, {
    ...options,
    useRegex: options.useRegex
  });
}
function clearHighlights(editorElement) {
  const highlights = editorElement.querySelectorAll(".editor-highlight");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (!parent)
      return;
    const text = highlight.textContent || "";
    const textNode = document.createTextNode(text);
    parent.insertBefore(textNode, highlight);
    parent.removeChild(highlight);
  });
}
function showFindReplaceDialog(editor) {
  const existingDialog = document.querySelector(".find-replace-dialog");
  if (existingDialog)
    document.body.removeChild(existingDialog);
  const editorElement = editor.contentElement || editor.getElement();
  clearHighlights(editorElement);
  const dialog = document.createElement("div");
  dialog.className = "find-replace-dialog";
  dialog.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
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
  const cleanup = () => {
    document.body.removeChild(dialog);
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    clearHighlights(editorElement);
  };
  const titleBar = document.createElement("div");
  titleBar.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; cursor: move; user-select: none;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">\u{1F50D} \u67E5\u627E\u548C\u66FF\u6362</h3>
      <button class="close-btn" style="border: none; background: none; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; color: #666;">&times;</button>
    </div>
  `;
  dialog.appendChild(titleBar);
  const title = titleBar.querySelector("h3");
  title.addEventListener("mousedown", startDrag);
  titleBar.addEventListener("mousedown", (e) => {
    if (e.target === titleBar || e.target === title)
      startDrag(e);
  });
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  titleBar.querySelector(".close-btn").addEventListener("click", cleanup);
  const findInput = document.createElement("input");
  findInput.type = "text";
  findInput.placeholder = "\u67E5\u627E...";
  findInput.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;
  findInput.addEventListener("input", () => {
    if (findInput.value) {
      findText(editorElement, findInput.value, {
        caseSensitive: caseSensitive.checkbox.checked,
        wholeWord: wholeWord.checkbox.checked,
        useRegex: useRegex.checkbox.checked
      });
    } else {
      clearHighlights(editorElement);
    }
  });
  const replaceInput = document.createElement("input");
  replaceInput.type = "text";
  replaceInput.placeholder = "\u66FF\u6362\u4E3A...";
  replaceInput.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;
  const options = document.createElement("div");
  options.style.marginBottom = "10px";
  const caseSensitive = createCheckbox("\u533A\u5206\u5927\u5C0F\u5199");
  const wholeWord = createCheckbox("\u5168\u8BCD\u5339\u914D");
  const useRegex = createCheckbox("\u4F7F\u7528\u6B63\u5219\u8868\u8FBE\u5F0F");
  options.appendChild(caseSensitive.container);
  options.appendChild(wholeWord.container);
  options.appendChild(useRegex.container);
  const buttons = document.createElement("div");
  buttons.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  `;
  const findButton = createButton("\u67E5\u627E", () => {
    const count = findText(editor.getElement(), findInput.value, {
      caseSensitive: caseSensitive.checkbox.checked,
      wholeWord: wholeWord.checkbox.checked,
      useRegex: useRegex.checkbox.checked
    });
    alert(`\u627E\u5230 ${count} \u4E2A\u5339\u914D\u9879`);
  });
  const replaceButton = createButton("\u66FF\u6362", () => {
    const count = replaceText(editor.getElement(), findInput.value, replaceInput.value, {
      caseSensitive: caseSensitive.checkbox.checked,
      wholeWord: wholeWord.checkbox.checked,
      useRegex: useRegex.checkbox.checked
    });
    alert(`\u66FF\u6362\u4E86 ${count} \u5904`);
  });
  const replaceAllButton = createButton("\u5168\u90E8\u66FF\u6362", () => {
    const count = replaceAll(editor.getElement(), findInput.value, replaceInput.value, {
      caseSensitive: caseSensitive.checkbox.checked,
      wholeWord: wholeWord.checkbox.checked,
      useRegex: useRegex.checkbox.checked
    });
    alert(`\u66FF\u6362\u4E86 ${count} \u5904`);
  });
  const closeButton = createButton("\u5173\u95ED", cleanup);
  buttons.appendChild(findButton);
  buttons.appendChild(replaceButton);
  buttons.appendChild(replaceAllButton);
  buttons.appendChild(closeButton);
  dialog.appendChild(findInput);
  dialog.appendChild(replaceInput);
  dialog.appendChild(options);
  dialog.appendChild(buttons);
  document.body.appendChild(dialog);
  findInput.focus();
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      cleanup();
  });
}
function createCheckbox(label) {
  const container = document.createElement("label");
  container.style.cssText = `
    display: inline-block;
    margin-right: 15px;
    cursor: pointer;
  `;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.marginRight = "5px";
  const text = document.createElement("span");
  text.textContent = label;
  container.appendChild(checkbox);
  container.appendChild(text);
  return {
    container,
    checkbox
  };
}
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.cssText = `
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  `;
  button.addEventListener("click", onClick);
  return button;
}
const findCommand = {
  id: "find",
  name: "\u67E5\u627E",
  execute: (editor) => {
    showFindReplaceDialog(editor);
  }
};
const replaceCommand = {
  id: "replace",
  name: "\u66FF\u6362",
  execute: (editor) => {
    showFindReplaceDialog(editor);
  }
};
const FindReplacePlugin = createPlugin({
  name: "find-replace",
  version: "1.0.0",
  description: "\u67E5\u627E\u548C\u66FF\u6362\u6587\u672C",
  author: "LDesign Team",
  install(editor) {
    editor.commands.register(findCommand);
    editor.commands.register(replaceCommand);
    const style = document.createElement("style");
    style.textContent = `
      .editor-highlight {
        background-color: #ffeb3b;
        color: inherit;
      }
      .editor-highlight-active {
        background-color: #ff9800;
        color: white;
      }
    `;
    document.head.appendChild(style);
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        showFindReplaceDialog(editor);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        showFindReplaceDialog(editor);
      }
    });
  },
  destroy() {
  }
});

export { FindReplacePlugin, FindReplacePlugin as default, showFindReplaceDialog };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=find-replace.js.map
