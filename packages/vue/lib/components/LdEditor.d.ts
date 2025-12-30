/**
 * LdEditor - Vue 3 编辑器组件
 */
import { type PropType } from 'vue';
import type { EditorOptions } from '@ldesign/editor-core';
import { Editor } from '@ldesign/editor-core';
export interface EditorProps extends Omit<EditorOptions, 'onChange' | 'onUpdate'> {
    /** v-model绑定的内容 */
    modelValue?: string;
}
export interface EditorEmits {
    /** 内容更新事件 */
    'update:modelValue': [value: string];
    /** 变化事件 */
    'change': [content: string];
    /** 聚焦事件 */
    'focus': [];
    /** 失焦事件 */
    'blur': [];
}
export interface EditorInstance {
    /** 编辑器实例 */
    editor: Editor | null;
    /** 获取HTML内容 */
    getHTML: () => string;
    /** 设置HTML内容 */
    setHTML: (content: string) => void;
    /** 聚焦 */
    focus: () => void;
}
/**
 * LDesign 编辑器 Vue 组件
 *
 * @example
 * ```vue
 * <template>
 *   <LdEditor v-model="content" placeholder="开始输入..." />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { LdEditor } from '@ldesign/editor-vue'
 *
 * const content = ref('<p>Hello World</p>')
 * </script>
 * ```
 */
export declare const LdEditor: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    /**
     * 编辑器内容（v-model）
     */
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 占位符文本
     */
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 是否只读
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否自动聚焦
     */
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 虚拟滚动配置
     */
    virtualScroll: {
        type: PropType<EditorOptions["virtualScroll"]>;
        default: any;
    };
    /**
     * WASM加速配置
     */
    wasm: {
        type: PropType<EditorOptions["wasm"]>;
        default: any;
    };
    /**
     * PWA配置
     */
    pwa: {
        type: PropType<EditorOptions["pwa"]>;
        default: any;
    };
    /**
     * 调试面板配置
     */
    debugPanel: {
        type: PropType<EditorOptions["debugPanel"]>;
        default: any;
    };
    /**
     * 插件列表
     * @default standardPlugins
     */
    plugins: {
        type: PropType<EditorOptions["plugins"]>;
        default: () => import("@ldesign/editor-core/types").Plugin[];
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    /**
     * v-model更新事件
     */
    'update:modelValue': (value: string) => true;
    /**
     * 内容变化事件
     */
    change: (content: string) => true;
    /**
     * 聚焦事件
     */
    focus: () => true;
    /**
     * 失焦事件
     */
    blur: () => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * 编辑器内容（v-model）
     */
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 占位符文本
     */
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    /**
     * 是否只读
     */
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 是否自动聚焦
     */
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * 虚拟滚动配置
     */
    virtualScroll: {
        type: PropType<EditorOptions["virtualScroll"]>;
        default: any;
    };
    /**
     * WASM加速配置
     */
    wasm: {
        type: PropType<EditorOptions["wasm"]>;
        default: any;
    };
    /**
     * PWA配置
     */
    pwa: {
        type: PropType<EditorOptions["pwa"]>;
        default: any;
    };
    /**
     * 调试面板配置
     */
    debugPanel: {
        type: PropType<EditorOptions["debugPanel"]>;
        default: any;
    };
    /**
     * 插件列表
     * @default standardPlugins
     */
    plugins: {
        type: PropType<EditorOptions["plugins"]>;
        default: () => import("@ldesign/editor-core/types").Plugin[];
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: (value: string) => any;
    onChange?: (content: string) => any;
    onFocus?: () => any;
    onBlur?: () => any;
}>, {
    plugins: (string | import("@ldesign/editor-core/types").Plugin)[];
    autofocus: boolean;
    placeholder: string;
    virtualScroll: {
        enabled: boolean;
        lineHeight?: number;
        maxLines?: number;
        enableSyntaxHighlight?: boolean;
        enableLineNumbers?: boolean;
        enableWordWrap?: boolean;
    };
    wasm: {
        enabled?: boolean;
        enableDiff?: boolean;
        enableParser?: boolean;
        useWorker?: boolean;
        warmupStrategy?: "eager" | "lazy" | "none";
    };
    debugPanel: {
        enabled?: boolean;
        expanded?: boolean;
        initialTab?: "performance" | "memory" | "network" | "plugins" | "console" | "dom" | "history" | "config";
        theme?: "light" | "dark" | "auto";
        position?: "bottom" | "right" | "floating";
        size?: string;
        resizable?: boolean;
        showInProduction?: boolean;
    };
    pwa: {
        enabled?: boolean;
        scope?: string;
        updateInterval?: number;
        cacheStrategy?: "cache-first" | "network-first" | "cache-only" | "network-only" | "stale-while-revalidate";
        offlineSupport?: boolean;
        backgroundSync?: boolean;
        installPrompt?: boolean;
        updateOnReload?: boolean;
    };
    modelValue: string;
    readonly: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default LdEditor;
//# sourceMappingURL=LdEditor.d.ts.map