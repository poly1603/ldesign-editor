/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 格式化命令插件
 * 注册所有格式化相关的命令
 */
const FormattingCommandsPlugin = {
    name: 'FormattingCommands',
    install(editor) {
        // 对齐命令
        editor.commands.register('alignLeft', () => {
            document.execCommand('justifyLeft');
            return true;
        });
        editor.commands.register('alignCenter', () => {
            document.execCommand('justifyCenter');
            return true;
        });
        editor.commands.register('alignRight', () => {
            document.execCommand('justifyRight');
            return true;
        });
        editor.commands.register('alignJustify', () => {
            document.execCommand('justifyFull');
            return true;
        });
        // 字体大小命令 - 接受参数
        editor.commands.register('setFontSize', (state, dispatch, size) => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const span = document.createElement('span');
                span.style.fontSize = size;
                const range = selection.getRangeAt(0);
                try {
                    range.surroundContents(span);
                }
                catch (e) {
                    span.innerHTML = selection.toString();
                    range.deleteContents();
                    range.insertNode(span);
                }
            }
            return true;
        });
        // 字体命令
        editor.commands.register('setFontFamily', (state, dispatch, fontFamily) => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const span = document.createElement('span');
                span.style.fontFamily = fontFamily;
                const range = selection.getRangeAt(0);
                try {
                    range.surroundContents(span);
                }
                catch (e) {
                    span.innerHTML = selection.toString();
                    range.deleteContents();
                    range.insertNode(span);
                }
            }
            return true;
        });
        // 文字颜色命令
        editor.commands.register('setTextColor', (state, dispatch, color) => {
            document.execCommand('foreColor', false, color);
            return true;
        });
        // 背景颜色命令
        editor.commands.register('setBackgroundColor', (state, dispatch, color) => {
            document.execCommand('hiliteColor', false, color);
            return true;
        });
        // 行高命令
        editor.commands.register('setLineHeight', (state, dispatch, lineHeight) => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const div = document.createElement('div');
                div.style.lineHeight = lineHeight;
                const range = selection.getRangeAt(0);
                try {
                    range.surroundContents(div);
                }
                catch (e) {
                    div.innerHTML = selection.toString();
                    range.deleteContents();
                    range.insertNode(div);
                }
            }
            return true;
        });
        // 替换选中文本命令
        editor.commands.register('replaceSelection', (state, dispatch, options) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0)
                return false;
            const range = selection.getRangeAt(0);
            if (!editor.contentElement?.contains(range.commonAncestorContainer))
                return false;
            // 删除选中内容
            range.deleteContents();
            // 插入新文本
            const textNode = document.createTextNode(options.text);
            range.insertNode(textNode);
            // 将光标移到插入文本之后
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
            // 触发内容更新
            editor.handleInput?.();
            return true;
        });
        // 插入文本命令
        editor.commands.register('insertText', (state, dispatch, options) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                // 如果没有选区，在编辑器末尾插入
                if (editor.contentElement) {
                    editor.contentElement.focus();
                    const range = document.createRange();
                    range.selectNodeContents(editor.contentElement);
                    range.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
                else {
                    return false;
                }
            }
            const range = selection.getRangeAt(0);
            if (!editor.contentElement?.contains(range.commonAncestorContainer))
                return false;
            // 插入文本
            const textNode = document.createTextNode(options.text);
            range.insertNode(textNode);
            // 将光标移到插入文本之后
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
            // 触发内容更新
            editor.handleInput?.();
            return true;
        });
        console.log('[FormattingCommandsPlugin] All formatting commands registered');
    },
};

exports.default = FormattingCommandsPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=formatting-commands.cjs.map
