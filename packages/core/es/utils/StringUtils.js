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
 * 字符串工具函数
 * 统一管理字符串处理相关功能
 */
/**
 * HTML转义
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export { escapeHTML };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=StringUtils.js.map
