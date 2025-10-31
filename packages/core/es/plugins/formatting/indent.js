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
 * 缩进插件
 * 提供增加缩进和减少缩进功能
 */
/**
 * 增加缩进
 */
const indent = (state, dispatch) => {
    if (!dispatch)
        return true;
    document.execCommand('indent', false);
    return true;
};
/**
 * 减少缩进
 */
const outdent = (state, dispatch) => {
    if (!dispatch)
        return true;
    document.execCommand('outdent', false);
    return true;
};
/**
 * 缩进插件
 */
const IndentPlugin = createPlugin({
    name: 'indent',
    commands: {
        indent,
        outdent,
    },
    keys: {
        'Tab': indent,
        'Shift-Tab': outdent,
    },
    toolbar: [
        {
            name: 'indent',
            title: '增加缩进',
            icon: 'indent',
            command: indent,
        },
        {
            name: 'outdent',
            title: '减少缩进',
            icon: 'outdent',
            command: outdent,
        },
    ],
});

export { IndentPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=indent.js.map
