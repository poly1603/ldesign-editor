/**
 * useEditor composable
 * 在 Vue 组件中使用编辑器的组合式函数
 */
import { type Ref } from 'vue';
import { Editor, type EditorOptions } from '@ldesign/editor-core';
export interface UseEditorOptions extends EditorOptions {
    /** 容器元素或选择器 */
    container?: HTMLElement | string;
    /** 是否自动挂载 */
    autoMount?: boolean;
}
export interface UseEditorReturn {
    /** 编辑器实例 */
    editor: Ref<Editor | null>;
    /** 编辑器内容 */
    content: Ref<string>;
    /** 是否准备就绪 */
    ready: Ref<boolean>;
    /** 获取HTML内容 */
    getHTML: () => string;
    /** 设置HTML内容 */
    setHTML: (content: string) => void;
    /** 插入HTML */
    insertHTML: (html: string) => void;
    /** 聚焦编辑器 */
    focus: () => void;
    /** 销毁编辑器 */
    destroy: () => void;
}
/**
 * 使用编辑器
 *
 * @param options - 编辑器配置选项
 * @returns 编辑器实例和辅助方法
 *
 * @example
 * ```typescript
 * import { useEditor } from '@ldesign/editor-vue'
 *
 * const { editor, content, ready, setContent } = useEditor({
 *   content: '<p>Hello</p>',
 *   placeholder: '开始输入...',
 *   onChange: (html) => {
 *     console.log('内容变化:', html)
 *   }
 * })
 *
 * // 在 onMounted 中挂载
 * onMounted(() => {
 *   editor.value?.mount('#editor')
 * })
 * ```
 */
export declare function useEditor(options?: UseEditorOptions): UseEditorReturn;
//# sourceMappingURL=useEditor.d.ts.map