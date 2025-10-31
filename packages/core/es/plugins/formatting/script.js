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
 * 上标和下标插件
 */
/**
 * 上标
 */
const superscript = (state, dispatch) => {
    if (!dispatch)
        return true;
    document.execCommand('superscript', false);
    return true;
};
/**
 * 下标
 */
const subscript = (state, dispatch) => {
    if (!dispatch)
        return true;
    document.execCommand('subscript', false);
    return true;
};
/**
 * 检查是否为上标
 */
function isSuperscriptActive() {
    return () => {
        return document.queryCommandState('superscript');
    };
}
/**
 * 检查是否为下标
 */
function isSubscriptActive() {
    return () => {
        return document.queryCommandState('subscript');
    };
}
/**
 * 上标插件
 */
const SuperscriptPlugin = createPlugin({
    name: 'superscript',
    commands: {
        toggleSuperscript: superscript,
    },
    keys: {
        'Mod-Shift-.': superscript,
    },
    toolbar: [{
            name: 'superscript',
            title: '上标',
            icon: 'superscript',
            command: superscript,
            active: isSuperscriptActive(),
        }],
});
/**
 * 下标插件
 */
const SubscriptPlugin = createPlugin({
    name: 'subscript',
    commands: {
        toggleSubscript: subscript,
    },
    keys: {
        'Mod-Shift-,': subscript,
    },
    toolbar: [{
            name: 'subscript',
            title: '下标',
            icon: 'subscript',
            command: subscript,
            active: isSubscriptActive(),
        }],
});

export { SubscriptPlugin, SuperscriptPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=script.js.map
