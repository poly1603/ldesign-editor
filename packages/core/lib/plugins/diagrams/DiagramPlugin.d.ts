/**
 * 图表插件
 * 提供思维导图、流程图、UML图等图表编辑支持
 */
import type { Plugin, PluginContext } from '../../core/Plugin';
import type { DiagramData, DiagramType } from './types';
export declare class DiagramPlugin implements Plugin {
    name: string;
    version: string;
    description: string;
    private context?;
    private renderer?;
    private toolbar?;
    private editors;
    private currentEditor?;
    private currentType?;
    private container?;
    /**
     * 初始化插件
     */
    init(context: PluginContext): Promise<void>;
    /**
     * 注册编辑器
     */
    private registerEditors;
    /**
     * 注册命令
     */
    private registerCommands;
    /**
     * 注册节点视图
     */
    private registerNodeViews;
    /**
     * 设置事件监听
     */
    private setupEventListeners;
    /**
     * 插入图表
     */
    insertDiagram(type: DiagramType, data?: DiagramData): Promise<void>;
    /**
     * 编辑图表
     */
    editDiagram(node: HTMLElement): Promise<void>;
    /**
     * 显示编辑器
     */
    private showEditor;
    /**
     * 创建模态框
     */
    private createModal;
    /**
     * 关闭模态框
     */
    private closeModal;
    /**
     * 获取编辑器标题
     */
    private getEditorTitle;
    /**
     * 获取默认数据
     */
    private getDefaultData;
    /**
     * 导出图表
     */
    exportDiagram(): Promise<void>;
    /**
     * 获取选中的图表节点
     */
    private getSelectedDiagramNode;
    /**
     * 销毁插件
     */
    destroy(): void;
}
