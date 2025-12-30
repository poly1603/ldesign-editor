/**
 * React 适配器
 */
import type { EditorOptions, EditorState, Plugin } from '../../types';
import React from 'react';
import { Editor } from '../../core/Editor';
export interface RichEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    onUpdate?: (state: EditorState) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    plugins?: (Plugin | string)[];
    editable?: boolean;
    autofocus?: boolean;
    placeholder?: string;
    showToolbar?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export interface RichEditorRef {
    getEditor: () => Editor | null;
    focus: () => void;
    blur: () => void;
    clear: () => void;
    getHTML: () => string;
    setHTML: (html: string) => void;
    getJSON: () => any;
    setJSON: (json: any) => void;
}
/**
 * React 富文本编辑器组件
 */
export declare const RichEditor: React.ForwardRefExoticComponent<RichEditorProps & React.RefAttributes<RichEditorRef>>;
/**
 * React Hook
 */
export declare function useEditor(options?: EditorOptions): {
    editor: Editor | undefined;
    content: string;
    init: (element: HTMLElement | string) => void;
    destroy: () => void;
    focus: () => void | undefined;
    blur: () => void | undefined;
    clear: () => void | undefined;
    getHTML: () => string | undefined;
    setHTML: (html: string) => void | undefined;
    getJSON: () => any;
    setJSON: (json: any) => void | undefined;
};
export default RichEditor;
//# sourceMappingURL=index.d.ts.map