/**
 * 字符串工具函数
 * 统一管理字符串处理相关功能
 */
/**
 * HTML转义
 */
export declare function escapeHTML(text: string): string;
/**
 * HTML反转义
 */
export declare function unescapeHTML(html: string): string;
/**
 * 驼峰命名转换
 */
export declare function toCamelCase(str: string): string;
/**
 * 短横线命名转换
 */
export declare function toKebabCase(str: string): string;
/**
 * 首字母大写
 */
export declare function capitalize(str: string): string;
/**
 * 截断字符串
 */
export declare function truncate(str: string, length: number, suffix?: string): string;
/**
 * 生成随机字符串
 */
export declare function randomString(length?: number, chars?: string): string;
/**
 * 格式化文件大小
 */
export declare function formatFileSize(bytes: number): string;
/**
 * 格式化时间
 */
export declare function formatTime(date: Date | number | string): string;
/**
 * 生成UUID
 */
export declare function uuid(): string;
/**
 * 判断是否为URL
 */
export declare function isURL(str: string): boolean;
/**
 * 判断是否为Email
 */
export declare function isEmail(str: string): boolean;
/**
 * 清理空白字符
 */
export declare function cleanWhitespace(str: string): string;
/**
 * 计算字符串中文字符数
 */
export declare function countChineseChars(str: string): number;
/**
 * 计算字数（中文算一个，英文单词算一个）
 */
export declare function countWords(str: string): number;
