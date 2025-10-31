/**
 * 优化的工具栏配置系统
 * 支持按需加载、动态配置和自定义功能
 */
/**
 * 预设配置
 */
export const TOOLBAR_PRESETS = {
    minimal: {
        items: ['bold', 'italic', 'separator', 'undo', 'redo'],
        compact: true,
        showLabels: false,
    },
    standard: {
        items: [
            { id: 'format', items: ['bold', 'italic', 'underline', 'strike'] },
            'separator',
            { id: 'paragraph', items: ['heading', 'bulletList', 'orderedList'] },
            'separator',
            { id: 'insert', items: ['link', 'image', 'table'] },
            'separator',
            'undo',
            'redo',
        ],
        showTooltips: true,
    },
    full: {
        items: [
            { id: 'file', items: ['new', 'open', 'save'] },
            'separator',
            { id: 'format', items: ['bold', 'italic', 'underline', 'strike', 'code', 'clear'] },
            'separator',
            { id: 'paragraph', items: ['heading', 'paragraph', 'bulletList', 'orderedList', 'taskList'] },
            'separator',
            { id: 'align', items: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] },
            'separator',
            { id: 'insert', items: ['link', 'image', 'video', 'table', 'horizontalRule'] },
            'separator',
            { id: 'tools', items: ['findReplace', 'spellCheck', 'wordCount'] },
            'separator',
            'undo',
            'redo',
            'separator',
            'fullscreen',
        ],
        showLabels: true,
        showTooltips: true,
        virtualScroll: true,
    },
};
/**
 * 默认工具栏项配置
 */
export const DEFAULT_ITEMS = {
    bold: {
        id: 'bold',
        icon: 'bold',
        tooltip: 'Bold (Ctrl+B)',
        shortcut: 'Ctrl+B',
        action: editor => editor.commands.execute('bold'),
    },
    italic: {
        id: 'italic',
        icon: 'italic',
        tooltip: 'Italic (Ctrl+I)',
        shortcut: 'Ctrl+I',
        action: editor => editor.commands.execute('italic'),
    },
    underline: {
        id: 'underline',
        icon: 'underline',
        tooltip: 'Underline (Ctrl+U)',
        shortcut: 'Ctrl+U',
        action: editor => editor.commands.execute('underline'),
    },
    strike: {
        id: 'strike',
        icon: 'strikethrough',
        tooltip: 'Strikethrough',
        action: editor => editor.commands.execute('strike'),
    },
    heading: {
        id: 'heading',
        type: 'dropdown',
        icon: 'heading',
        tooltip: 'Heading',
        items: [
            { value: 'h1', label: 'Heading 1', action: e => e.commands.execute('heading', { level: 1 }) },
            { value: 'h2', label: 'Heading 2', action: e => e.commands.execute('heading', { level: 2 }) },
            { value: 'h3', label: 'Heading 3', action: e => e.commands.execute('heading', { level: 3 }) },
            { value: 'h4', label: 'Heading 4', action: e => e.commands.execute('heading', { level: 4 }) },
            { value: 'h5', label: 'Heading 5', action: e => e.commands.execute('heading', { level: 5 }) },
            { value: 'h6', label: 'Heading 6', action: e => e.commands.execute('heading', { level: 6 }) },
        ],
    },
    undo: {
        id: 'undo',
        icon: 'undo',
        tooltip: 'Undo (Ctrl+Z)',
        shortcut: 'Ctrl+Z',
        action: editor => editor.commands.execute('undo'),
    },
    redo: {
        id: 'redo',
        icon: 'redo',
        tooltip: 'Redo (Ctrl+Y)',
        shortcut: 'Ctrl+Y',
        action: editor => editor.commands.execute('redo'),
    },
};
//# sourceMappingURL=ToolbarConfig.js.map