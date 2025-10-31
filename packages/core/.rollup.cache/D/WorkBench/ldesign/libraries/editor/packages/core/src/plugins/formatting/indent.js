/**
 * 缩进插件
 * 提供增加缩进和减少缩进功能
 */
import { createPlugin } from '../../core/Plugin';
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
export const IndentPlugin = createPlugin({
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
//# sourceMappingURL=indent.js.map