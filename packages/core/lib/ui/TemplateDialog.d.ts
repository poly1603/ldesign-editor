/**
 * 模板选择器对话框
 */
import type { TemplateManager } from '../template/TemplateManager';
import type { Template } from '../template/types';
export declare class TemplateDialog {
    private container;
    private templateManager;
    private onSelect?;
    private selectedCategory;
    private searchQuery;
    constructor(templateManager: TemplateManager);
    /**
     * 显示对话框
     */
    show(onSelect?: (template: Template) => void): void;
    /**
     * 隐藏对话框
     */
    hide(): void;
    /**
     * 创建对话框结构
     */
    private createDialog;
    /**
     * 绑定事件
     */
    private bindEvents;
    /**
     * 加载模板列表
     */
    private loadTemplates;
    /**
     * 渲染模板卡片
     */
    private renderTemplateCard;
    /**
     * 获取模板图标
     */
    private getTemplateIcon;
    /**
     * 选择模板
     */
    private selectTemplate;
    /**
     * 显示变量填充对话框
     */
    private showVariableDialog;
    /**
     * 渲染变量输入控件
     */
    private renderVariableInput;
    /**
     * 应用模板
     */
    private applyTemplate;
    /**
     * 处理导入
     */
    private handleImport;
    /**
     * 从当前内容创建模板
     */
    private handleCreateFromCurrent;
    /**
     * 显示模板管理对话框
     */
    private showManageDialog;
    /**
     * 显示创建模板对话框
     */
    private showCreateTemplateDialog;
    /**
     * 显示编辑模板对话框
     */
    private showEditTemplateDialog;
    /**
     * 添加样式
     */
    private addStyles;
}
/**
 * 显示模板选择对话框
 */
export declare function showTemplateDialog(templateManager: TemplateManager, onSelect?: (template: Template) => void): TemplateDialog;
//# sourceMappingURL=TemplateDialog.d.ts.map