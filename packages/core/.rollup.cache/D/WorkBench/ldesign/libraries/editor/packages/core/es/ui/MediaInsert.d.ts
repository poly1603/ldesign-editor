/**
 * 媒体插入功能
 * 支持图片、视频、音频的本地上传和网络地址插入
 */
export type MediaType = 'image' | 'video' | 'audio';
export interface MediaInsertOptions {
    type: MediaType;
    onInsert: (urls: string[], alt?: string) => void;
    accept?: string;
    multiple?: boolean;
}
/**
 * 显示媒体插入下拉框
 */
export declare function showMediaInsert(button: HTMLElement, options: MediaInsertOptions): void;
/**
 * 插入媒体元素到编辑器
 */
export declare function insertMedia(type: MediaType, urls: string[], options?: {
    alt?: string;
    width?: number;
    height?: number;
    controls?: boolean;
}): void;
