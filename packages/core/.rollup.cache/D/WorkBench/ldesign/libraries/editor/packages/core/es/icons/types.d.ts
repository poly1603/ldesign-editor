/**
 * 图标系统类型定义
 */
/**
 * 图标集类型
 */
export type IconSetType = 'lucide' | 'feather' | 'material' | 'custom';
/**
 * 图标样式
 */
export interface IconStyle {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    fill?: string;
    className?: string;
}
/**
 * 图标定义
 */
export interface IconDefinition {
    name: string;
    svg: string;
    viewBox?: string;
    category?: IconCategory;
    tags?: string[];
    aliases?: string[];
}
/**
 * 图标分类
 */
export declare enum IconCategory {
    EDITOR = "editor",
    FORMAT = "format",
    ACTION = "action",
    FILE = "file",
    NAVIGATION = "navigation",
    MEDIA = "media",
    ARROW = "arrow",
    SHAPE = "shape",
    DEVICE = "device",
    SOCIAL = "social",
    OTHER = "other"
}
/**
 * 图标集
 */
export interface IconSet {
    name: IconSetType;
    displayName: string;
    version?: string;
    author?: string;
    license?: string;
    icons: Map<string, IconDefinition>;
    getIcon: (name: string) => IconDefinition | null;
    getAllIcons: () => IconDefinition[];
    getIconsByCategory: (category: IconCategory) => IconDefinition[];
    searchIcons: (query: string) => IconDefinition[];
}
/**
 * 图标渲染选项
 */
export interface IconRenderOptions extends IconStyle {
    title?: string;
    ariaLabel?: string;
    inline?: boolean;
    spinning?: boolean;
}
/**
 * 图标管理器配置
 */
export interface IconManagerConfig {
    defaultSet?: IconSetType;
    defaultStyle?: IconStyle;
    customSets?: Map<string, IconSet>;
    fallbackIcon?: string;
    enableCache?: boolean;
}
/**
 * 图标管理器接口
 */
export interface IIconManager {
    getIcon: (name: string, set?: IconSetType) => IconDefinition | null;
    renderIcon: (name: string, options?: IconRenderOptions) => string;
    createIconElement: (name: string, options?: IconRenderOptions) => HTMLElement;
    setDefaultIconSet: (set: IconSetType) => void;
    getCurrentIconSet: () => IconSetType;
    registerIcon: (name: string, svg: string, set?: IconSetType) => void;
    registerIconSet: (set: IconSet) => void;
    getAvailableIconSets: () => IconSetType[];
    searchIcons: (query: string, set?: IconSetType) => IconDefinition[];
    getIconsByCategory: (category: IconCategory, set?: IconSetType) => IconDefinition[];
    replaceAllIcons: (set: IconSetType) => void;
}
/**
 * 编辑器常用图标映射
 * 定义编辑器功能与图标名称的映射关系
 */
export interface EditorIconMap {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    code: string;
    subscript: string;
    superscript: string;
    clearFormat: string;
    heading: string;
    heading1: string;
    heading2: string;
    heading3: string;
    paragraph: string;
    blockquote: string;
    bulletList: string;
    orderedList: string;
    taskList: string;
    indent: string;
    outdent: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    alignJustify: string;
    link: string;
    unlink: string;
    image: string;
    video: string;
    table: string;
    horizontalRule: string;
    emoji: string;
    template: string;
    undo: string;
    redo: string;
    copy: string;
    cut: string;
    paste: string;
    delete: string;
    selectAll: string;
    search: string;
    replace: string;
    fullscreen: string;
    exitFullscreen: string;
    preview: string;
    sourceCode: string;
    save: string;
    open: string;
    export: string;
    import: string;
    print: string;
    settings: string;
    help: string;
    info: string;
    more: string;
    ai: string;
    aiSuggest: string;
    aiTranslate: string;
    aiImprove: string;
    textColor: string;
    backgroundColor: string;
    colorPicker: string;
    insertRowAbove: string;
    insertRowBelow: string;
    insertColumnLeft: string;
    insertColumnRight: string;
    deleteRow: string;
    deleteColumn: string;
    deleteTable: string;
    mergeCells: string;
    splitCell: string;
    arrowUp: string;
    arrowDown: string;
    arrowLeft: string;
    arrowRight: string;
    chevronUp: string;
    chevronDown: string;
    chevronLeft: string;
    chevronRight: string;
    close: string;
    check: string;
    plus: string;
    minus: string;
    refresh: string;
    download: string;
    upload: string;
    share: string;
    lock: string;
    unlock: string;
    user: string;
    calendar: string;
    clock: string;
    folder: string;
    file: string;
    tag: string;
    bookmark: string;
    star: string;
    heart: string;
    comment: string;
    bell: string;
    warning: string;
    error: string;
    success: string;
}
/**
 * 图标加载器
 */
export interface IconLoader {
    load: () => Promise<Map<string, IconDefinition>>;
    loadFromUrl?: (url: string) => Promise<Map<string, IconDefinition>>;
    loadFromString?: (data: string) => Map<string, IconDefinition>;
}
