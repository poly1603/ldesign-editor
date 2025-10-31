/**
 * AI 配置对话框
 * 用于配置 AI 功能设置
 */
import type { AIConfig } from '../ai/types';
/**
 * 显示 AI 配置对话框
 */
export declare function showAIConfigDialog(editor: any, currentConfig: AIConfig, onSave: (config: AIConfig) => void): void;
