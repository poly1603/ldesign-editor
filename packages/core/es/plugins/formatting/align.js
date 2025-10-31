/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createPlugin } from '../../core/Plugin.js';

/**
 * 对齐插件
 * 提供左对齐、居中、右对齐和两端对齐
 */
/**
 * 设置对齐方式
 */
function setAlign(align) {
    return (state, dispatch) => {
        if (!dispatch)
            return true;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return false;
        // 查找当前块级元素
        let node = selection.anchorNode;
        let block = null;
        while (node && node !== document.body) {
            if (node instanceof HTMLElement && getComputedStyle(node).display === 'block') {
                block = node;
                break;
            }
            node = node.parentNode;
        }
        if (block) {
            block.style.textAlign = align;
            return true;
        }
        return false;
    };
}
/**
 * 检查对齐方式
 */
function isAlignActive(align) {
    return () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return false;
        let node = selection.anchorNode;
        let block = null;
        while (node && node !== document.body) {
            if (node instanceof HTMLElement && getComputedStyle(node).display === 'block') {
                block = node;
                break;
            }
            node = node.parentNode;
        }
        return block?.style.textAlign === align;
    };
}
/**
 * 对齐插件
 */
const AlignPlugin = createPlugin({
    name: 'align',
    commands: {
        alignLeft: setAlign('left'),
        alignCenter: setAlign('center'),
        alignRight: setAlign('right'),
        alignJustify: setAlign('justify'),
    },
    keys: {
        'Mod-Shift-L': setAlign('left'),
        'Mod-Shift-E': setAlign('center'),
        'Mod-Shift-R': setAlign('right'),
        'Mod-Shift-J': setAlign('justify'),
    },
    toolbar: [
        {
            name: 'alignLeft',
            title: '左对齐',
            icon: 'align-left',
            command: setAlign('left'),
            active: isAlignActive('left'),
        },
        {
            name: 'alignCenter',
            title: '居中',
            icon: 'align-center',
            command: setAlign('center'),
            active: isAlignActive('center'),
        },
        {
            name: 'alignRight',
            title: '右对齐',
            icon: 'align-right',
            command: setAlign('right'),
            active: isAlignActive('right'),
        },
        {
            name: 'alignJustify',
            title: '两端对齐',
            icon: 'align-justify',
            command: setAlign('justify'),
            active: isAlignActive('justify'),
        },
    ],
});

export { AlignPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=align.js.map
