/**
 * @ldesign/editor-core
 * 功能强大、扩展性强的富文本编辑器
 *
 * @example
 * ```typescript
 * import { Editor } from '@ldesign/editor-core'
 * import { standardPlugins } from '@ldesign/editor-core/presets'
 * import '@ldesign/editor-core/styles/editor.css'
 *
 * const editor = new Editor({
 *   element: '#editor',
 *   plugins: standardPlugins,
 * })
 * ```
 */
export { AIService, getAIService, resetAIService } from './ai/AIService';
export { BaiduProvider } from './ai/providers/BaiduProvider';
export { ClaudeProvider } from './ai/providers/ClaudeProvider';
export { DeepSeekProvider } from './ai/providers/DeepSeekProvider';
export { GLMProvider } from './ai/providers/GLMProvider';
export { OpenAIProvider } from './ai/providers/OpenAIProvider';
export { QwenProvider } from './ai/providers/QwenProvider';
export { SparkProvider } from './ai/providers/SparkProvider';
export type { AIConfig, AIModelConfig, AIProvider, AIProviderInterface, AIRequest, AIRequestType, AIResponse, } from './ai/types';
export { defaultAIConfig } from './ai/types';
export { CollaborationManager, CRDT } from './collaboration';
export type { CollaborationConfig, CollaborationUser, CRDTOperation, CRDTState } from './collaboration';
export { ConfigManager, getConfigManager, resetConfigManager, } from './config/ConfigManager';
export type { EditorConfig } from './config/ConfigManager';
export { autoFixConfig, ConfigValidator, getConfigValidator, validateConfig, } from './config/ConfigValidator';
export type { ValidationError, ValidationResult, ValidationSuggestion, ValidationWarning, } from './config/ConfigValidator';
export { editorConfigExample, fullFeaturedConfig, lightweightConfig, performanceConfigExample, pluginConfigExample, toolbarConfigExample, } from './config/editor.config.example';
export { aiEnhancedPreset, blogPreset, cmsPreset, codeDocPreset, collaborationPreset, commentPreset, emailPreset, getPreset, getPresetNames, markdownPreset, minimalPreset as minimalConfigPreset, mobilePreset, notePreset, presetDescriptions, presets as configPresets, richTextPreset, } from './config/presets';
export type { PresetName as ConfigPresetName } from './config/presets';
export { BasePlugin } from './core/base/BasePlugin';
export type { BasePluginConfig } from './core/base/BasePlugin';
export { CommandManager, KeymapManager } from './core/Command';
export { Document } from './core/Document';
export { Editor } from './core/Editor';
export { Editor as default } from './core/Editor';
export { createEditor, createFormatOnlyEditor, createFullFeaturedEditor, createLightweightEditor, EditorBuilder, } from './core/EditorBuilder';
export { EditorVirtualScroller } from './core/EditorVirtualScroller';
export type { EditorLine, EditorVirtualScrollerOptions } from './core/EditorVirtualScroller';
export { captureError, ErrorBoundary, getErrorBoundary, withErrorBoundary, } from './core/ErrorBoundary';
export type { ErrorBoundaryConfig, ErrorInfo } from './core/ErrorBoundary';
export { EventEmitter } from './core/EventEmitter';
export { FeatureCategory, FeatureFlags, getFeatureFlags, resetFeatureFlags, } from './core/FeatureFlags';
export type { Feature } from './core/FeatureFlags';
export { IncrementalRenderer } from './core/IncrementalRenderer';
export type { DOMPatch, RenderOptions } from './core/IncrementalRenderer';
export { getLazyLoader, LazyLoader, resetLazyLoader, } from './core/LazyLoader';
export type { LoaderFunction, LoadOptions } from './core/LazyLoader';
export { OptimizedEventEmitter } from './core/OptimizedEventEmitter';
export { createPlugin, Plugin, PluginManager } from './core/Plugin';
export { getPluginRegistry, PluginCategory, PluginRegistry, resetPluginRegistry, } from './core/PluginRegistry';
export type { PluginConfig, PluginLoader, PluginMetadata, } from './core/PluginRegistry';
export { defaultSchema, Schema } from './core/Schema';
export { Selection, SelectionManager } from './core/Selection';
export { VirtualScroller } from './core/VirtualScroller';
export type { VirtualScrollerItem, VirtualScrollerOptions } from './core/VirtualScroller';
export { DebugPanel } from './devtools/DebugPanel';
export type { DebugPanelOptions, TabName } from './devtools/DebugPanel';
export { AuditLogger, PermissionManager, SSOManager } from './enterprise';
export type { AuditConfig, AuditLog, Permission, Role, SSOConfig, User } from './enterprise';
export { getI18n, I18nManager, t, } from './i18n';
export type { I18nConfig, LocaleMessages } from './i18n';
export { getIconManager, IconManager, resetIconManager, } from './icons/IconManager';
export { FeatherIconSet } from './icons/sets/feather';
export { LucideIconSet } from './icons/sets/lucide';
export { MaterialIconSet } from './icons/sets/material';
export type { EditorIconMap, IconCategory, IconDefinition, IconManagerConfig, IconRenderOptions, IconSet, IconSetType, IconStyle, } from './icons/types';
export { getPluginMarket, PluginMarket, } from './marketplace/PluginMarket';
export type { MarketplacePlugin } from './marketplace/PluginMarket';
export { ContextMenu } from './mobile/components/ContextMenu';
export type { ContextMenuItem, ContextMenuOptions, ShowOptions as ContextMenuShowOptions } from './mobile/components/ContextMenu';
export { MobileToolbar } from './mobile/components/MobileToolbar';
export type { MobileToolbarOptions, ToolbarItem } from './mobile/components/MobileToolbar';
export { SwipeMenu } from './mobile/components/SwipeMenu';
export type { SwipeMenuItem, SwipeMenuOptions } from './mobile/components/SwipeMenu';
export { GestureRecognizer } from './mobile/gestures/GestureRecognizer';
export type { GestureEvent, GestureRecognizerOptions } from './mobile/gestures/GestureRecognizer';
export { MobileEditorAdapter } from './mobile/MobileEditorAdapter';
export type { MobileEditorOptions } from './mobile/MobileEditorAdapter';
export * from './plugins';
export { DiagramPlugin } from './plugins/diagrams';
export type { DiagramData, DiagramType, FlowchartData, GanttData, MindMapData, SequenceData, UMLData, } from './plugins/diagrams';
export { patchTableInsertCommand } from './plugins/table/table-patch';
export { basicPlugins, blogPlugins, createPreset, documentPlugins, fullPlugins, minimalPlugins, standardPlugins, } from './presets';
export { OfflineStorage, PWAManager } from './pwa';
export type { OfflineData, PWAConfig, PWAStatus } from './pwa';
export { getAvailableThemes, getCurrentTheme, getThemeManager, setTheme, ThemeManager, } from './theme';
export type { Theme, ThemeBorders, ThemeColors, ThemeFonts, ThemeSpacing, } from './theme';
export type * from './types';
export { showAIConfigDialog } from './ui/AIConfigDialog';
export { type AIDialogType, AIMockUtils, showAIDialog } from './ui/AIDialog';
export { showAISuggestionsOverlay } from './ui/AISuggestionsOverlay';
export { ComponentFactory, createButton, createCheckbox, createIconButton, createInput, createSelect, getComponentFactory, } from './ui/base/ComponentFactory';
export type { ButtonOptions, ButtonType, DialogOptions, InputOptions, SelectOptions, } from './ui/base/ComponentFactory';
export { createColorPicker, showColorPicker } from './ui/ColorPicker';
export { ConfigComparison, showConfigComparison } from './ui/ConfigComparison';
export { ConfigPreview, showConfigPreview } from './ui/ConfigPreview';
export { ConfigWizard, showConfigWizard } from './ui/ConfigWizard';
export { createDropdown, showDropdown } from './ui/Dropdown';
export { showEmojiPicker } from './ui/EmojiPicker';
export { FeatureManagerPanel, showFeatureManager } from './ui/FeatureManagerPanel';
export { createFindReplaceDialog, showFindReplaceDialog } from './ui/FindReplaceDialog';
export { createIcon, getIconHTML } from './ui/icons';
export { PluginMarketPanel, showPluginMarket } from './ui/PluginMarketPanel';
export { SettingsPanel, showSettingsPanel } from './ui/SettingsPanel';
export { showTableDialog } from './ui/TableDialog';
export { showEnhancedTableGridSelector, showTableGridSelector } from './ui/TableGridSelector';
export { Toolbar } from './ui/Toolbar';
export { ToolbarManager } from './ui/ToolbarManager';
export type { ToolbarGroupConfig, ToolbarManagerConfig, } from './ui/ToolbarManager';
export { showAlertDialog, showConfirmDialog, showPromptDialog, showUnifiedDialog, UnifiedDialog, } from './ui/UnifiedDialog';
export { createUploadProgress, showUploadProgress, UploadProgress } from './ui/UploadProgress';
export type { UploadProgressOptions } from './ui/UploadProgress';
export { AutoOptimizer, getAutoOptimizer, startAutoOptimization, stopAutoOptimization, } from './utils/AutoOptimizer';
export type { AutoOptimizerConfig, OptimizationSuggestion, } from './utils/AutoOptimizer';
export { Batcher, clamp, debounce, deepClone, deepMerge, delay, formatDuration, formatFileSize, generateId, isEmpty, LRUCache, retry, throttle, } from './utils/helpers';
export { endTimer, getPerformanceMonitor, measure, PerformanceMonitor, startTimer, } from './utils/PerformanceMonitor';
export type { PerformanceEntry, PerformanceMetrics, } from './utils/PerformanceMonitor';
export { batch, debug, editor, optimize, quick } from './utils/shortcuts';
export { $, classNames, cmd, css, on, str, ui } from './utils/simplify';
export { WasmAccelerator } from './wasm/WasmAccelerator';
export type { AcceleratorOptions, AcceleratorStats } from './wasm/WasmAccelerator';
export { WasmDiff } from './wasm/WasmDiff';
export type { DiffOperation, DiffResult, WasmDiffOptions } from './wasm/WasmDiff';
export { WasmParser } from './wasm/WasmParser';
export type { NodeType, ParsedNode, ParseResult, WasmParserOptions } from './wasm/WasmParser';
//# sourceMappingURL=index.d.ts.map