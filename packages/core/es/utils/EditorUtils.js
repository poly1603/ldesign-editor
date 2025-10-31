/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
/**
 * 编辑器工具函数集合
 * 统一管理常用的编辑器操作，避免重复代码
 */
/**
 * 执行编辑器命令
 */
function execCommand(command, value) {
    try {
        return document.execCommand(command, false, value);
    }
    catch (e) {
        console.error(`[EditorUtils] execCommand '${command}' failed:`, e);
        return false;
    }
}
/**
 * 获取当前选区
 */
function getSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return null;
    return selection;
}
/**
 * 获取选中的文本
 */
function getSelectedText() {
    const selection = getSelection();
    return selection ? selection.toString() : '';
}
/**
 * 保存当前选区
 */
function saveRange() {
    const selection = getSelection();
    if (selection && selection.rangeCount > 0)
        return selection.getRangeAt(0).cloneRange();
    return null;
}
/**
 * 恢复选区
 */
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
    }
    catch (e) {
        console.error('[EditorUtils] restoreRange failed:', e);
    }
    return false;
}
/**
 * 替换选中的文本
 */
function replaceSelection(text, range) {
    // 如果提供了range，先恢复它
    if (range)
        restoreRange(range);
    // 尝试使用execCommand
    if (execCommand('insertText', text))
        return true;
    // 备用方法：手动替换
    const selection = getSelection();
    if (selection && selection.rangeCount > 0) {
        const currentRange = selection.getRangeAt(0);
        currentRange.deleteContents();
        const textNode = document.createTextNode(text);
        currentRange.insertNode(textNode);
        // 移动光标到插入文本之后
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
