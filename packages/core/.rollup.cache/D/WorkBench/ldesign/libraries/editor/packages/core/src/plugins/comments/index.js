/**
 * 评论系统插件
 * 支持行内评论和讨论
 *
 * 功能:
 * - 行内评论
 * - 评论线程
 * - @提及用户
 * - 评论解决/删除
 * - 评论导出
 *
 * @packageDocumentation
 */
import { createPlugin } from '../../core/Plugin';
import { generateId } from '../../utils/helpers';
import { createLogger } from '../../utils/logger';
const logger = createLogger('Comments');
/**
 * 评论管理器
 */
export class CommentsManager {
    constructor(editor) {
        this.comments = new Map();
        this.threads = new Map();
        this.editor = editor;
    }
    /**
     * 添加评论
     * @param content - 评论内容
     * @param authorId - 作者ID
     * @param authorName - 作者名称
     * @param range - 文本范围
     * @param parentId - 父评论ID（回复时）
     * @returns 创建的评论
     */
    addComment(content, authorId, authorName, range, parentId) {
        const comment = {
            id: generateId(),
            content,
            authorId,
            authorName,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            range,
            status: 'active',
            parentId,
        };
        // 提取@提及
        const mentions = this.extractMentions(content);
        if (mentions.length > 0)
            comment.mentions = mentions;
        this.comments.set(comment.id, comment);
        // 更新线程
        if (parentId)
            this.addToThread(parentId, comment);
        else
            this.createThread(comment);
        // 高亮评论范围
        this.highlightCommentRange(comment);
        logger.info(`Comment added: ${comment.id}`);
        return comment;
    }
    /**
     * 创建评论线程
     */
    createThread(comment) {
        const thread = {
            id: comment.id,
            mainComment: comment,
            replies: [],
            replyCount: 0,
            unresolvedCount: 1,
        };
        this.threads.set(thread.id, thread);
    }
    /**
     * 添加到线程
     */
    addToThread(threadId, comment) {
        const thread = this.threads.get(threadId);
        if (thread) {
            thread.replies.push(comment);
            thread.replyCount++;
            if (comment.status === 'active') {
                thread.unresolvedCount++;
            }
        }
    }
    /**
     * 提取@提及
     */
    extractMentions(content) {
        const mentions = [];
        const regex = /@(\w+)/g;
        let match;
        while ((match = regex.exec(content)) !== null)
            mentions.push(match[1]);
        return mentions;
    }
    /**
     * 高亮评论范围
     */
    highlightCommentRange(comment) {
        if (!this.editor.contentElement)
            return;
        // TODO: 实现文本范围高亮
        // 需要根据range.from和range.to在DOM中找到对应位置并添加标记
    }
    /**
     * 更新评论
     * @param id - 评论ID
     * @param updates - 更新内容
     * @returns 是否成功
     */
    updateComment(id, updates) {
        const comment = this.comments.get(id);
        if (!comment) {
            logger.error(`Comment not found: ${id}`);
            return false;
        }
        Object.assign(comment, updates, { updatedAt: Date.now() });
        // 重新提取提及
        if (updates.content)
            comment.mentions = this.extractMentions(updates.content);
        logger.info(`Comment updated: ${id}`);
        return true;
    }
    /**
     * 解决评论
     * @param id - 评论ID
     * @returns 是否成功
     */
    resolveComment(id) {
        const comment = this.comments.get(id);
        if (!comment)
            return false;
        comment.status = 'resolved';
        comment.updatedAt = Date.now();
        // 更新线程计数
        const threadId = comment.parentId || comment.id;
        const thread = this.threads.get(threadId);
        if (thread && thread.unresolvedCount > 0) {
            thread.unresolvedCount--;
        }
        logger.info(`Comment resolved: ${id}`);
        return true;
    }
    /**
     * 删除评论
     * @param id - 评论ID
     * @returns 是否成功
     */
    deleteComment(id) {
        const comment = this.comments.get(id);
        if (!comment)
            return false;
        comment.status = 'deleted';
        comment.updatedAt = Date.now();
        logger.info(`Comment deleted: ${id}`);
        return true;
    }
    /**
     * 获取评论
     * @param id - 评论ID
     * @returns 评论对象
     */
    getComment(id) {
        return this.comments.get(id) || null;
    }
    /**
     * 获取所有评论
     * @param status - 可选的状态过滤
     * @returns 评论列表
     */
    getComments(status) {
        const comments = Array.from(this.comments.values());
        if (status)
            return comments.filter(c => c.status === status);
        return comments;
    }
    /**
     * 获取线程
     * @param id - 线程ID
     * @returns 线程对象
     */
    getThread(id) {
        return this.threads.get(id) || null;
    }
    /**
     * 获取所有线程
     * @returns 线程列表
     */
    getThreads() {
        return Array.from(this.threads.values());
    }
    /**
     * 获取未解决的评论数
     * @returns 数量
     */
    getUnresolvedCount() {
        return this.getComments('active').length;
    }
    /**
     * 导出评论
     * @returns JSON字符串
     */
    exportComments() {
        const data = {
            comments: Array.from(this.comments.values()),
            threads: Array.from(this.threads.values()),
            exportedAt: Date.now(),
        };
        return JSON.stringify(data, null, 2);
    }
    /**
     * 导入评论
     * @param json - JSON字符串
     */
    importComments(json) {
        try {
            const data = JSON.parse(json);
            if (data.comments && Array.isArray(data.comments)) {
                data.comments.forEach((comment) => {
                    this.comments.set(comment.id, comment);
                });
            }
            if (data.threads && Array.isArray(data.threads)) {
                data.threads.forEach((thread) => {
                    this.threads.set(thread.id, thread);
                });
            }
            logger.info('Comments imported successfully');
        }
        catch (error) {
            logger.error('Failed to import comments:', error);
        }
    }
    /**
     * 清理资源
     */
    destroy() {
        this.comments.clear();
        this.threads.clear();
        // 移除所有评论高亮
        document.querySelectorAll('.comment-highlight').forEach(el => el.remove());
    }
}
/**
 * 创建评论插件
 */
export function createCommentsPlugin(config = {}) {
    let manager = null;
    return createPlugin({
        name: 'comments',
        commands: {
            // 添加评论
            'comment:add': (state, dispatch, editor) => {
                if (manager && editor) {
                    const selectedText = editor.getSelectedText();
                    if (!selectedText) {
                        logger.warn('No text selected for comment');
                        return false;
                    }
                    // TODO: 显示评论输入框
                    return true;
                }
                return false;
            },
            // 解决评论
            'comment:resolve': (state, dispatch, editor) => {
                // 需要传入评论ID
                return false;
            },
        },
        init(editor) {
            manager = new CommentsManager(editor);
            editor.comments = manager;
            logger.info('Comments system initialized');
        },
        destroy() {
            if (manager) {
                manager.destroy();
                manager = null;
            }
        },
    });
}
/**
 * 默认导出
 */
export const CommentsPlugin = createCommentsPlugin();
/**
 * 获取评论管理器
 * @param editor - 编辑器实例
 * @returns 评论管理器
 */
export function getCommentsManager(editor) {
    return editor.comments || null;
}
//# sourceMappingURL=index.js.map