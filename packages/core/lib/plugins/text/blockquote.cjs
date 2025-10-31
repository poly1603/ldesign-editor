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

var Plugin = require('../../core/Plugin.cjs');

/**
 * 引用块插�?
 */
/**
 * 切换引用�?
 */
const toggleBlockquote = (state, dispatch) => {
    if (!dispatch)
        return true;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return false;
    // 检查当前是否在引用块中
    let node = selection.anchorNode;
    while (node && node !== document.body) {
        if (node.nodeName === 'BLOCKQUOTE') {
            break;
        }
        node = node.parentNode;
    }
    return true;
};
/**
 * 检查是否在引用块中
 */
function isBlockquoteActive() {
    return () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return false;
        let node = selection.anchorNode;
        while (node && node !== document.body) {
            if (node.nodeName === 'BLOCKQUOTE')
                return true;
            node = node.parentNode;
        }
        return false;
    };
}
/**
 * 引用块插�?
 */
const BlockquotePlugin = Plugin.createPlugin({
    name: 'blockquote',
    commands: {
        toggleBlockquote,
    },
    keys: {
        'Mod-Shift-B': toggleBlockquote,
    },
    toolbar: [{
            name: 'blockquote',
            title: '引用',
            icon: 'quote',
            command: toggleBlockquote,
            active: isBlockquoteActive(),
        }],
});

exports.BlockquotePlugin = BlockquotePlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=blockquote.cjs.map
