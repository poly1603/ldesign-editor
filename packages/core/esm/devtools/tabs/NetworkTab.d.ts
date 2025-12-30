/**
 * 网络监控标签页
 * 追踪和分析网络请求
 */
import type { Editor } from '../../core/Editor';
export interface NetworkRequest {
    id: string;
    url: string;
    method: string;
    status?: number;
    statusText?: string;
    headers?: Headers | Record<string, string>;
    requestHeaders?: Headers | Record<string, string>;
    requestBody?: any;
    responseBody?: any;
    startTime: number;
    endTime?: number;
    duration?: number;
    size?: number;
    type?: string;
    error?: string;
}
export declare class NetworkTab {
    private editor;
    private container?;
    private requests;
    private selectedRequest?;
    private filter;
    private typeFilter;
    private isRecording;
    private maxRequests;
    private requestsContainer?;
    private detailsContainer?;
    constructor(options: {
        editor: Editor;
    });
    /**
     * 渲染标签页
     */
    render(): HTMLElement;
    /**
     * 创建工具栏
     */
    private createToolbar;
    /**
     * 创建类型过滤器
     */
    private createTypeFilter;
    /**
     * 创建搜索框
     */
    private createSearchBox;
    /**
     * 创建主内容区
     */
    private createContent;
    /**
     * 开始记录请求
     */
    startRequest(requestInfo: {
        url: string;
        method: string;
        headers?: Headers | Record<string, string>;
        body?: any;
    }): string;
    /**
     * 完成请求
     */
    completeRequest(id: string, response: {
        status: number;
        statusText: string;
        headers?: Headers | Record<string, string>;
        body?: any;
        duration?: number;
    }): void;
    /**
     * 失败请求
     */
    failRequest(id: string, error: {
        error: string;
        duration?: number;
    }): void;
    /**
     * 检测请求类型
     */
    private detectRequestType;
    /**
     * 添加请求行
     */
    private addRequestRow;
    /**
     * 更新请求行
     */
    private updateRequestRow;
    /**
     * 渲染所有请求
     */
    private renderRequests;
    /**
     * 选择请求显示详情
     */
    private selectRequest;
    /**
     * 获取请求名称
     */
    private getRequestName;
    /**
     * 格式化大小
     */
    private formatSize;
    /**
     * 更新统计
     */
    private updateStats;
    /**
     * 清空请求
     */
    clear(): void;
    /**
     * 激活标签页
     */
    activate(): void;
    /**
     * 停用标签页
     */
    deactivate(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
//# sourceMappingURL=NetworkTab.d.ts.map