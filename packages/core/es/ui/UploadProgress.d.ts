/**
 * 上传进度组件
 * 显示文件上传进度和状态
 */
export interface UploadProgressOptions {
    fileName?: string;
    fileSize?: number;
    onCancel?: () => void;
}
export declare class UploadProgress {
    private container;
    private progressBar;
    private percentText;
    private statusText;
    private options;
    private cancelled;
    constructor(options?: UploadProgressOptions);
    /**
     * 创建容器
     */
    private createContainer;
    /**
     * 添加动画样式
     */
    private addAnimation;
    /**
     * 更新进度
     */
    updateProgress(percent: number, status?: string): void;
    /**
     * 设置为成功状态
     */
    success(message?: string): void;
    /**
     * 设置为错误状态
     */
    error(message?: string): void;
    /**
     * 取消上传
     */
    cancel(): void;
    /**
     * 检查是否已取消
     */
    isCancelled(): boolean;
    /**
     * 显示
     */
    show(): void;
    /**
     * 隐藏
     */
    hide(): void;
    /**
     * 格式化文件大小
     */
    private formatSize;
}
/**
 * 创建上传进度实例
 */
export declare function createUploadProgress(options?: UploadProgressOptions): UploadProgress;
/**
 * 显示上传进度
 */
export declare function showUploadProgress(options?: UploadProgressOptions): UploadProgress;
