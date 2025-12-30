/**
 * 标题下拉菜单组件
 * 显示当前标题级别并提供切换功能
 */
import type { Editor } from '../core/Editor';
export interface HeadingDropdownOptions {
    editor: Editor;
    container?: HTMLElement;
}
export declare class HeadingDropdown {
    private editor;
    private container;
    private button;
    private dropdown;
    private currentLevelSpan;
    private isOpen;
    constructor(options: HeadingDropdownOptions);
    /**
     * 创建主按钮
     */
    private createButton;
    /**
     * 创建下拉菜单
     */
    private createDropdown;
    /**
     * 设置事件监听器
     */
    private setupEventListeners;
    /**
     * 更新当前级别显示
     */
    private updateCurrentLevel;
    /**
     * 切换下拉菜单
     */
    private toggleDropdown;
    /**
     * 打开下拉菜单
     */
    private openDropdown;
    /**
     * 关闭下拉菜单
     */
    private closeDropdown;
    /**
     * 设置标题级别
     */
    private setHeading;
    /**
     * 渲染组件
     */
    render(): HTMLElement;
    /**
     * 销毁组件
     */
    destroy(): void;
}
export default HeadingDropdown;
//# sourceMappingURL=HeadingDropdown.d.ts.map