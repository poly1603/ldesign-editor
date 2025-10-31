/**
 * 全局常量配置
 * 集中管理所有魔法数字和配置项
 */
/**
 * 编辑器核心配置
 */
export declare const EDITOR_CONFIG: {
    /** 历史记录最大数量 */
    readonly MAX_HISTORY_SIZE: 100;
    /** 自动保存延迟（毫秒） */
    readonly AUTO_SAVE_DELAY: 3000;
    /** 防抖延迟（毫秒） */
    readonly DEBOUNCE_DELAY: 300;
    /** 最小编辑器高度 */
    readonly MIN_EDITOR_HEIGHT: 200;
    /** 默认占位符 */
    readonly DEFAULT_PLACEHOLDER: "请输入内容...";
};
/**
 * 文件上传配置
 */
export declare const FILE_CONFIG: {
    /** 最大文件大小（10MB） */
    readonly MAX_FILE_SIZE: number;
    /** 支持的图片类型 */
    readonly SUPPORTED_IMAGE_TYPES: readonly ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
    /** 支持的视频类型 */
    readonly SUPPORTED_VIDEO_TYPES: readonly ["video/mp4", "video/webm", "video/ogg"];
    /** 支持的音频类型 */
    readonly SUPPORTED_AUDIO_TYPES: readonly ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg"];
};
/**
 * UI 层级配置
 */
export declare const UI_CONFIG: {
    /** 右键菜单层级 */
    readonly CONTEXT_MENU_Z_INDEX: 9999;
    /** 对话框层级 */
    readonly DIALOG_Z_INDEX: 10000;
    /** 提示层级 */
    readonly TOOLTIP_Z_INDEX: 10001;
    /** 工具栏高度 */
    readonly TOOLBAR_HEIGHT: 48;
    /** 动画持续时间（毫秒） */
    readonly ANIMATION_DURATION: 200;
    /** 视口边距 */
    readonly VIEWPORT_PADDING: 10;
};
/**
 * 颜色相关配置
 */
export declare const COLOR_CONFIG: {
    /** 最近使用颜色的存储键 */
    readonly RECENT_COLORS_KEY: "ldesign-editor-recent-colors";
    /** 最多保存的最近使用颜色数量 */
    readonly MAX_RECENT_COLORS: 10;
    /** 默认预设颜色 */
    readonly DEFAULT_COLORS: readonly ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF", "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#6600CC", "#CC00CC", "#FF0066"];
};
/**
 * 表格相关配置
 */
export declare const TABLE_CONFIG: {
    /** 最大行数 */
    readonly MAX_ROWS: 20;
    /** 最大列数 */
    readonly MAX_COLS: 10;
    /** 默认行数 */
    readonly DEFAULT_ROWS: 3;
    /** 默认列数 */
    readonly DEFAULT_COLS: 3;
    /** 最小单元格宽度 */
    readonly MIN_CELL_WIDTH: 50;
};
/**
 * 快捷键配置
 */
export declare const KEYBOARD_SHORTCUTS: {
    readonly BOLD: "Mod+B";
    readonly ITALIC: "Mod+I";
    readonly UNDERLINE: "Mod+U";
    readonly STRIKE: "Mod+Shift+X";
    readonly CODE: "Mod+E";
    readonly UNDO: "Mod+Z";
    readonly REDO: "Mod+Shift+Z";
    readonly FIND: "Mod+F";
    readonly SAVE: "Mod+S";
    readonly CLEAR_FORMAT: "Mod+\\";
    readonly LINK: "Mod+K";
    readonly HEADING_1: "Mod+Alt+1";
    readonly HEADING_2: "Mod+Alt+2";
    readonly HEADING_3: "Mod+Alt+3";
    readonly HEADING_4: "Mod+Alt+4";
    readonly HEADING_5: "Mod+Alt+5";
    readonly HEADING_6: "Mod+Alt+6";
    readonly ORDERED_LIST: "Mod+Shift+7";
    readonly BULLET_LIST: "Mod+Shift+8";
    readonly BLOCKQUOTE: "Mod+Shift+9";
};
/**
 * 错误代码
 */
export declare const ERROR_CODES: {
    readonly INVALID_FILE_TYPE: "INVALID_FILE_TYPE";
    readonly FILE_TOO_LARGE: "FILE_TOO_LARGE";
    readonly UPLOAD_FAILED: "UPLOAD_FAILED";
    readonly INVALID_URL: "INVALID_URL";
    readonly COMMAND_NOT_FOUND: "COMMAND_NOT_FOUND";
    readonly COMMAND_EXECUTION_FAILED: "COMMAND_EXECUTION_FAILED";
    readonly PLUGIN_LOAD_FAILED: "PLUGIN_LOAD_FAILED";
    readonly PLUGIN_INIT_FAILED: "PLUGIN_INIT_FAILED";
    readonly INVALID_SELECTION: "INVALID_SELECTION";
    readonly NO_SELECTION: "NO_SELECTION";
    readonly INVALID_CONTENT: "INVALID_CONTENT";
    readonly PARSE_ERROR: "PARSE_ERROR";
    readonly AI_PROVIDER_ERROR: "AI_PROVIDER_ERROR";
    readonly AI_API_ERROR: "AI_API_ERROR";
    readonly AI_CONFIG_ERROR: "AI_CONFIG_ERROR";
};
/**
 * 本地存储键
 */
export declare const STORAGE_KEYS: {
    readonly RECENT_COLORS: "ldesign-editor-recent-colors";
    readonly AI_CONFIG: "ldesign-editor-ai-config";
    readonly EDITOR_SETTINGS: "ldesign-editor-settings";
    readonly TEMPLATES: "ldesign-editor-templates";
};
/**
 * AI 配置
 */
export declare const AI_CONFIG: {
    /** 默认模型 */
    readonly DEFAULT_MODEL: "deepseek-chat";
    /** 默认温度 */
    readonly DEFAULT_TEMPERATURE: 0.7;
    /** 最大 Token 数 */
    readonly MAX_TOKENS: 2000;
    /** 请求超时（毫秒） */
    readonly REQUEST_TIMEOUT: 30000;
};
/**
 * 正则表达式
 */
export declare const REGEX: {
    /** URL 正则 */
    readonly URL: RegExp;
    /** Email 正则 */
    readonly EMAIL: RegExp;
    /** HEX 颜色正则 */
    readonly HEX_COLOR: RegExp;
    /** RGB 颜色正则 */
    readonly RGB_COLOR: RegExp;
};
