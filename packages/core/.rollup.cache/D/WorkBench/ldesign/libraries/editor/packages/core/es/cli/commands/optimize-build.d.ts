/**
 * 构建优化命令
 * 针对不同目标平台优化编辑器构建
 */
interface OptimizeOptions {
    target?: 'web' | 'mobile' | 'desktop';
    mode?: 'size' | 'speed' | 'balanced';
    analyze?: boolean;
    modern?: boolean;
    polyfills?: boolean;
    treeShake?: boolean;
}
export declare function optimizeBuild(options: OptimizeOptions): Promise<void>;
export {};
