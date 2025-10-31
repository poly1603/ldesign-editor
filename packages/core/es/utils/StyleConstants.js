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
 * 统一的样式常量管理
 * 避免重复的样式字符串定义
 */
// 颜色主题
const Colors = {
    border: '#d9d9d9'};
// 通用样式类
const CommonStyles = {
    // 文本域样式
    textarea: `
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid ${Colors.border};
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  `};

export { Colors, CommonStyles };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=StyleConstants.js.map
