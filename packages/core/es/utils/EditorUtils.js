/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
function execCommand(command, value) {
  try {
    return document.execCommand(command, false, value);
  } catch (e) {
    console.error(`[EditorUtils] execCommand '${command}' failed:`, e);
    return false;
  }
}
function getSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return null;
  return selection;
}
function getSelectedText() {
  const selection = getSelection();
  return selection ? selection.toString() : "";
}
function saveRange() {
  const selection = getSelection();
  if (selection && selection.rangeCount > 0)
    return selection.getRangeAt(0).cloneRange();
  return null;
}
function restoreRange(range) {
  if (!range)
    return false;
  try {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
  } catch (e) {
    console.error("[EditorUtils] restoreRange failed:", e);
  }
  return false;
}
function replaceSelection(text, range) {
  if (range)
    restoreRange(range);
  if (execCommand("insertText", text))
    return true;
  const selection = getSelection();
  if (selection && selection.rangeCount > 0) {
    const currentRange = selection.getRangeAt(0);
    currentRange.deleteContents();
    const textNode = document.createTextNode(text);
    currentRange.insertNode(textNode);
    currentRange.setStartAfter(textNode);
    currentRange.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(currentRange);
    return true;
  }
  return false;
}

export { execCommand, getSelectedText, getSelection, replaceSelection, restoreRange, saveRange };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=EditorUtils.js.map
