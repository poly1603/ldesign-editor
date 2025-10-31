/**
 * 颜色处理工具函数
 */
export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface RGBA extends RGB {
    a: number;
}
export interface HSL {
    h: number;
    s: number;
    l: number;
}
export interface HSLA extends HSL {
    a: number;
}
/**
 * 将十六进制颜色转换为 RGB
 */
export declare function hexToRgb(hex: string): RGB | null;
/**
 * 将 RGB 转换为十六进制颜色
 */
export declare function rgbToHex(rgb: RGB): string;
/**
 * 将 RGBA 转换为十六进制颜色（包含透明度）
 */
export declare function rgbaToHex(rgba: RGBA): string;
/**
 * 解析颜色字符串
 */
export declare function parseColor(color: string): RGBA | null;
/**
 * 检查是否为有效颜色
 */
export declare function isValidColor(color: string): boolean;
/**
 * RGB 转 HSL
 */
export declare function rgbToHsl(rgb: RGB): HSL;
/**
 * HSL 转 RGB
 */
export declare function hslToRgb(hsl: HSL): RGB;
/**
 * 调整颜色亮度
 */
export declare function adjustBrightness(color: string, percent: number): string;
/**
 * 变亮颜色
 */
export declare function lighten(color: string, percent?: number): string;
/**
 * 变暗颜色
 */
export declare function darken(color: string, percent?: number): string;
/**
 * 调整颜色透明度
 */
export declare function setAlpha(color: string, alpha: number): string;
/**
 * 混合两个颜色
 */
export declare function mixColors(color1: string, color2: string, weight?: number): string;
/**
 * 计算对比色
 */
export declare function getContrastColor(color: string): string;
/**
 * 计算互补色
 */
export declare function getComplementaryColor(color: string): string;
/**
 * 生成颜色渐变
 */
export declare function generateGradient(startColor: string, endColor: string, steps?: number): string[];
/**
 * 随机生成颜色
 */
export declare function randomColor(options?: {
    brightness?: 'light' | 'dark' | 'random';
    alpha?: number;
}): string;
/**
 * 获取颜色的CSS变量值
 */
export declare function getCSSVariableColor(variable: string): string | null;
/**
 * 设置CSS变量颜色
 */
export declare function setCSSVariableColor(variable: string, color: string): void;
/**
 * 将颜色转换为CSS格式
 */
export declare function toCSSColor(color: string | RGB | RGBA): string;
