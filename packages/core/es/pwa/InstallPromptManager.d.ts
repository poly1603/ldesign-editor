/**
 * 安装提示管理器
 */
import type { PWAConfig } from './types';
import { EventEmitter } from '../core/EventEmitter';
declare global {
    interface Window {
        deferredPrompt?: any;
    }
}
export declare class InstallPromptManager extends EventEmitter {
    private config;
    private deferredPrompt?;
    private installed;
    constructor(config: PWAConfig);
    /**
     * 初始化
     */
    initialize(): Promise<void>;
    /**
     * 检查安装状态
     */
    private checkInstallStatus;
    /**
     * 显示安装提示
     */
    show(): Promise<boolean>;
    /**
     * 是否可以显示提示
     */
    canShowPrompt(): boolean;
    /**
     * 是否已安装
     */
    isInstalled(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
}
