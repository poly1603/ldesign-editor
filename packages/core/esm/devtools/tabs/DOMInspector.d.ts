/**
 * DOM检查器标签页
 * 检查和分析编辑器DOM结构
 */
import type { Editor } from '../../core/Editor';
export interface DOMNodeInfo {
    tagName: string;
    id?: string;
    classList?: string[];
    attributes?: Record<string, string>;
    children?: DOMNodeInfo[];
    textContent?: string;
    computedStyles?: Record<string, string>;
    rect?: DOMRect;
    depth: number;
}
export declare class DOMInspector {
    private editor;
    private container?;
    private treeContainer?;
    private detailsContainer?;
    private selectedNode?;
    private highlightOverlay?;
    private rootElement?;
    private expandedNodes;
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
     * 创建高亮覆盖层
     */
    private createHighlightOverlay;
    /**
     * 渲染DOM树
     */
    private renderDOMTree;
    /**
     * 构建DOM树数据
     */
    private buildDOMTree;
    /**
     * 创建树元素
     */
    private createTreeElement;
    /**
     * 切换节点展开/折叠
     */
    private toggleNode;
    /**
     * 高亮元素
     */
    private highlightElement;
    /**
     * 取消高亮
     */
    private unhighlightElement;
    /**
     * 根据节点信息查找元素
     */
    private findElementByNode;
    /**
     * 选择节点
     */
    private selectNode;
    /**
     * 显示节点详情
     */
    private showNodeDetails;
    /**
     * 搜索DOM
     */
    private searchDOM;
    /**
     * 展开全部
     */
    private expandAll;
    /**
     * 折叠全部
     */
    private collapseAll;
    /**
     * 刷新
     */
    private refresh;
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
//# sourceMappingURL=DOMInspector.d.ts.map