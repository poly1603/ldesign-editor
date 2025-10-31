/**
 * AI功能增强
 * 新增智能排版、摘要、关键词提取等功能
 *
 * @packageDocumentation
 */
import { getAIService } from '../../ai/AIService';
import { createPlugin } from '../../core/Plugin';
import { createLogger } from '../../utils/logger';
const logger = createLogger('AIEnhanced');
/**
 * AI增强功能管理器
 */
export class AIEnhancedManager {
    constructor(editor, config = {}) {
        this.aiService = getAIService();
        this.editor = editor;
        if (config.apiKey)
            this.aiService.setConfig({ apiKey: config.apiKey });
    }
    /**
     * AI智能排版
     * 自动优化文档格式和结构
     * @returns 排版后的内容
     */
    async smartFormat() {
        const content = this.editor.getHTML();
        logger.info('Starting smart format...');
        try {
            const prompt = `请优化以下文档的排版和结构，使其更加清晰易读：

${content}

要求：
1. 优化段落结构
2. 添加适当的标题层级
3. 改善列表格式
4. 统一标点符号
5. 保持原有内容不变

请直接返回优化后的HTML内容。`;
            const response = await this.aiService.request({
                type: 'custom',
                content: prompt,
            });
            if (response.content) {
                this.editor.setHTML(response.content);
                logger.info('Smart format completed');
                return response.content;
            }
            return content;
        }
        catch (error) {
            logger.error('Smart format failed:', error);
            throw error;
        }
    }
    /**
     * 生成内容摘要
     * @param length - 摘要长度（short/medium/long）
     * @returns 摘要对象
     */
    async generateSummary(length = 'medium') {
        const content = this.editor.getHTML();
        const plainText = this.htmlToPlainText(content);
        logger.info('Generating summary...');
        const lengthMap = {
            short: '100字以内',
            medium: '200-300字',
            long: '400-500字',
        };
        try {
            const prompt = `请为以下内容生成${lengthMap[length]}的摘要，并列出3-5个关键点：

${plainText}

请以JSON格式返回：
{
  "summary": "摘要文本",
  "keyPoints": ["要点1", "要点2", ...]
}`;
            const response = await this.aiService.request({
                type: 'custom',
                content: prompt,
            });
            if (response.content) {
                const result = JSON.parse(response.content);
                return {
                    summary: result.summary,
                    keyPoints: result.keyPoints || [],
                    wordCount: result.summary.length,
                };
            }
            throw new Error('Empty response');
        }
        catch (error) {
            logger.error('Summary generation failed:', error);
            throw error;
        }
    }
    /**
     * 提取关键词
     * @param count - 关键词数量
     * @returns 关键词列表
     */
    async extractKeywords(count = 10) {
        const content = this.editor.getHTML();
        const plainText = this.htmlToPlainText(content);
        logger.info('Extracting keywords...');
        try {
            const prompt = `请从以下内容中提取${count}个最重要的关键词，并给出权重（0-1）：

${plainText}

请以JSON格式返回：
{
  "keywords": ["关键词1", "关键词2", ...],
  "weights": [0.9, 0.85, ...]
}`;
            const response = await this.aiService.request({
                type: 'custom',
                content: prompt,
            });
            if (response.content) {
                const result = JSON.parse(response.content);
                return {
                    keywords: result.keywords || [],
                    weights: result.weights || [],
                };
            }
            throw new Error('Empty response');
        }
        catch (error) {
            logger.error('Keyword extraction failed:', error);
            throw error;
        }
    }
    /**
     * 情感分析
     * @returns 情感分析结果
     */
    async analyzeSentiment() {
        const content = this.editor.getHTML();
        const plainText = this.htmlToPlainText(content);
        logger.info('Analyzing sentiment...');
        try {
            const prompt = `请分析以下内容的情感倾向：

${plainText}

请以JSON格式返回：
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "score": 0.6
}

其中score范围为-1（极负面）到1（极正面）。`;
            const response = await this.aiService.request({
                type: 'custom',
                content: prompt,
            });
            if (response.content) {
                const result = JSON.parse(response.content);
                return {
                    sentiment: result.sentiment || 'neutral',
                    confidence: result.confidence || 0,
                    score: result.score || 0,
                };
            }
            throw new Error('Empty response');
        }
        catch (error) {
            logger.error('Sentiment analysis failed:', error);
            throw error;
        }
    }
    /**
     * HTML转纯文本
     */
    htmlToPlainText(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
    /**
     * 批量处理段落
     * @param operation - 操作类型
     * @returns 处理结果
     */
    async batchProcess(operation) {
        const content = this.editor.getHTML();
        logger.info(`Batch processing: ${operation}`);
        const operationMap = {
            proofread: '纠正语法和拼写错误',
            translate: '翻译为英文',
            simplify: '简化表达，使其更易理解',
        };
        try {
            const prompt = `请对以下内容进行${operationMap[operation]}：

${content}

请直接返回处理后的HTML内容。`;
            const response = await this.aiService.request({
                type: 'custom',
                content: prompt,
            });
            if (response.content) {
                this.editor.setHTML(response.content);
                return response.content;
            }
            return content;
        }
        catch (error) {
            logger.error('Batch process failed:', error);
            throw error;
        }
    }
}
/**
 * 创建AI增强插件
 */
export function createAIEnhancedPlugin(config = {}) {
    let manager = null;
    return createPlugin({
        name: 'ai-enhanced',
        commands: {
            // 智能排版
            'ai:smartFormat': async (state, dispatch, editor) => {
                if (manager && editor) {
                    await manager.smartFormat();
                    return true;
                }
                return false;
            },
            // 生成摘要
            'ai:generateSummary': async (state, dispatch, editor) => {
                if (manager && editor) {
                    const summary = await manager.generateSummary();
                    logger.info('Summary:', summary);
                    return true;
                }
                return false;
            },
            // 提取关键词
            'ai:extractKeywords': async (state, dispatch, editor) => {
                if (manager && editor) {
                    const keywords = await manager.extractKeywords();
                    logger.info('Keywords:', keywords);
                    return true;
                }
                return false;
            },
            // 情感分析
            'ai:analyzeSentiment': async (state, dispatch, editor) => {
                if (manager && editor) {
                    const sentiment = await manager.analyzeSentiment();
                    logger.info('Sentiment:', sentiment);
                    return true;
                }
                return false;
            },
        },
        init(editor) {
            manager = new AIEnhancedManager(editor, config);
            editor.aiEnhanced = manager;
            logger.info('AI Enhanced initialized');
        },
        destroy() {
            if (manager)
                manager = null;
        },
    });
}
/**
 * 默认导出
 */
export const AIEnhancedPlugin = createAIEnhancedPlugin();
/**
 * 获取AI增强管理器
 * @param editor - 编辑器实例
 * @returns AI增强管理器
 */
export function getAIEnhancedManager(editor) {
    return editor.aiEnhanced || null;
}
//# sourceMappingURL=ai-enhanced.js.map