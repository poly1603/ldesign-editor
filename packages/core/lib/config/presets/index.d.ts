/**
 * 预设配置集合
 * 为不同使用场景提供开箱即用的配置
 */
import type { EditorConfig } from '../ConfigManager';
/**
 * 博客编辑器预设
 * 适合：个人博客、文章写作
 */
export declare const blogPreset: EditorConfig;
/**
 * CMS编辑器预设
 * 适合：内容管理系统、企业文档
 */
export declare const cmsPreset: EditorConfig;
/**
 * 协作编辑器预设
 * 适合：团队协作、在线文档
 */
export declare const collaborationPreset: EditorConfig;
/**
 * Markdown编辑器预设
 * 适合：技术文档、README
 */
export declare const markdownPreset: EditorConfig;
/**
 * 笔记编辑器预设
 * 适合：个人笔记、知识管理
 */
export declare const notePreset: EditorConfig;
/**
 * 邮件编辑器预设
 * 适合：邮件客户端、通知编辑
 */
export declare const emailPreset: EditorConfig;
/**
 * 评论编辑器预设
 * 适合：评论框、反馈表单
 */
export declare const commentPreset: EditorConfig;
/**
 * 移动端编辑器预设
 * 适合：手机、平板
 */
export declare const mobilePreset: EditorConfig;
/**
 * 富文本编辑器预设
 * 适合：WYSIWYG编辑、页面编辑器
 */
export declare const richTextPreset: EditorConfig;
/**
 * AI增强编辑器预设
 * 适合：AI辅助写作、内容创作
 */
export declare const aiEnhancedPreset: EditorConfig;
/**
 * 代码文档编辑器预设
 * 适合：技术文档、API文档
 */
export declare const codeDocPreset: EditorConfig;
/**
 * 最小化编辑器预设
 * 适合：嵌入式编辑器、限制功能场景
 */
export declare const minimalPreset: EditorConfig;
/**
 * 所有预设配置
 */
export declare const presets: {
    blog: EditorConfig;
    cms: EditorConfig;
    collaboration: EditorConfig;
    markdown: EditorConfig;
    note: EditorConfig;
    email: EditorConfig;
    comment: EditorConfig;
    mobile: EditorConfig;
    richText: EditorConfig;
    aiEnhanced: EditorConfig;
    codeDoc: EditorConfig;
    minimal: EditorConfig;
};
/**
 * 预设配置类型
 */
export type PresetName = keyof typeof presets;
/**
 * 获取预设配置
 */
export declare function getPreset(name: PresetName): EditorConfig;
/**
 * 获取所有预设名称
 */
export declare function getPresetNames(): PresetName[];
/**
 * 预设配置描述
 */
export declare const presetDescriptions: Record<PresetName, {
    name: string;
    description: string;
    icon: string;
}>;
