/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { patchTableInsertCommand } from './plugins/table-patch.js';
export { AIService, getAIService, resetAIService } from './ai/AIService.js';
export { BaiduProvider } from './ai/providers/BaiduProvider.js';
export { ClaudeProvider } from './ai/providers/ClaudeProvider.js';
export { DeepSeekProvider } from './ai/providers/DeepSeekProvider.js';
export { GLMProvider } from './ai/providers/GLMProvider.js';
export { OpenAIProvider } from './ai/providers/OpenAIProvider.js';
export { QwenProvider } from './ai/providers/QwenProvider.js';
export { SparkProvider } from './ai/providers/SparkProvider.js';
export { defaultAIConfig } from './ai/types.js';
export { CollaborationManager } from './collaboration/CollaborationManager.js';
export { CRDT } from './collaboration/crdt/CRDT.js';
export { ConfigManager, getConfigManager, resetConfigManager } from './config/ConfigManager.js';
export { ConfigValidator, autoFixConfig, getConfigValidator, validateConfig } from './config/ConfigValidator.js';
export { editorConfigExample, fullFeaturedConfig, lightweightConfig, performanceConfigExample, pluginConfigExample, toolbarConfigExample } from './config/editor.config.example.js';
export { aiEnhancedPreset, blogPreset, cmsPreset, codeDocPreset, collaborationPreset, commentPreset, emailPreset, getPreset, getPresetNames, markdownPreset, minimalPreset, mobilePreset, notePreset, presetDescriptions, presets, richTextPreset } from './config/presets/index.js';
export { BasePlugin } from './core/base/BasePlugin.js';
export { CommandManager, KeymapManager } from './core/Command.js';
export { Document } from './core/Document.js';
export { Editor, Editor as default } from './core/Editor.js';
export { EditorBuilder, createEditor, createFormatOnlyEditor, createFullFeaturedEditor, createLightweightEditor } from './core/EditorBuilder.js';
export { EditorVirtualScroller } from './core/EditorVirtualScroller.js';
export { ErrorBoundary, captureError, getErrorBoundary, withErrorBoundary } from './core/ErrorBoundary.js';
export { EventEmitter } from './utils/event.js';
export { FeatureCategory, FeatureFlags, getFeatureFlags, resetFeatureFlags } from './core/FeatureFlags.js';
export { IncrementalRenderer } from './core/IncrementalRenderer.js';
export { LazyLoader, getLazyLoader, resetLazyLoader } from './core/LazyLoader.js';
export { OptimizedEventEmitter } from './core/OptimizedEventEmitter.js';
export { Plugin, PluginManager, createPlugin } from './core/Plugin.js';
export { PluginCategory, PluginRegistry, getPluginRegistry, resetPluginRegistry } from './core/PluginRegistry.js';
export { Schema, defaultSchema } from './core/Schema.js';
export { Selection, SelectionManager } from './core/Selection.js';
export { VirtualScroller } from './core/VirtualScroller.js';
export { DebugPanel } from './devtools/DebugPanel.js';
export { AuditLogger } from './enterprise/audit/AuditLogger.js';
export { PermissionManager } from './enterprise/auth/PermissionManager.js';
export { SSOManager } from './enterprise/auth/SSOManager.js';
export { I18nManager, getI18n, t } from './i18n/index.js';
export { IconManager, getIconManager, resetIconManager } from './icons/IconManager.js';
export { FeatherIconSet } from './icons/sets/feather.js';
export { LucideIconSet } from './icons/sets/lucide.js';
export { MaterialIconSet } from './icons/sets/material.js';
export { PluginMarket, getPluginMarket } from './marketplace/PluginMarket.js';
export { ContextMenu } from './mobile/components/ContextMenu.js';
export { MobileToolbar } from './mobile/components/MobileToolbar.js';
export { SwipeMenu } from './mobile/components/SwipeMenu.js';
export { GestureRecognizer } from './mobile/gestures/GestureRecognizer.js';
export { MobileEditorAdapter } from './mobile/MobileEditorAdapter.js';
export { allPlugins, defaultPlugins, extendedPlugins } from './plugins/index.js';
export { DiagramPlugin } from './plugins/diagrams/DiagramPlugin.js';
import './plugins/diagrams/DiagramRenderer.js';
import './plugins/diagrams/DiagramToolbar.js';
import './plugins/diagrams/editors/FlowchartEditor.js';
import './plugins/diagrams/editors/MindMapEditor.js';
import './plugins/diagrams/editors/UMLEditor.js';
import './pwa/BackgroundSyncManager.js';
import './pwa/CacheManager.js';
import './pwa/InstallPromptManager.js';
export { OfflineStorage } from './pwa/OfflineStorage.js';
export { PWAManager } from './pwa/PWAManager.js';
import './pwa/ServiceWorkerManager.js';
export { ThemeManager, getAvailableThemes, getCurrentTheme, getThemeManager, setTheme } from './theme/index.js';
export { showAIConfigDialog } from './ui/AIConfigDialog.js';
export { AIMockUtils, showAIDialog } from './ui/AIDialog.js';
export { showAISuggestionsOverlay } from './ui/AISuggestionsOverlay.js';
export { ComponentFactory, createButton, createCheckbox, createIconButton, createInput, createSelect, getComponentFactory } from './ui/base/ComponentFactory.js';
export { createColorPicker, showColorPicker } from './ui/ColorPicker.js';
export { ConfigComparison, showConfigComparison } from './ui/ConfigComparison.js';
export { ConfigPreview, showConfigPreview } from './ui/ConfigPreview.js';
export { ConfigWizard, showConfigWizard } from './ui/ConfigWizard.js';
export { createDropdown, showDropdown } from './ui/Dropdown.js';
export { showEmojiPicker } from './ui/EmojiPicker.js';
export { FeatureManagerPanel, showFeatureManager } from './ui/FeatureManagerPanel.js';
export { createFindReplaceDialog, showFindReplaceDialog } from './ui/FindReplaceDialog.js';
export { createIcon, getIconHTML } from './ui/icons/index.js';
export { PluginMarketPanel, showPluginMarket } from './ui/PluginMarketPanel.js';
export { SettingsPanel, showSettingsPanel } from './ui/SettingsPanel.js';
export { showTableDialog } from './ui/TableDialog.js';
export { showEnhancedTableGridSelector, showTableGridSelector } from './ui/TableGridSelector.js';
export { Toolbar } from './ui/Toolbar.js';
export { ToolbarManager } from './ui/ToolbarManager.js';
export { UnifiedDialog, showAlertDialog, showConfirmDialog, showPromptDialog, showUnifiedDialog } from './ui/UnifiedDialog.js';
export { UploadProgress, createUploadProgress, showUploadProgress } from './ui/UploadProgress.js';
export { AutoOptimizer, getAutoOptimizer, startAutoOptimization, stopAutoOptimization } from './utils/AutoOptimizer.js';
export { Batcher, LRUCache, clamp, debounce, deepClone, deepMerge, delay, formatDuration, formatFileSize, generateId, isEmpty, retry, throttle } from './utils/helpers.js';
export { PerformanceMonitor, endTimer, getPerformanceMonitor, measure, startTimer } from './utils/PerformanceMonitor.js';
export { batch, debug, editor, optimize, quick } from './utils/shortcuts.js';
export { $, classNames, cmd, css, on, str, ui } from './utils/simplify.js';
export { WasmAccelerator } from './wasm/WasmAccelerator.js';
export { WasmDiff } from './wasm/WasmDiff.js';
export { WasmParser } from './wasm/WasmParser.js';
export { default as AIPlugin } from './plugins/ai/AIPluginV2.js';
export { default as TemplatePlugin, getTemplateManager } from './plugins/template.js';
export { default as FormattingCommandsPlugin } from './plugins/formatting/formatting-commands.js';
export { ImagePlugin } from './plugins/media/image.js';
export { ImageResizePlugin } from './plugins/media/image-resize/index.js';
export { default as MediaCommandsPlugin } from './plugins/media/media-commands.js';
export { MediaContextMenuPlugin } from './plugins/media/media-context-menu/MediaContextMenuPlugin.js';
export { MediaDialogPlugin } from './plugins/media/media-dialog.js';
export { ContextMenuPlugin } from './plugins/utils/context-menu.js';
export { ExportMarkdownPlugin } from './plugins/utils/export-markdown.js';
export { FindReplacePlugin } from './plugins/utils/find-replace.js';
export { default as FullscreenPlugin } from './plugins/utils/fullscreen.js';
export { default as HistoryPlugin } from './plugins/utils/history.js';
export { default as WordCountPlugin } from './plugins/utils/word-count.js';
export { CodeBlockPlugin } from './plugins/codeblock.js';
export { EmojiPlugin } from './plugins/emoji.js';
export { AlignPlugin } from './plugins/formatting/align.js';
export { BackgroundColorPlugin, PRESET_COLORS, TextColorPlugin } from './plugins/formatting/color.js';
export { FONT_FAMILIES, FONT_SIZES, FontFamilyPlugin, FontSizePlugin } from './plugins/formatting/font.js';
export { BoldPlugin, ClearFormatPlugin, CodePlugin, InlineCodePlugin, ItalicPlugin, StrikePlugin, UnderlinePlugin } from './plugins/formatting/formatting.js';
export { IndentPlugin } from './plugins/formatting/indent.js';
export { LINE_HEIGHTS, LineHeightPlugin } from './plugins/formatting/line-height.js';
export { SubscriptPlugin, SuperscriptPlugin } from './plugins/formatting/script.js';
export { CapitalizePlugin, LowerCasePlugin, TextTransformPlugin, UpperCasePlugin } from './plugins/formatting/text-transform.js';
export { formattingPlugins } from './plugins/formatting/index.js';
export { mediaPlugins } from './plugins/media/index.js';
export { TablePlugin, tablePlugins } from './plugins/table.js';
export { EnhancedTablePlugin } from './plugins/table-enhanced.js';
export { BlockquotePlugin } from './plugins/text/blockquote.js';
export { HeadingPlugin } from './plugins/text/heading.js';
export { LinkPlugin } from './plugins/text/link.js';
export { BulletListPlugin, OrderedListPlugin, TaskListPlugin } from './plugins/text/list.js';
export { textPlugins } from './plugins/text/index.js';
export { utilPlugins } from './plugins/utils/index.js';

/**
 * @ldesign/editor
 * 功能强大、扩展性强的富文本编辑器
 */
// 应用表格补丁 - 自动替换旧的表格插入功能
// 自动应用补丁
if (typeof window !== 'undefined') {
    // 延迟执行，确保编辑器已初始化
    setTimeout(() => {
        patchTableInsertCommand();
    }, 500);
}

export { patchTableInsertCommand };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
