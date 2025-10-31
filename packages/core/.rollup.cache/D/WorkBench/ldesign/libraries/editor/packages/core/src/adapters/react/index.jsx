/**
 * React 适配器
 */
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Editor } from '../../core/Editor';
import { Toolbar } from '../../ui/Toolbar';
/**
 * React 富文本编辑器组件
 */
export const RichEditor = forwardRef((props, ref) => {
    const { value = '', onChange, onUpdate, onFocus, onBlur, plugins = [], editable = true, autofocus = false, placeholder = '请输入内容...', showToolbar = true, className = '', style, } = props;
    const containerRef = useRef(null);
    const toolbarContainerRef = useRef(null);
    const editorRef = useRef();
    const toolbarRef = useRef();
    // 初始化编辑器
    useEffect(() => {
        if (!containerRef.current)
            return;
        const options = {
            element: containerRef.current,
            content: value,
            plugins,
            editable,
            autofocus,
            placeholder,
            onChange,
            onUpdate,
            onFocus,
            onBlur,
        };
        editorRef.current = new Editor(options);
        // 创建工具栏
        if (showToolbar && toolbarContainerRef.current && editorRef.current) {
            toolbarRef.current = new Toolbar(editorRef.current, {
                container: toolbarContainerRef.current,
            });
        }
        // 清理
        return () => {
            toolbarRef.current?.destroy();
            editorRef.current?.destroy();
        };
    }, []);
    // 监听内容变化
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getHTML())
            editorRef.current.setHTML(value || '');
    }, [value]);
    // 监听可编辑状态
    useEffect(() => {
        editorRef.current?.setEditable(editable);
    }, [editable]);
    // 暴露方法
    useImperativeHandle(ref, () => ({
        getEditor: () => editorRef.current || null,
        focus: () => editorRef.current?.focus(),
        blur: () => editorRef.current?.blur(),
        clear: () => editorRef.current?.clear(),
        getHTML: () => editorRef.current?.getHTML() || '',
        setHTML: (html) => editorRef.current?.setHTML(html),
        getJSON: () => editorRef.current?.getJSON(),
        setJSON: (json) => editorRef.current?.setJSON(json),
    }));
    return (<div className={`ldesign-editor-wrapper ${className}`} style={style}>
      {showToolbar && <div ref={toolbarContainerRef}/>}
      <div ref={containerRef}/>
    </div>);
});
RichEditor.displayName = 'RichEditor';
/**
 * React Hook
 */
export function useEditor(options = {}) {
    const editorRef = useRef();
    const [content, setContent] = React.useState(options.content || '');
    const init = (element) => {
        editorRef.current = new Editor({
            ...options,
            element,
            onChange: (html) => {
                setContent(html);
                options.onChange?.(html);
            },
        });
    };
    const destroy = () => {
        editorRef.current?.destroy();
    };
    useEffect(() => {
        return () => {
            destroy();
        };
    }, []);
    return {
        editor: editorRef.current,
        content,
        init,
        destroy,
        focus: () => editorRef.current?.focus(),
        blur: () => editorRef.current?.blur(),
        clear: () => editorRef.current?.clear(),
        getHTML: () => editorRef.current?.getHTML(),
        setHTML: (html) => editorRef.current?.setHTML(html),
        getJSON: () => editorRef.current?.getJSON(),
        setJSON: (json) => editorRef.current?.setJSON(json),
    };
}
// 导出
export default RichEditor;
//# sourceMappingURL=index.jsx.map