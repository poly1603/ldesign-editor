/**
 * 统一的样式常量管理
 * 避免重复的样式字符串定义
 */
export declare const Colors: {
    readonly primary: "#1890ff";
    readonly primaryHover: "#40a9ff";
    readonly primaryActive: "#096dd9";
    readonly success: "#52c41a";
    readonly warning: "#faad14";
    readonly error: "#f5222d";
    readonly info: "#1890ff";
    readonly text: "#333";
    readonly textSecondary: "#666";
    readonly textDisabled: "#999";
    readonly border: "#d9d9d9";
    readonly borderLight: "#e0e0e0";
    readonly borderHover: "#40a9ff";
    readonly background: "#fff";
    readonly backgroundGray: "#f5f5f5";
    readonly backgroundHover: "#f0f0f0";
    readonly shadowLight: "0 2px 8px rgba(0,0,0,0.1)";
    readonly shadowMedium: "0 4px 12px rgba(0,0,0,0.15)";
    readonly shadowLarge: "0 8px 24px rgba(0,0,0,0.2)";
};
export declare const CommonStyles: {
    readonly button: "\n    padding: 8px 16px;\n    border: 1px solid #d9d9d9;\n    border-radius: 4px;\n    background: #fff;\n    color: #333;\n    font-size: 14px;\n    cursor: pointer;\n    transition: all 0.3s;\n  ";
    readonly buttonPrimary: "\n    padding: 8px 16px;\n    border: none;\n    border-radius: 4px;\n    background: #1890ff;\n    color: white;\n    font-size: 14px;\n    cursor: pointer;\n    transition: all 0.3s;\n  ";
    readonly input: "\n    width: 100%;\n    padding: 8px 12px;\n    border: 1px solid #d9d9d9;\n    border-radius: 4px;\n    font-size: 14px;\n    transition: border-color 0.3s;\n  ";
    readonly textarea: "\n    width: 100%;\n    min-height: 100px;\n    padding: 10px;\n    border: 1px solid #d9d9d9;\n    border-radius: 4px;\n    font-size: 14px;\n    line-height: 1.5;\n    resize: vertical;\n    font-family: inherit;\n    box-sizing: border-box;\n  ";
    readonly dialog: "\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background: white;\n    border-radius: 8px;\n    box-shadow: 0 8px 24px rgba(0,0,0,0.2);\n    z-index: 10000;\n  ";
    readonly overlay: "\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0, 0, 0, 0.5);\n    z-index: 9999;\n  ";
    readonly dropdown: "\n    position: absolute;\n    background: white;\n    border: 1px solid #d9d9d9;\n    border-radius: 4px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n    z-index: 1000;\n  ";
    readonly tooltip: "\n    position: absolute;\n    padding: 4px 8px;\n    background: rgba(0, 0, 0, 0.8);\n    color: white;\n    font-size: 12px;\n    border-radius: 4px;\n    white-space: nowrap;\n    z-index: 10000;\n    pointer-events: none;\n  ";
};
export declare const StyleUtils: {
    /**
     * 合并样式字符串
     */
    mergeStyles(...styles: string[]): string;
    /**
     * 创建样式对象
     */
    createStyleObject(style: string): Record<string, string>;
    /**
     * 添加前缀类名
     */
    prefixClass(className: string): string;
    /**
     * 生成唯一ID
     */
    generateId(prefix?: string): string;
};
