/**
 * CRDT (Conflict-free Replicated Data Type) 核心实现
 * 基于Logoot算法的无冲突复制数据类型
 */
import type { CRDTOperation, CRDTState } from './types';
export declare class CRDT {
    /** 站点ID（唯一标识此客户端） */
    private siteId;
    /** 逻辑时钟 */
    private clock;
    /** 文档状态（位置 -> 字符） */
    private state;
    /** 操作历史 */
    private history;
    /** 版本向量（站点ID -> 时钟值） */
    private versionVector;
    constructor(siteId?: string);
    /**
     * 生成站点ID
     */
    private generateSiteId;
    /**
     * 插入字符
     */
    insert(index: number, char: string): CRDTOperation;
    /**
     * 删除字符
     */
    delete(index: number): CRDTOperation | null;
    /**
     * 应用操作
     */
    applyOperation(operation: CRDTOperation): void;
    /**
     * 生成位置标识符
     */
    private generatePosition;
    /**
     * 在两个位置之间生成新位置
     */
    private generatePositionBetween;
    /**
     * 将标识符转换为键
     */
    private identifierToKey;
    /**
     * 获取可见项
     */
    private getVisibleItems;
    /**
     * 比较位置
     */
    private comparePositions;
    /**
     * 获取文本内容
     */
    getText(): string;
    /**
     * 设置文本内容
     */
    setText(text: string): CRDTOperation[];
    /**
     * 获取状态
     */
    getState(): CRDTState;
    /**
     * 合并远程状态
     */
    merge(remoteState: CRDTState): CRDTOperation[];
    /**
     * 获取增量操作（自指定版本向量以来的操作）
     */
    getDelta(remoteVersionVector: Record<string, number>): CRDTOperation[];
    /**
     * 清空所有数据
     */
    clear(): void;
    /**
     * 获取站点ID
     */
    getSiteId(): string;
    /**
     * 获取时钟值
     */
    getClock(): number;
}
//# sourceMappingURL=CRDT.d.ts.map