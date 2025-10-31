/**
 * Vue 3 适配器
 */
import type { EditorOptions, Plugin } from '../../types';
import { Editor } from '../../core/Editor';
export interface RichEditorProps {
    modelValue?: string;
    plugins?: (Plugin | string)[];
    editable?: boolean;
    autofocus?: boolean;
    placeholder?: string;
    showToolbar?: boolean;
}
/**
 * Vue 富文本编辑器组件
 */
export declare const RichEditor: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    plugins: {
        type: () => (Plugin | string)[];
        default: () => never[];
    };
    editable: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    showToolbar: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "update" | "focus" | "blur")[], "update:modelValue" | "update" | "focus" | "blur", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    plugins: {
        type: () => (Plugin | string)[];
        default: () => never[];
    };
    editable: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    showToolbar: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onUpdate?: ((...args: any[]) => any) | undefined;
    onFocus?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
}>, {
    plugins: (string | Plugin)[];
    modelValue: string;
    editable: boolean;
    autofocus: boolean;
    placeholder: string;
    showToolbar: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
/**
 * Vue Composition API Hook
 */
export declare function useEditor(options?: EditorOptions): {
    editor: import("vue").Ref<Editor | undefined, Editor | undefined>;
    content: import("vue").Ref<string, string>;
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
