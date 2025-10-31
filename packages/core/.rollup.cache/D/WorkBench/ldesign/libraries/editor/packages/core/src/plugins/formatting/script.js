/**
 * 上标和下标插件
 */
import { createPlugin } from '../../core/Plugin';
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
export const SuperscriptPlugin = createPlugin({
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
export const SubscriptPlugin = createPlugin({
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
//# sourceMappingURL=script.js.map