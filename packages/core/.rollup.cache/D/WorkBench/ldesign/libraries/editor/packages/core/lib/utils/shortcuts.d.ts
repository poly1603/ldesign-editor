/**
 * 便捷快捷函数集合
 * 提供更多语法糖和实用工具
 */
import type { Editor } from '../core/Editor';
/**
 * 快速配置
 */
export declare const quick: {
    /**
     * 切换到深色模式
     */
    darkMode(): void;
    /**
     * 切换到浅色模式
     */
    lightMode(): void;
    /**
     * 切换主题
     */
    toggleTheme(): void;
    /**
     * 中文模式
     */
    chinese(): Promise<void>;
    /**
     * 英文模式
     */
    english(): Promise<void>;
    /**
     * 日文模式
     */
    japanese(): Promise<void>;
    /**
     * 启用AI
     */
    enableAI(apiKey?: string): void;
    /**
     * 禁用AI
     */
    disableAI(): void;
    /**
     * 全屏模式
     */
    fullscreen(editor: Editor): void;
    /**
     * 导出Markdown
     */
    exportMarkdown(editor: Editor): string;
    /**
     * 保存到本地
     */
    save(key?: string, content?: string): void;
    /**
     * 从本地加载
     */
    load(key?: string): string | null;
    /**
     * 清空编辑器
     */
    clear(editor: Editor): void;
};
/**
 * 编辑器快捷操作
 */
export declare function editor(instance: Editor): {
    /**
     * 获取纯文本
     */
    getText(): string;
    /**
     * 获取HTML
     */
    getHTML(): string;
    /**
     * 设置内容
     */
    setContent(html: string): void;
    /**
     * 追加内容
     */
    append(html: string): void;
    /**
     * 插入内容
     */
    insert(html: string): void;
    /**
     * 字数统计
     */
    wordCount(): number;
    /**
     * 字符统计
     */
    charCount(): number;
    /**
     * 是否为空
     */
    isEmpty(): boolean;
    /**
     * 聚焦编辑器
     */
    focus(): void;
    /**
     * 失焦
     */
    blur(): void;
    /**
     * 滚动到顶部
     */
    scrollTop(): void;
    /**
     * 滚动到底部
     */
    scrollBottom(): void;
};
/**
 * 批量操作
 */
export declare const batch: {
    /**
     * 启用博客功能
     */
    enableBlogFeatures(): void;
    /**
     * 启用所有格式化
     */
    enableAllFormatting(): void;
    /**
     * 启用所有媒体
     */
    enableAllMedia(): void;
    /**
     * 禁用所有AI
     */
    disableAllAI(): void;
    /**
     * 禁用所有高级功能
     */
    disableAdvanced(): void;
};
/**
 * 调试工具
 */
export declare const debug: {
    /**
     * 显示所有配置
     */
    showConfig(): void;
    /**
     * 显示功能状态
     */
    showFeatures(): void;
    /**
     * 显示性能
     */
    showPerformance(): void;
    /**
     * 显示加载统计
     */
    showLoadStats(): void;
    /**
     * 全部信息
     */
    showAll(): void;
};
/**
 * 性能优化快捷方式
 */
export declare const optimize: {
    /**
     * 启用性能模式
     */
    performanceMode(): void;
    /**
     * 清理缓存
     */
    clearCache(): void;
    /**
     * 减少内存
     */
    reduceMemory(): void;
    /**
     * 启用所有优化
     */
    enableAll(): void;
};
