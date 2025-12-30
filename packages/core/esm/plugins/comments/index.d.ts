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
import type { EditorInstance } from '../../types';
/**
 * 评论状态
 */
export type CommentStatus = 'active' | 'resolved' | 'deleted';
/**
 * 评论对象
 */
export interface Comment {
    /** 评论ID */
    id: string;
    /** 父评论ID（用于线程） */
    parentId?: string;
    /** 评论内容 */
    content: string;
    /** 作者ID */
    authorId: string;
    /** 作者名称 */
    authorName: string;
    /** 创建时间 */
    createdAt: number;
    /** 更新时间 */
    updatedAt: number;
    /** 关联的文本范围 */
    range: {
        from: number;
        to: number;
    };
    /** 状态 */
    status: CommentStatus;
    /** 提及的用户ID列表 */
    mentions?: string[];
    /** 标签 */
    tags?: string[];
}
/**
 * 评论线程
 */
export interface CommentThread {
    /** 线程ID */
    id: string;
    /** 主评论 */
    mainComment: Comment;
    /** 回复列表 */
    replies: Comment[];
    /** 总回复数 */
    replyCount: number;
    /** 未解决的回复数 */
    unresolvedCount: number;
}
/**
 * 评论管理器
 */
export declare class CommentsManager {
    private editor;
    private comments;
    private threads;
    constructor(editor: EditorInstance);
    /**
     * 添加评论
     * @param content - 评论内容
     * @param authorId - 作者ID
     * @param authorName - 作者名称
     * @param range - 文本范围
     * @param parentId - 父评论ID（回复时）
     * @returns 创建的评论
     */
    addComment(content: string, authorId: string, authorName: string, range: {
        from: number;
        to: number;
    }, parentId?: string): Comment;
    /**
     * 创建评论线程
     */
    private createThread;
    /**
     * 添加到线程
     */
    private addToThread;
    /**
     * 提取@提及
     */
    private extractMentions;
    /**
     * 高亮评论范围
     */
    private highlightCommentRange;
    /**
     * 更新评论
     * @param id - 评论ID
     * @param updates - 更新内容
     * @returns 是否成功
     */
    updateComment(id: string, updates: Partial<Pick<Comment, 'content' | 'tags'>>): boolean;
    /**
     * 解决评论
     * @param id - 评论ID
     * @returns 是否成功
     */
    resolveComment(id: string): boolean;
    /**
     * 删除评论
     * @param id - 评论ID
     * @returns 是否成功
     */
    deleteComment(id: string): boolean;
    /**
     * 获取评论
     * @param id - 评论ID
     * @returns 评论对象
     */
    getComment(id: string): Comment | null;
    /**
     * 获取所有评论
     * @param status - 可选的状态过滤
     * @returns 评论列表
     */
    getComments(status?: CommentStatus): Comment[];
    /**
     * 获取线程
     * @param id - 线程ID
     * @returns 线程对象
     */
    getThread(id: string): CommentThread | null;
    /**
     * 获取所有线程
     * @returns 线程列表
     */
    getThreads(): CommentThread[];
    /**
     * 获取未解决的评论数
     * @returns 数量
     */
    getUnresolvedCount(): number;
    /**
     * 导出评论
     * @returns JSON字符串
     */
    exportComments(): string;
    /**
     * 导入评论
     * @param json - JSON字符串
     */
    importComments(json: string): void;
    /**
     * 清理资源
     */
    destroy(): void;
}
/**
 * 评论插件配置
 */
export interface CommentsPluginConfig {
    /** 是否允许@提及 */
    enableMentions?: boolean;
    /** 是否允许标签 */
    enableTags?: boolean;
}
/**
 * 创建评论插件
 */
export declare function createCommentsPlugin(config?: CommentsPluginConfig): import("../../types").Plugin;
/**
 * 默认导出
 */
export declare const CommentsPlugin: import("../../types").Plugin;
/**
 * 获取评论管理器
 * @param editor - 编辑器实例
 * @returns 评论管理器
 */
export declare function getCommentsManager(editor: EditorInstance): CommentsManager | null;
//# sourceMappingURL=index.d.ts.map