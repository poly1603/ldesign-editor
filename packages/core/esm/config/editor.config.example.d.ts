/**
 * 编辑器配置示例
 * 展示如何配置插件、工具栏和性能选项
 */
import type { PluginConfig } from '../core/PluginRegistry';
import type { ToolbarManagerConfig } from '../ui/ToolbarManager';
/**
 * 插件配置示例
 */
export declare const pluginConfigExample: Record<string, PluginConfig>;
/**
 * 工具栏配置示例
 */
export declare const toolbarConfigExample: ToolbarManagerConfig;
/**
 * 性能优化配置示例
 */
export declare const performanceConfigExample: {
    lazyLoad: {
        enabled: boolean;
        threshold: number;
        rootMargin: string;
    };
    virtualScroll: {
        enabled: boolean;
        itemHeight: number;
        bufferSize: number;
    };
    debounce: {
        input: number;
        resize: number;
        scroll: number;
    };
    throttle: {
        render: number;
        update: number;
    };
    cache: {
        enabled: boolean;
        maxSize: number;
        ttl: number;
    };
    events: {
        maxListeners: number;
        enablePriority: boolean;
        asyncEmit: boolean;
    };
    monitoring: {
        enabled: boolean;
        reportInterval: number;
        metrics: string[];
    };
};
/**
 * 完整编辑器配置示例
 */
export declare const editorConfigExample: {
    element: string;
    content: string;
    editable: boolean;
    plugins: Record<string, PluginConfig>;
    toolbar: ToolbarManagerConfig;
    performance: {
        lazyLoad: {
            enabled: boolean;
            threshold: number;
            rootMargin: string;
        };
        virtualScroll: {
            enabled: boolean;
            itemHeight: number;
            bufferSize: number;
        };
        debounce: {
            input: number;
            resize: number;
            scroll: number;
        };
        throttle: {
            render: number;
            update: number;
        };
        cache: {
            enabled: boolean;
            maxSize: number;
            ttl: number;
        };
        events: {
            maxListeners: number;
            enablePriority: boolean;
            asyncEmit: boolean;
        };
        monitoring: {
            enabled: boolean;
            reportInterval: number;
            metrics: string[];
        };
    };
    icons: {
        defaultSet: string;
        enableCache: boolean;
    };
    theme: {
        defaultTheme: string;
        followSystem: boolean;
    };
    i18n: {
        defaultLocale: string;
        fallbackLocale: string;
    };
    autoSave: {
        enabled: boolean;
        interval: number;
        storage: string;
    };
    collaboration: {
        enabled: boolean;
        serverUrl: string;
        roomId: string;
    };
};
/**
 * 轻量级配置（性能优先）
 */
export declare const lightweightConfig: {
    plugins: {
        bold: {
            enabled: boolean;
            lazy: boolean;
        };
        italic: {
            enabled: boolean;
            lazy: boolean;
        };
        underline: {
            enabled: boolean;
            lazy: boolean;
        };
        heading: {
            enabled: boolean;
            lazy: boolean;
        };
        bulletList: {
            enabled: boolean;
            lazy: boolean;
        };
        orderedList: {
            enabled: boolean;
            lazy: boolean;
        };
        image: {
            enabled: boolean;
            lazy: boolean;
        };
        link: {
            enabled: boolean;
            lazy: boolean;
        };
        table: {
            enabled: boolean;
            lazy: boolean;
        };
    };
    toolbar: {
        compact: boolean;
        showLabels: boolean;
        lazyLoad: boolean;
        groups?: import("..").ToolbarGroupConfig[];
        position?: "top" | "bottom" | "float";
        sticky?: boolean;
    };
    performance: {
        virtualScroll: {
            enabled: boolean;
        };
        lazyLoad: {
            enabled: boolean;
            threshold: number;
            rootMargin: string;
        };
        debounce: {
            input: number;
            resize: number;
            scroll: number;
        };
        throttle: {
            render: number;
            update: number;
        };
        cache: {
            enabled: boolean;
            maxSize: number;
            ttl: number;
        };
        events: {
            maxListeners: number;
            enablePriority: boolean;
            asyncEmit: boolean;
        };
        monitoring: {
            enabled: boolean;
            reportInterval: number;
            metrics: string[];
        };
    };
    element: string;
    content: string;
    editable: boolean;
    icons: {
        defaultSet: string;
        enableCache: boolean;
    };
    theme: {
        defaultTheme: string;
        followSystem: boolean;
    };
    i18n: {
        defaultLocale: string;
        fallbackLocale: string;
    };
    autoSave: {
        enabled: boolean;
        interval: number;
        storage: string;
    };
    collaboration: {
        enabled: boolean;
        serverUrl: string;
        roomId: string;
    };
};
/**
 * 功能完整配置（功能优先）
 */
export declare const fullFeaturedConfig: {
    plugins: {
        ai: {
            enabled: boolean;
            lazy: boolean;
        };
        collaboration: {
            enabled: boolean;
            lazy: boolean;
        };
    };
    toolbar: {
        compact: boolean;
        showLabels: boolean;
        groups: import("..").ToolbarGroupConfig[];
        position?: "top" | "bottom" | "float";
        sticky?: boolean;
        lazyLoad?: boolean;
    };
    element: string;
    content: string;
    editable: boolean;
    performance: {
        lazyLoad: {
            enabled: boolean;
            threshold: number;
            rootMargin: string;
        };
        virtualScroll: {
            enabled: boolean;
            itemHeight: number;
            bufferSize: number;
        };
        debounce: {
            input: number;
            resize: number;
            scroll: number;
        };
        throttle: {
            render: number;
            update: number;
        };
        cache: {
            enabled: boolean;
            maxSize: number;
            ttl: number;
        };
        events: {
            maxListeners: number;
            enablePriority: boolean;
            asyncEmit: boolean;
        };
        monitoring: {
            enabled: boolean;
            reportInterval: number;
            metrics: string[];
        };
    };
    icons: {
        defaultSet: string;
        enableCache: boolean;
    };
    theme: {
        defaultTheme: string;
        followSystem: boolean;
    };
    i18n: {
        defaultLocale: string;
        fallbackLocale: string;
    };
    autoSave: {
        enabled: boolean;
        interval: number;
        storage: string;
    };
    collaboration: {
        enabled: boolean;
        serverUrl: string;
        roomId: string;
    };
};
//# sourceMappingURL=editor.config.example.d.ts.map