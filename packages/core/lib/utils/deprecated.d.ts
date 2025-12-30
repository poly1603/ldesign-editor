/**
 * 废弃的API和过渡导出
 *
 * 为了向后兼容，保留一些旧的导出
 * 这些API应该逐步迁移到新的实现
 */
/**
 * 废弃的DOM工具（从DOMUtils.ts迁移）
 * 建议使用 dom.ts 的 API
 */
export declare function $(selector: string, parent?: Element | Document): Element | null;
export declare function $$(selector: string, parent?: Element | Document): Element[];
//# sourceMappingURL=deprecated.d.ts.map