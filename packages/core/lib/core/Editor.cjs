/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var DebugPanel = require('../devtools/DebugPanel.cjs');
var index = require('../plugins/index.cjs');
var defaultToolbar = require('../ui/defaultToolbar.cjs');
var Toolbar = require('../ui/Toolbar.cjs');
var logger$1 = require('../utils/logger.cjs');
var WasmAccelerator = require('../wasm/WasmAccelerator.cjs');
var Command = require('./Command.cjs');
var Document = require('./Document.cjs');
var EditorVirtualScroller = require('./EditorVirtualScroller.cjs');
var event = require('../utils/event.cjs');
var IncrementalRenderer = require('./IncrementalRenderer.cjs');
var Plugin = require('./Plugin.cjs');
var Schema = require('./Schema.cjs');
var Selection = require('./Selection.cjs');
var mediaCommands = require('../plugins/media/media-commands.cjs');
var formattingCommands = require('../plugins/formatting/formatting-commands.cjs');
var AIPluginV2 = require('../plugins/ai/AIPluginV2.cjs');
var image = require('../plugins/media/image.cjs');
var history = require('../plugins/utils/history.cjs');
var fullscreen = require('../plugins/utils/fullscreen.cjs');
var findReplace = require('../plugins/utils/find-replace.cjs');
var wordCount = require('../plugins/utils/word-count.cjs');
var exportMarkdown = require('../plugins/utils/export-markdown.cjs');
var mediaDialog = require('../plugins/media/media-dialog.cjs');
var contextMenu = require('../plugins/utils/context-menu.cjs');
var MediaContextMenuPlugin = require('../plugins/media/media-context-menu/MediaContextMenuPlugin.cjs');
var index$1 = require('../plugins/media/image-resize/index.cjs');
var heading = require('../plugins/text/heading.cjs');
var formatting = require('../plugins/formatting/formatting.cjs');
var script = require('../plugins/formatting/script.cjs');
var blockquote = require('../plugins/text/blockquote.cjs');
var codeblock = require('../plugins/codeblock.cjs');
var list = require('../plugins/text/list.cjs');
var link = require('../plugins/text/link.cjs');
var table = require('../plugins/table.cjs');
var align = require('../plugins/formatting/align.cjs');
var color = require('../plugins/formatting/color.cjs');
var font = require('../plugins/formatting/font.cjs');
var indent = require('../plugins/formatting/indent.cjs');
var lineHeight = require('../plugins/formatting/line-height.cjs');
var textTransform = require('../plugins/formatting/text-transform.cjs');
var emoji = require('../plugins/emoji.cjs');

/**
 * Editor - 编辑器核心类
 * 管理编辑器的所有功能
 */
const logger = logger$1.createLogger('Editor');
class Editor {
    constructor(options = {}) {
        this.version = '1.3.0';
        this.editable = true;
        // DOM
        this.element = null;
        this.contentElement = null;
        this.toolbarElement = null;
        // 状态
        this.destroyed = false;
        // DOM 选区快照（用于在弹窗交互后恢复插入位置）
        this.savedRange = null;
        this.options = options;
        this.editable = options.editable !== false;
        // 初始化核心组件
        this.eventEmitter = new event.EventEmitter();
        this.schema = Schema.defaultSchema;
        this.document = new Document.Document(options.content, this.schema);
        this.selectionManager = new Selection.SelectionManager(this);
        // 初始化管理器
        this.commands = new Command.CommandManager(this);
        this.keymap = new Command.KeymapManager(this);
        this.plugins = new Plugin.PluginManager(this);
        // 初始化 DOM
        if (options.element)
            this.mount(options.element);
        // 注册插件 - 如果没有指定插件，默认加载所有插件
        logger.debug('options.plugins provided?', !!options.plugins);
        if (options.plugins)
            logger.debug('Using provided plugins:', options.plugins.length);
        else
            logger.debug('Using default plugins from getAllDefaultPlugins()');
        const pluginsToLoad = options.plugins || this.getAllDefaultPlugins();
        logger.debug('Loading plugins, total:', pluginsToLoad.length);
        logger.debug('Plugin list:', pluginsToLoad.map(p => typeof p === 'string' ? p : p?.name || 'unnamed'));
        logger.debug('HeadingPlugin exists in AllPlugins:', !!heading.HeadingPlugin);
        if (heading.HeadingPlugin) {
            logger.debug('HeadingPlugin name:', heading.HeadingPlugin.name);
            logger.debug('HeadingPlugin config:', heading.HeadingPlugin.config);
            logger.debug('Is HeadingPlugin in pluginsToLoad?', pluginsToLoad.includes(heading.HeadingPlugin));
        }
        pluginsToLoad.forEach((plugin, index) => {
            if (typeof plugin === 'string') {
                logger.debug(`Loading builtin plugin [${index}]: "${plugin}"`);
                // 从内置插件加载
                this.loadBuiltinPlugin(plugin);
            }
            else {
                logger.debug(`Loading plugin [${index}]: "${plugin.name || 'unnamed'}"`);
                if (plugin.name === 'heading') {
                    logger.debug('HeadingPlugin found in plugins list!');
                    logger.debug('HeadingPlugin config:', plugin.config);
                }
                this.plugins.register(plugin);
            }
        });
        logger.debug('All plugins loaded');
        logger.debug('Registered commands:', this.commands.getCommands());
        // 初始化事件监听
        this.setupEventListeners();
        // 将编辑器实例保存到全局，以便工具栏访问
        if (typeof window !== 'undefined')
            window.editor = this;
    }
    /**
     * 获取所有默认插件
     */
    getAllDefaultPlugins() {
        logger.debug('Getting default plugins...');
        logger.debug('AllPlugins keys:', Object.keys(index));
        // 检查 HeadingPlugin 是否存在
        logger.debug('HeadingPlugin check:', {
            exists: !!heading.HeadingPlugin,
            type: typeof heading.HeadingPlugin,
            value: heading.HeadingPlugin,
        });
        const plugins = [];
        // 最重要！首先加载 HeadingPlugin
        if (heading.HeadingPlugin) {
            logger.debug('✅ Adding HeadingPlugin to default plugins');
            plugins.push(heading.HeadingPlugin);
        }
        else {
            logger.error('❌ HeadingPlugin is undefined! This is critical!');
        }
        // 首先加入基础插件（命令插件）
        if (mediaCommands.default) {
            logger.debug('Adding MediaCommandsPlugin');
            plugins.push(mediaCommands.default);
        }
        if (formattingCommands.default) {
            logger.debug('Adding FormattingCommandsPlugin');
            plugins.push(formattingCommands.default);
        }
        // AI 功能 - 最重要，默认启用
        if (AIPluginV2.default) {
            logger.debug('Adding AIPlugin to default plugins');
            plugins.push(AIPluginV2.default);
        }
        // 基础格式化
        if (formatting.BoldPlugin)
            plugins.push(formatting.BoldPlugin);
        if (formatting.ItalicPlugin)
            plugins.push(formatting.ItalicPlugin);
        if (formatting.UnderlinePlugin)
            plugins.push(formatting.UnderlinePlugin);
        if (formatting.StrikePlugin)
            plugins.push(formatting.StrikePlugin);
        if (formatting.InlineCodePlugin)
            plugins.push(formatting.InlineCodePlugin);
        if (script.SuperscriptPlugin)
            plugins.push(script.SuperscriptPlugin);
        if (script.SubscriptPlugin)
            plugins.push(script.SubscriptPlugin);
        if (formatting.ClearFormatPlugin)
            plugins.push(formatting.ClearFormatPlugin);
        // 标题和块级元素 - 特别检查 HeadingPlugin
        if (heading.HeadingPlugin) {
            console.log('[Editor] Adding HeadingPlugin to list');
            plugins.push(heading.HeadingPlugin);
        }
        else {
            console.error('[Editor] HeadingPlugin is undefined!');
        }
        if (blockquote.BlockquotePlugin)
            plugins.push(blockquote.BlockquotePlugin);
        if (codeblock.CodeBlockPlugin)
            plugins.push(codeblock.CodeBlockPlugin);
        // 列表
        if (list.BulletListPlugin)
            plugins.push(list.BulletListPlugin);
        if (list.OrderedListPlugin)
            plugins.push(list.OrderedListPlugin);
        if (list.TaskListPlugin)
            plugins.push(list.TaskListPlugin);
        // 节点插件
        if (link.LinkPlugin)
            plugins.push(link.LinkPlugin);
        if (image.ImagePlugin)
            plugins.push(image.ImagePlugin);
        if (table.TablePlugin)
            plugins.push(table.TablePlugin);
        // 文本样式
        if (align.AlignPlugin)
            plugins.push(align.AlignPlugin);
        if (color.TextColorPlugin)
            plugins.push(color.TextColorPlugin);
        if (color.BackgroundColorPlugin)
            plugins.push(color.BackgroundColorPlugin);
        if (font.FontSizePlugin)
            plugins.push(font.FontSizePlugin);
        if (font.FontFamilyPlugin)
            plugins.push(font.FontFamilyPlugin);
        if (indent.IndentPlugin)
            plugins.push(indent.IndentPlugin);
        if (lineHeight.LineHeightPlugin)
            plugins.push(lineHeight.LineHeightPlugin);
        if (textTransform.TextTransformPlugin)
            plugins.push(textTransform.TextTransformPlugin);
        // 功能插件
        if (history.default)
            plugins.push(history.default);
        if (fullscreen.default)
            plugins.push(fullscreen.default);
        if (findReplace.FindReplacePlugin)
            plugins.push(findReplace.FindReplacePlugin);
        if (wordCount.default)
            plugins.push(wordCount.default);
        if (exportMarkdown.ExportMarkdownPlugin)
            plugins.push(exportMarkdown.ExportMarkdownPlugin);
        if (mediaDialog.MediaDialogPlugin)
            plugins.push(mediaDialog.MediaDialogPlugin);
        if (contextMenu.ContextMenuPlugin)
            plugins.push(contextMenu.ContextMenuPlugin);
        // 图片编辑功能插件 - 创建实例
        if (MediaContextMenuPlugin.MediaContextMenuPlugin)
            plugins.push(new MediaContextMenuPlugin.MediaContextMenuPlugin());
        if (index$1.ImageResizePlugin) {
            plugins.push(new index$1.ImageResizePlugin({
                minWidth: 50,
                minHeight: 50,
                preserveAspectRatio: true,
                showDimensions: true,
            }));
        }
        logger.debug(`Total plugins to load: ${plugins.length}`);
        logger.debug('Plugin names:', plugins.map(p => p.name).join(', '));
        // 添加 EmojiPlugin（确保它被加载）
        if (emoji.EmojiPlugin) {
            logger.debug('✅ EmojiPlugin found, adding to plugins list');
            plugins.push(emoji.EmojiPlugin);
        }
        else {
            logger.warn('⚠️ EmojiPlugin not found in AllPlugins!');
            logger.debug('Available plugins:', Object.keys(index).filter(k => k.includes('Plugin')));
        }
        return plugins;
    }
    /**
     * 挂载编辑器
     */
    mount(element) {
        if (typeof element === 'string') {
            const el = document.querySelector(element);
            if (!el)
                throw new Error(`Element "${element}" not found`);
            this.element = el;
        }
        else {
            this.element = element;
        }
        // 创建编辑器 DOM 结构
        this.element.classList.add('ldesign-editor');
        this.element.classList.add('ldesign-editor-wrapper');
        // 创建工具栏容器 (默认创建)
        if (this.options.toolbar !== false) {
            this.toolbarElement = document.createElement('div');
            this.toolbarElement.classList.add('ldesign-toolbar');
            this.element.appendChild(this.toolbarElement);
            // 创建工具栏实例
            this.toolbar = new Toolbar.Toolbar(this, {
                container: this.toolbarElement,
                items: this.options.toolbarItems || defaultToolbar.DEFAULT_TOOLBAR_ITEMS,
            });
        }
        // 创建编辑器内容区域
        this.contentElement = document.createElement('div');
        this.contentElement.classList.add('ldesign-editor-content');
        this.contentElement.contentEditable = String(this.editable);
        // 设置占位符
        if (this.options.placeholder)
            this.contentElement.dataset.placeholder = this.options.placeholder;
        this.element.appendChild(this.contentElement);
        // 初始化增量渲染器
        if (this.options.incrementalRender?.enabled !== false) {
            this.incrementalRenderer = new IncrementalRenderer.IncrementalRenderer({
                batchDelay: this.options.incrementalRender?.batchDelay,
                maxBatchSize: this.options.incrementalRender?.maxBatchSize,
                useRAF: this.options.incrementalRender?.useRAF !== false,
                useWorker: this.options.incrementalRender?.useWorker,
                useVirtualDOM: this.options.incrementalRender?.useVirtualDOM,
            });
            // 观察内容元素的变化
            this.incrementalRenderer.observeElement(this.contentElement);
        }
        // 初始化WebAssembly加速器
        if (this.options.wasm?.enabled !== false && WasmAccelerator.WasmAccelerator.isSupported()) {
            this.wasmAccelerator = new WasmAccelerator.WasmAccelerator({
                enabled: this.options.wasm?.enabled !== false,
                enableDiff: this.options.wasm?.enableDiff !== false,
                enableParser: this.options.wasm?.enableParser !== false,
                useWorker: this.options.wasm?.useWorker,
                warmupStrategy: this.options.wasm?.warmupStrategy || 'lazy',
            });
            // 预热WASM模块（异步）
            if (this.options.wasm?.warmupStrategy === 'eager') {
                this.wasmAccelerator.initialize().catch((error) => {
                    logger.warn('WASM initialization failed:', error);
                });
            }
        }
        // 初始化虚拟滚动（如果启用）
        if (this.options.virtualScroll?.enabled) {
            this.virtualScroller = new EditorVirtualScroller.EditorVirtualScroller({
                editor: this,
                lineHeight: this.options.virtualScroll.lineHeight,
                maxLines: this.options.virtualScroll.maxLines,
                enableSyntaxHighlight: this.options.virtualScroll.enableSyntaxHighlight,
                enableLineNumbers: this.options.virtualScroll.enableLineNumbers,
                enableWordWrap: this.options.virtualScroll.enableWordWrap,
            });
            // 使用虚拟滚动渲染
            this.virtualScroller.setContent(this.document.toText());
        }
        else {
            // 普通渲染
            this.render();
        }
        // 自动聚焦
        if (this.options.autofocus)
            this.focus();
        // 初始化调试面板
        if (this.options.debugPanel?.enabled) {
            this.debugPanel = new DebugPanel.DebugPanel({
                editor: this,
                expanded: this.options.debugPanel.expanded,
                initialTab: this.options.debugPanel.initialTab,
                theme: this.options.debugPanel.theme,
                position: this.options.debugPanel.position,
                size: this.options.debugPanel.size,
                resizable: this.options.debugPanel.resizable,
                showInProduction: this.options.debugPanel.showInProduction,
            });
        }
    }
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        if (!this.contentElement)
            return;
        // 键盘事件
        this.contentElement.addEventListener('keydown', (e) => {
            if (this.keymap.handleKeyDown(e))
                e.preventDefault();
        });
        // 输入事件
        this.contentElement.addEventListener('input', (e) => {
            this.handleInput();
        });
        // 选区变化
        document.addEventListener('selectionchange', () => {
            const sel = window.getSelection();
            if (this.contentElement && this.contentElement.contains(sel?.anchorNode || null)) {
                // 同步到内部 Selection 模型
                this.selectionManager.syncFromDOM();
                this.emit('selectionUpdate', this.getSelection());
                // 保存 DOM 级别的 Range 以便弹窗关闭后恢复
                if (sel && sel.rangeCount > 0) {
                    try {
                        this.savedRange = sel.getRangeAt(0).cloneRange();
                    }
                    catch { }
                }
            }
        });
        // 聚焦和失焦
        this.contentElement.addEventListener('focus', () => {
            this.emit('focus');
            this.options.onFocus?.();
        });
        this.contentElement.addEventListener('blur', () => {
            this.emit('blur');
            this.options.onBlur?.();
        });
    }
    /**
     * 处理输入
     */
    handleInput() {
        if (!this.contentElement)
            return;
        // 更新文档
        const html = this.contentElement.innerHTML;
        this.document = new Document.Document(html, this.schema);
        // 触发更新事件
        this.emit('update', this.getState());
        this.options.onUpdate?.(this.getState());
        this.options.onChange?.(this.getHTML());
    }
    /**
     * 渲染内容
     */
    render() {
        if (!this.contentElement)
            return;
        const html = this.document.toHTML();
        if (this.incrementalRenderer) {
            // 使用增量渲染
            this.renderIncremental(html);
        }
        else {
            // 保存当前选区
            const selection = this.getSelection();
            // 更新内容
            this.contentElement.innerHTML = html;
            // 恢复选区
            if (selection)
                this.setSelection(selection);
        }
    }
    /**
     * 增量渲染内容
     */
    renderIncremental(newHTML) {
        if (!this.contentElement || !this.incrementalRenderer)
            return;
        // 创建临时DOM来解析新HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHTML;
        // 计算差异并生成补丁
        const patches = this.calculatePatches(this.contentElement, tempDiv);
        // 应用补丁
        if (patches.length > 0)
            this.incrementalRenderer.queuePatches(patches);
    }
    /**
     * 计算DOM补丁
     */
    calculatePatches(oldRoot, newRoot) {
        const patches = [];
        // 简单的差异算法（实际应该使用更复杂的算法）
        const oldChildren = Array.from(oldRoot.children);
        const newChildren = Array.from(newRoot.children);
        // 处理删除的节点
        oldChildren.forEach((oldChild, index) => {
            if (!newChildren[index]) {
                patches.push({
                    type: 'remove',
                    target: oldChild,
                });
            }
        });
        // 处理新增和更新的节点
        newChildren.forEach((newChild, index) => {
            const oldChild = oldChildren[index];
            if (!oldChild) {
                // 新增节点
                patches.push({
                    type: 'insert',
                    parent: oldRoot,
                    newNode: newChild.cloneNode(true),
                    index,
                });
            }
            else if (oldChild.outerHTML !== newChild.outerHTML) {
                // 更新节点
                patches.push({
                    type: 'update',
                    target: oldChild,
                    newNode: newChild.cloneNode(true),
                });
            }
        });
        return patches;
    }
    /**
     * 加载内置插件
     */
    loadBuiltinPlugin(name) {
        // 动态导入插件
        switch (name) {
            case 'image':
                Promise.resolve().then(function () { return require('../plugins/media/image.cjs'); }).then((module) => {
                    this.plugins.register(module.ImagePlugin);
                });
                break;
            case 'formatting':
                Promise.resolve().then(function () { return require('../plugins/formatting/index.cjs'); }).then((module) => {
                    if (module.BoldPlugin)
                        this.plugins.register(module.BoldPlugin);
                    if (module.ItalicPlugin)
                        this.plugins.register(module.ItalicPlugin);
                    if (module.UnderlinePlugin)
                        this.plugins.register(module.UnderlinePlugin);
                });
                break;
            // 其他插件可以在这里添加
            default:
                logger.warn(`未知插件: ${name}`);
        }
    }
    /**
     * 获取编辑器容器元素
     */
    getElement() {
        if (!this.element)
            throw new Error('Editor not mounted');
        return this.element;
    }
    /**
     * 获取编辑器状态
     */
    getState() {
        return {
            doc: this.document.toJSON(),
            selection: this.getSelection().toJSON(),
        };
    }
    /**
     * 分发事务
     */
    dispatch(tr) {
        // 更新文档
        this.document = new Document.Document(tr.doc, this.schema);
        // 更新选区
        if (tr.selection)
            this.setSelection(Selection.Selection.fromJSON(tr.selection));
        // 重新渲染
        this.render();
        // 触发更新事件
        this.emit('update', this.getState());
        this.options.onUpdate?.(this.getState());
        this.options.onChange?.(this.getHTML());
    }
    /**
     * 获取选区
     */
    getSelection() {
        return this.selectionManager.getSelection();
    }
    /**
     * 设置选区
     */
    setSelection(selection) {
        this.selectionManager.setSelection(selection);
    }
    /**
     * 保存当前 DOM 选区（仅当选区在编辑器内部时）
     */
    saveSelection() {
        if (!this.contentElement)
            return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return;
        const range = sel.getRangeAt(0);
        if (this.contentElement.contains(range.commonAncestorContainer)) {
            try {
                this.savedRange = range.cloneRange();
                logger.debug('DOM selection saved');
            }
            catch (e) {
                logger.warn('Failed to save selection:', e);
            }
        }
    }
    /**
     * 恢复先前保存的 DOM 选区
     * 返回是否恢复成功
     */
    restoreSelection() {
        if (!this.contentElement || !this.savedRange)
            return false;
        try {
            if (!this.contentElement.contains(this.savedRange.commonAncestorContainer))
                return false;
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(this.savedRange);
            logger.debug('DOM selection restored');
            return true;
        }
        catch (e) {
            logger.warn('Failed to restore selection:', e);
            return false;
        }
    }
    /**
     * 获取 HTML 内容
     */
    getHTML() {
        return this.document.toHTML();
    }
    /**
     * 获取选中的纯文本
     */
    getSelectedText() {
        if (!this.contentElement)
            return '';
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return '';
        const range = selection.getRangeAt(0);
        if (!this.contentElement.contains(range.commonAncestorContainer))
            return '';
        // 获取选中的纯文本
        return selection.toString();
    }
    /**
     * 设置 HTML 内容
     */
    setHTML(html) {
        this.document = new Document.Document(html, this.schema);
        this.render();
    }
    /**
     * 获取 JSON 内容
     */
    getJSON() {
        return this.document.toJSON();
    }
    /**
     * 设置 JSON 内容
     */
    setJSON(json) {
        this.document = Document.Document.fromJSON(json, this.schema);
        this.render();
    }
    /**
     * 插入 HTML 内容到当前光标位置
     */
    insertHTML(html) {
        if (!this.contentElement)
            return;
        const beforeLen = this.contentElement.innerHTML.length;
        logger.debug('insertHTML called. Before length:', beforeLen);
        logger.debug('html length:', html?.length);
        // 获取当前选区
        let selection = window.getSelection();
        logger.debug('Initial selection:', selection);
        if (!selection || selection.rangeCount === 0) {
            // 尝试恢复之前保存的选区
            const restored = this.restoreSelection();
            selection = window.getSelection();
            if (!restored || !selection || selection.rangeCount === 0) {
                // 如果没有选区，退化到在编辑器末尾插入
                logger.warn('No selection, creating range at end of editor');
                this.contentElement.focus();
                const range = document.createRange();
                range.selectNodeContents(this.contentElement);
                range.collapse(false);
                selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }
        let range = selection.getRangeAt(0);
        logger.debug('Range obtained. Collapsed:', range.collapsed);
        // 确保选区在编辑器内
        if (!this.contentElement.contains(range.commonAncestorContainer)) {
            logger.warn('Selection is not in editor; attempting to restore saved selection');
            const restored = this.restoreSelection();
            selection = window.getSelection();
            if (restored && selection && selection.rangeCount > 0 && this.contentElement.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                range = selection.getRangeAt(0);
            }
            else {
                logger.warn('Saved selection unavailable; moving caret to end');
                this.contentElement.focus();
                const newRange = document.createRange();
                newRange.selectNodeContents(this.contentElement);
                newRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(newRange);
                range = newRange;
            }
        }
        // 再次确保焦点在编辑器
        this.contentElement.focus();
        // 尝试使用 execCommand，如果失败或无效果则使用手动插入
        let success = false;
        try {
            success = document.execCommand('insertHTML', false, html);
            logger.debug('execCommand("insertHTML") returned:', success);
        }
        catch (err) {
            logger.warn('execCommand threw error, will use manual insertion:', err);
            success = false;
        }
        // 检测 execCommand 是否无效果（内容长度未变化）
        const afterLenCandidate = this.contentElement.innerHTML.length;
        const noChange = afterLenCandidate === beforeLen;
        if (!success || noChange) {
            if (success && noChange)
                logger.warn('execCommand reported success but content did not change, falling back to manual insertion');
            else
                logger.debug('Falling back to manual insertion');
            // 手动插入 HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            // 删除选中的内容
            try {
                range.deleteContents();
            }
            catch (err) {
                logger.warn('deleteContents error:', err);
            }
            // 插入新内容
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild)
                fragment.appendChild(tempDiv.firstChild);
            try {
                range.insertNode(fragment);
            }
            catch (err) {
                logger.error('insertNode error:', err);
            }
            // 移动光标到插入内容之后
            try {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            catch (err) {
                logger.warn('Reselection error:', err);
            }
        }
        const afterLen = this.contentElement.innerHTML.length;
        logger.debug('After length:', afterLen, 'Delta:', afterLen - beforeLen);
        // 简要诊断：统计媒体标签数量
        try {
            const snapshot = this.contentElement.innerHTML;
            const imgCount = (snapshot.match(/<img\b/gi) || []).length;
            const videoCount = (snapshot.match(/<video\b/gi) || []).length;
            const audioCount = (snapshot.match(/<audio\b/gi) || []).length;
            logger.debug('Media counts -> img:', imgCount, 'video:', videoCount, 'audio:', audioCount);
        }
        catch { }
        // 将插入位置滚动到可见区域
        try {
            const selNow = window.getSelection();
            const anchor = selNow?.anchorNode;
            let targetEl = null;
            if (anchor) {
                if (anchor.nodeType === 3)
                    targetEl = anchor.parentElement || null;
                else if (anchor.nodeType === 1)
                    targetEl = anchor;
                else
                    targetEl = anchor.parentElement || null;
            }
            // 优先滚动选区附近的元素，其次滚动到底部
            if (targetEl && this.contentElement?.contains(targetEl))
                targetEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
            else if (this.contentElement)
                this.contentElement.scrollTop = this.contentElement.scrollHeight;
        }
        catch (err) {
            logger.warn('scrollIntoView failed:', err);
        }
        // 触发更新事件
        this.handleInput();
    }
    /**
     * 清空内容
     */
    clear() {
        this.setHTML('<p></p>');
    }
    /**
     * 聚焦编辑器
     */
    focus() {
        this.contentElement?.focus();
    }
    /**
     * 失焦编辑器
     */
    blur() {
        this.contentElement?.blur();
    }
    /**
     * 设置是否可编辑
     */
    setEditable(editable) {
        this.editable = editable;
        if (this.contentElement)
            this.contentElement.contentEditable = String(editable);
    }
    /**
     * 检查是否可编辑
     */
    isEditable() {
        return this.editable;
    }
    /**
     * 扩展 Schema
     */
    extendSchema(spec) {
        // 合并节点
        if (spec.nodes) {
            Object.entries(spec.nodes).forEach(([name, nodeSpec]) => {
                this.schema.nodes.set(name, nodeSpec);
            });
        }
        // 合并标记
        if (spec.marks) {
            Object.entries(spec.marks).forEach(([name, markSpec]) => {
                this.schema.marks.set(name, markSpec);
            });
        }
    }
    /**
     * 事件系统
     */
    on(event, handler) {
        return this.eventEmitter.on(event, handler);
    }
    once(event, handler) {
        this.eventEmitter.once(event, handler);
    }
    off(event, handler) {
        this.eventEmitter.off(event, handler);
    }
    emit(event, ...args) {
        this.eventEmitter.emit(event, ...args);
    }
    /**
     * 销毁编辑器
     */
    destroy() {
        if (this.destroyed)
            return;
        // 清理插件
        this.plugins.clear();
        // 清理命令和快捷键
        this.commands.clear();
        this.keymap.clear();
        // 清理事件
        this.eventEmitter.clear();
        // 清理 DOM
        if (this.element)
            this.element.innerHTML = '';
        this.destroyed = true;
    }
    /**
     * 检查是否已销毁
     */
    isDestroyed() {
        return this.destroyed;
    }
}
// 版本信息
Editor.version = '1.3.0';

exports.Editor = Editor;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Editor.cjs.map
