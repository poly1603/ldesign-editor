/**
 * 配置标签页
 * 管理编辑器配置和调试选项
 */
import { createLogger } from '../../utils/logger';
const logger = createLogger('ConfigTab');
export class ConfigTab {
    constructor(options) {
        this.sections = [];
        this.searchQuery = '';
        this.editor = options.editor;
        this.initializeConfig();
    }
    /**
     * 初始化配置
     */
    initializeConfig() {
        this.sections = [
            {
                name: 'general',
                label: '常规设置',
                icon: '⚙️',
                items: [
                    {
                        key: 'editor.theme',
                        label: '主题',
                        type: 'select',
                        value: this.editor.options?.theme || 'light',
                        options: [
                            { label: '浅色', value: 'light' },
                            { label: '深色', value: 'dark' },
                            { label: '跟随系统', value: 'auto' },
                        ],
                        description: '编辑器主题外观',
                    },
                    {
                        key: 'editor.fontSize',
                        label: '字体大小',
                        type: 'number',
                        value: this.editor.options?.fontSize || 14,
                        min: 10,
                        max: 24,
                        step: 1,
                        description: '编辑器字体大小（像素）',
                    },
                    {
                        key: 'editor.fontFamily',
                        label: '字体',
                        type: 'string',
                        value: this.editor.options?.fontFamily || 'Consolas, monospace',
                        description: '编辑器字体系列',
                    },
                    {
                        key: 'editor.lineHeight',
                        label: '行高',
                        type: 'number',
                        value: this.editor.options?.lineHeight || 1.5,
                        min: 1,
                        max: 3,
                        step: 0.1,
                        description: '文本行高倍数',
                    },
                    {
                        key: 'editor.tabSize',
                        label: 'Tab 大小',
                        type: 'number',
                        value: this.editor.options?.tabSize || 2,
                        min: 2,
                        max: 8,
                        step: 2,
                        description: '一个 Tab 等于多少个空格',
                    },
                    {
                        key: 'editor.wordWrap',
                        label: '自动换行',
                        type: 'boolean',
                        value: this.editor.options?.wordWrap !== false,
                        description: '长行是否自动换行',
                    },
                ],
            },
            {
                name: 'performance',
                label: '性能优化',
                icon: '🚀',
                items: [
                    {
                        key: 'virtualScroll.enabled',
                        label: '虚拟滚动',
                        type: 'boolean',
                        value: this.editor.options?.virtualScroll?.enabled || false,
                        description: '启用虚拟滚动以处理大文档',
                    },
                    {
                        key: 'incrementalRender.enabled',
                        label: '增量渲染',
                        type: 'boolean',
                        value: this.editor.options?.incrementalRender?.enabled !== false,
                        description: '启用增量渲染优化',
                    },
                    {
                        key: 'wasm.enabled',
                        label: 'WebAssembly加速',
                        type: 'boolean',
                        value: this.editor.options?.wasm?.enabled !== false,
                        description: '使用WebAssembly加速核心算法',
                    },
                    {
                        key: 'cache.enabled',
                        label: '缓存',
                        type: 'boolean',
                        value: true,
                        description: '启用内容缓存',
                    },
                    {
                        key: 'lazyLoading.enabled',
                        label: '懒加载',
                        type: 'boolean',
                        value: true,
                        description: '延迟加载非关键资源',
                    },
                    {
                        key: 'performance.maxFPS',
                        label: '最大帧率',
                        type: 'number',
                        value: 60,
                        min: 30,
                        max: 144,
                        step: 30,
                        description: '渲染最大帧率限制',
                    },
                ],
            },
            {
                name: 'features',
                label: '功能开关',
                icon: '🎛️',
                items: [
                    {
                        key: 'ai.enabled',
                        label: 'AI助手',
                        type: 'boolean',
                        value: this.editor.options?.ai?.enabled !== false,
                        description: '启用AI智能助手功能',
                    },
                    {
                        key: 'collaboration.enabled',
                        label: '协作编辑',
                        type: 'boolean',
                        value: this.editor.options?.collaboration?.enabled || false,
                        description: '启用多人实时协作',
                    },
                    {
                        key: 'history.enabled',
                        label: '历史记录',
                        type: 'boolean',
                        value: true,
                        description: '启用编辑历史记录',
                    },
                    {
                        key: 'minimap.enabled',
                        label: '迷你地图',
                        type: 'boolean',
                        value: false,
                        description: '显示代码迷你地图',
                    },
                    {
                        key: 'breadcrumb.enabled',
                        label: '面包屑导航',
                        type: 'boolean',
                        value: true,
                        description: '显示文档结构导航',
                    },
                    {
                        key: 'autocomplete.enabled',
                        label: '自动补全',
                        type: 'boolean',
                        value: true,
                        description: '启用智能代码补全',
                    },
                ],
            },
            {
                name: 'debug',
                label: '调试选项',
                icon: '🐛',
                items: [
                    {
                        key: 'debug.logLevel',
                        label: '日志级别',
                        type: 'select',
                        value: 'info',
                        options: [
                            { label: '调试', value: 'debug' },
                            { label: '信息', value: 'info' },
                            { label: '警告', value: 'warn' },
                            { label: '错误', value: 'error' },
                        ],
                        description: '控制台日志输出级别',
                    },
                    {
                        key: 'debug.showPerformanceMetrics',
                        label: '性能指标',
                        type: 'boolean',
                        value: true,
                        description: '显示实时性能指标',
                    },
                    {
                        key: 'debug.showMemoryUsage',
                        label: '内存使用',
                        type: 'boolean',
                        value: true,
                        description: '显示内存使用情况',
                    },
                    {
                        key: 'debug.recordHistory',
                        label: '记录历史',
                        type: 'boolean',
                        value: true,
                        description: '记录所有操作历史',
                    },
                    {
                        key: 'debug.profileStartup',
                        label: '启动分析',
                        type: 'boolean',
                        value: false,
                        description: '分析启动性能',
                    },
                    {
                        key: 'debug.enableSourceMap',
                        label: 'Source Map',
                        type: 'boolean',
                        value: true,
                        description: '启用源码映射',
                    },
                ],
            },
            {
                name: 'experimental',
                label: '实验功能',
                icon: '🧪',
                items: [
                    {
                        key: 'experimental.newRenderer',
                        label: '新渲染引擎',
                        type: 'boolean',
                        value: false,
                        description: '尝试实验性的新渲染引擎',
                    },
                    {
                        key: 'experimental.offlineMode',
                        label: '离线模式',
                        type: 'boolean',
                        value: false,
                        description: '启用离线编辑支持',
                    },
                    {
                        key: 'experimental.voiceInput',
                        label: '语音输入',
                        type: 'boolean',
                        value: false,
                        description: '启用语音识别输入',
                    },
                    {
                        key: 'experimental.gestureControl',
                        label: '手势控制',
                        type: 'boolean',
                        value: false,
                        description: '启用手势控制功能',
                    },
                    {
                        key: 'experimental.aiCodeGen',
                        label: 'AI代码生成',
                        type: 'boolean',
                        value: false,
                        description: '启用AI代码生成功能',
                    },
                ],
            },
        ];
    }
    /**
     * 渲染标签页
     */
    render() {
        this.container = document.createElement('div');
        this.container.className = 'config-tab';
        this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
        // 工具栏
        const toolbar = this.createToolbar();
        // 设置容器
        this.settingsContainer = document.createElement('div');
        this.settingsContainer.className = 'settings-container';
        this.settingsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    `;
        this.container.appendChild(toolbar);
        this.container.appendChild(this.settingsContainer);
        // 渲染设置
        this.renderSettings();
        return this.container;
    }
    /**
     * 创建工具栏
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 15px;
      flex-shrink: 0;
    `;
        // 搜索框
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索设置...';
        searchInput.style.cssText = `
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      width: 300px;
    `;
        searchInput.oninput = (e) => {
            this.searchQuery = e.target.value;
            this.renderSettings();
        };
        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.style.cssText = `
      padding: 6px 12px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      margin-left: auto;
    `;
        resetBtn.innerHTML = '🔄 重置所有';
        resetBtn.onclick = () => this.resetAll();
        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.style.cssText = `${resetBtn.style.cssText}margin-left: 10px;`;
        exportBtn.innerHTML = '📤 导出配置';
        exportBtn.onclick = () => this.exportConfig();
        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.style.cssText = `${resetBtn.style.cssText}margin-left: 10px;`;
        importBtn.innerHTML = '📥 导入配置';
        importBtn.onclick = () => this.importConfig();
        toolbar.appendChild(searchInput);
        toolbar.appendChild(resetBtn);
        toolbar.appendChild(exportBtn);
        toolbar.appendChild(importBtn);
        return toolbar;
    }
    /**
     * 渲染设置
     */
    renderSettings() {
        if (!this.settingsContainer)
            return;
        this.settingsContainer.innerHTML = '';
        this.sections.forEach((section) => {
            const filteredItems = this.searchQuery
                ? section.items.filter(item => item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
                    || item.description?.toLowerCase().includes(this.searchQuery.toLowerCase()))
                : section.items;
            if (filteredItems.length === 0)
                return;
            const sectionElement = this.createSection(section, filteredItems);
            this.settingsContainer.appendChild(sectionElement);
        });
    }
    /**
     * 创建设置部分
     */
    createSection(section, items) {
        const container = document.createElement('div');
        container.className = 'config-section';
        container.style.cssText = `
      margin-bottom: 30px;
    `;
        // 标题
        const header = document.createElement('h3');
        header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
    `;
        header.innerHTML = `
      <span style="font-size: 20px;">${section.icon}</span>
      <span>${section.label}</span>
      <span style="
        background: #e0e0e0;
        color: #666;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 10px;
      ">${items.length}</span>
    `;
        // 设置项
        const itemsContainer = document.createElement('div');
        itemsContainer.style.cssText = `
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0;
      overflow: hidden;
    `;
        items.forEach((item, index) => {
            const itemElement = this.createConfigItem(item);
            if (index < items.length - 1)
                itemElement.style.borderBottom = '1px solid #f0f0f0';
            itemsContainer.appendChild(itemElement);
        });
        container.appendChild(header);
        container.appendChild(itemsContainer);
        return container;
    }
    /**
     * 创建配置项
     */
    createConfigItem(item) {
        const container = document.createElement('div');
        container.className = 'config-item';
        container.style.cssText = `
      display: flex;
      align-items: center;
      padding: 15px 20px;
      transition: background 0.2s;
    `;
        // 标签和描述
        const info = document.createElement('div');
        info.style.cssText = `
      flex: 1;
      margin-right: 20px;
    `;
        info.innerHTML = `
      <div style="font-size: 14px; font-weight: 500; color: #333; margin-bottom: 4px;">
        ${item.label}
      </div>
      ${item.description
            ? `
        <div style="font-size: 12px; color: #666;">
          ${item.description}
        </div>
      `
            : ''}
    `;
        // 控件
        const control = this.createControl(item);
        container.appendChild(info);
        container.appendChild(control);
        // 悬停效果
        container.onmouseenter = () => {
            container.style.background = '#f8f9fa';
        };
        container.onmouseleave = () => {
            container.style.background = 'transparent';
        };
        return container;
    }
    /**
     * 创建控件
     */
    createControl(item) {
        switch (item.type) {
            case 'boolean':
                return this.createToggle(item);
            case 'number':
                return this.createNumberInput(item);
            case 'string':
                return this.createTextInput(item);
            case 'select':
                return this.createSelect(item);
            case 'color':
                return this.createColorPicker(item);
            case 'json':
                return this.createJsonEditor(item);
            default:
                return document.createElement('div');
        }
    }
    /**
     * 创建开关
     */
    createToggle(item) {
        const container = document.createElement('label');
        container.style.cssText = `
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      cursor: pointer;
    `;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = item.value;
        input.style.cssText = `
      opacity: 0;
      width: 0;
      height: 0;
    `;
        const slider = document.createElement('span');
        slider.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${input.checked ? '#667eea' : '#ccc'};
      transition: 0.3s;
      border-radius: 24px;
    `;
        const handle = document.createElement('span');
        handle.style.cssText = `
      position: absolute;
      height: 18px;
      width: 18px;
      left: ${input.checked ? '23px' : '3px'};
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
        slider.appendChild(handle);
        input.onchange = () => {
            item.value = input.checked;
            slider.style.backgroundColor = input.checked ? '#667eea' : '#ccc';
            handle.style.left = input.checked ? '23px' : '3px';
            item.onChange?.(item.value);
            this.applyConfig(item.key, item.value);
        };
        container.appendChild(input);
        container.appendChild(slider);
        return container;
    }
    /**
     * 创建数字输入
     */
    createNumberInput(item) {
        const container = document.createElement('div');
        container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
        const input = document.createElement('input');
        input.type = 'number';
        input.value = String(item.value);
        input.min = String(item.min || 0);
        input.max = String(item.max || 100);
        input.step = String(item.step || 1);
        input.style.cssText = `
      width: 80px;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      text-align: center;
    `;
        const label = document.createElement('span');
        label.style.cssText = `
      font-size: 12px;
      color: #666;
    `;
        label.textContent = item.value;
        input.oninput = () => {
            const value = Number(input.value);
            item.value = value;
            label.textContent = String(value);
            item.onChange?.(value);
            this.applyConfig(item.key, value);
        };
        container.appendChild(input);
        container.appendChild(label);
        return container;
    }
    /**
     * 创建文本输入
     */
    createTextInput(item) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.value;
        input.style.cssText = `
      width: 200px;
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    `;
        input.oninput = () => {
            item.value = input.value;
            item.onChange?.(input.value);
            this.applyConfig(item.key, input.value);
        };
        return input;
    }
    /**
     * 创建下拉选择
     */
    createSelect(item) {
        const select = document.createElement('select');
        select.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      min-width: 120px;
    `;
        item.options?.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            optionElement.selected = option.value === item.value;
            select.appendChild(optionElement);
        });
        select.onchange = () => {
            item.value = select.value;
            item.onChange?.(select.value);
            this.applyConfig(item.key, select.value);
        };
        return select;
    }
    /**
     * 创建颜色选择器
     */
    createColorPicker(item) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = item.value;
        input.style.cssText = `
      width: 50px;
      height: 30px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    `;
        input.oninput = () => {
            item.value = input.value;
            item.onChange?.(input.value);
            this.applyConfig(item.key, input.value);
        };
        return input;
    }
    /**
     * 创建JSON编辑器
     */
    createJsonEditor(item) {
        const button = document.createElement('button');
        button.style.cssText = `
      padding: 4px 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
        button.textContent = '编辑 JSON';
        button.onclick = () => {
            const value = prompt('编辑 JSON:', JSON.stringify(item.value, null, 2));
            if (value) {
                try {
                    item.value = JSON.parse(value);
                    item.onChange?.(item.value);
                    this.applyConfig(item.key, item.value);
                    logger.info('JSON config updated');
                }
                catch (e) {
                    alert('无效的 JSON 格式');
                }
            }
        };
        return button;
    }
    /**
     * 应用配置
     */
    applyConfig(key, value) {
        logger.info(`Config updated: ${key} = ${value}`);
        // 更新编辑器配置
        const keys = key.split('.');
        let target = this.editor.options || {};
        for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]])
                target[keys[i]] = {};
            target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = value;
        // 触发配置更新事件
        this.editor.emit('config-change', { key, value });
    }
    /**
     * 重置所有配置
     */
    resetAll() {
        if (confirm('确定要重置所有配置为默认值吗？')) {
            this.sections.forEach((section) => {
                section.items.forEach((item) => {
                    if (item.defaultValue !== undefined) {
                        item.value = item.defaultValue;
                        this.applyConfig(item.key, item.value);
                    }
                });
            });
            this.renderSettings();
            logger.info('All settings reset to defaults');
        }
    }
    /**
     * 导出配置
     */
    exportConfig() {
        const config = {};
        this.sections.forEach((section) => {
            section.items.forEach((item) => {
                config[item.key] = item.value;
            });
        });
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'editor-config.json';
        a.click();
        URL.revokeObjectURL(url);
        logger.info('Config exported');
    }
    /**
     * 导入配置
     */
    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target?.result);
                    Object.entries(config).forEach(([key, value]) => {
                        this.sections.forEach((section) => {
                            const item = section.items.find(i => i.key === key);
                            if (item) {
                                item.value = value;
                                this.applyConfig(key, value);
                            }
                        });
                    });
                    this.renderSettings();
                    logger.info('Config imported successfully');
                }
                catch (err) {
                    alert('无效的配置文件');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    /**
     * 激活标签页
     */
    activate() {
        // 刷新配置
        this.initializeConfig();
        this.renderSettings();
    }
    /**
     * 停用标签页
     */
    deactivate() {
        // 标签页停用
    }
    /**
     * 销毁
     */
    destroy() {
        this.container = undefined;
    }
}
//# sourceMappingURL=ConfigTab.js.map