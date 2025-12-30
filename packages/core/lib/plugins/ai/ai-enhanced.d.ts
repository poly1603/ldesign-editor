/**
 * AI功能增强
 * 新增智能排版、摘要、关键词提取等功能
 *
 * @packageDocumentation
 */
import type { EditorInstance } from '../../types';
/**
 * AI增强功能配置
 */
export interface AIEnhancedConfig {
    /** API密钥 */
    apiKey?: string;
    /** 模型名称 */
    model?: string;
    /** 最大tokens */
    maxTokens?: number;
}
/**
 * 内容摘要
 */
export interface ContentSummary {
    /** 摘要文本 */
    summary: string;
    /** 关键点 */
    keyPoints: string[];
    /** 字数统计 */
    wordCount: number;
}
/**
 * 关键词提取结果
 */
export interface KeywordResult {
    /** 关键词列表 */
    keywords: string[];
    /** 权重（0-1） */
    weights: number[];
}
/**
 * 情感分析结果
 */
export interface SentimentResult {
    /** 情感倾向（positive/negative/neutral） */
    sentiment: 'positive' | 'negative' | 'neutral';
    /** 置信度（0-1） */
    confidence: number;
    /** 情感分数（-1到1） */
    score: number;
}
/**
 * AI增强功能管理器
 */
export declare class AIEnhancedManager {
    private editor;
    private aiService;
    constructor(editor: EditorInstance, config?: AIEnhancedConfig);
    /**
     * AI智能排版
     * 自动优化文档格式和结构
     * @returns 排版后的内容
     */
    smartFormat(): Promise<string>;
    /**
     * 生成内容摘要
     * @param length - 摘要长度（short/medium/long）
     * @returns 摘要对象
     */
    generateSummary(length?: 'short' | 'medium' | 'long'): Promise<ContentSummary>;
    /**
     * 提取关键词
     * @param count - 关键词数量
     * @returns 关键词列表
     */
    extractKeywords(count?: number): Promise<KeywordResult>;
    /**
     * 情感分析
     * @returns 情感分析结果
     */
    analyzeSentiment(): Promise<SentimentResult>;
    /**
     * HTML转纯文本
     */
    private htmlToPlainText;
    /**
     * 批量处理段落
     * @param operation - 操作类型
     * @returns 处理结果
     */
    batchProcess(operation: 'proofread' | 'translate' | 'simplify'): Promise<string>;
}
/**
 * 创建AI增强插件
 */
export declare function createAIEnhancedPlugin(config?: AIEnhancedConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const AIEnhancedPlugin: import("../../types").Plugin;
/**
 * 获取AI增强管理器
 * @param editor - 编辑器实例
 * @returns AI增强管理器
 */
export declare function getAIEnhancedManager(editor: EditorInstance): AIEnhancedManager | null;
//# sourceMappingURL=ai-enhanced.d.ts.map