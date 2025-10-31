/**
 * Plugin插件系统单元测试
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlugin, PluginManager } from './Plugin';
// 模拟编辑器实例
function createMockEditor() {
    return {
        commands: {
            register: vi.fn(),
            execute: vi.fn(),
            get: vi.fn(),
            has: vi.fn(),
            getCommands: vi.fn(() => []),
            unregister: vi.fn(),
            clear: vi.fn(),
        },
        keymap: {
            register: vi.fn(),
            handleKeyDown: vi.fn(),
            unregister: vi.fn(),
            clear: vi.fn(),
        },
        plugins: {
            register: vi.fn(),
            get: vi.fn(),
            getAll: vi.fn(() => []),
            has: vi.fn(),
            unregister: vi.fn(),
            clear: vi.fn(),
        },
        options: {},
        contentElement: document.createElement('div'),
        getState: vi.fn(),
        dispatch: vi.fn(),
        getHTML: vi.fn(() => ''),
        setHTML: vi.fn(),
        getSelectedText: vi.fn(() => ''),
        insertHTML: vi.fn(),
        focus: vi.fn(),
        blur: vi.fn(),
        clear: vi.fn(),
        saveSelection: vi.fn(),
        restoreSelection: vi.fn(() => true),
        on: vi.fn(() => () => { }),
        emit: vi.fn(),
        destroy: vi.fn(),
        isDestroyed: vi.fn(() => false),
        isEditable: vi.fn(() => true),
        setEditable: vi.fn(),
    };
}
describe('plugin', () => {
    describe('pluginManager', () => {
        let editor;
        let manager;
        beforeEach(() => {
            editor = createMockEditor();
            manager = new PluginManager(editor);
        });
        it('应该创建管理器实例', () => {
            expect(manager).toBeDefined();
        });
        it('应该注册插件', () => {
            const plugin = createPlugin({
                name: 'test-plugin',
                commands: {
                    testCommand: () => true,
                },
            });
            manager.register(plugin);
            expect(manager.has('test-plugin')).toBe(true);
            expect(editor.commands.register).toHaveBeenCalled();
        });
        it('应该获取插件', () => {
            const plugin = createPlugin({
                name: 'test-plugin',
            });
            manager.register(plugin);
            const retrieved = manager.get('test-plugin');
            expect(retrieved).toBe(plugin);
        });
        it('应该获取所有插件', () => {
            const plugin1 = createPlugin({ name: 'plugin1' });
            const plugin2 = createPlugin({ name: 'plugin2' });
            manager.register(plugin1);
            manager.register(plugin2);
            const all = manager.getAll();
            expect(all).toHaveLength(2);
        });
        it('应该注销插件', () => {
            const plugin = createPlugin({
                name: 'test-plugin',
                destroy: vi.fn(),
            });
            manager.register(plugin);
            expect(manager.has('test-plugin')).toBe(true);
            manager.unregister('test-plugin');
            expect(manager.has('test-plugin')).toBe(false);
            expect(plugin.destroy).toHaveBeenCalled();
        });
        it('应该清除所有插件', () => {
            const plugin1 = createPlugin({ name: 'plugin1', destroy: vi.fn() });
            const plugin2 = createPlugin({ name: 'plugin2', destroy: vi.fn() });
            manager.register(plugin1);
            manager.register(plugin2);
            manager.clear();
            expect(manager.getAll()).toHaveLength(0);
            expect(plugin1.destroy).toHaveBeenCalled();
            expect(plugin2.destroy).toHaveBeenCalled();
        });
        it('不应该重复注册插件', () => {
            const plugin = createPlugin({ name: 'test-plugin' });
            manager.register(plugin);
            manager.register(plugin);
            expect(manager.getAll()).toHaveLength(1);
        });
    });
    describe('createPlugin', () => {
        let editor;
        beforeEach(() => {
            editor = createMockEditor();
        });
        it('应该创建插件实例', () => {
            const plugin = createPlugin({
                name: 'test-plugin',
            });
            expect(plugin).toBeDefined();
            expect(plugin.name).toBe('test-plugin');
        });
        it('应该注册命令', () => {
            const testCommand = vi.fn(() => true);
            const plugin = createPlugin({
                name: 'test-plugin',
                commands: {
                    testCommand,
                },
            });
            plugin.install(editor);
            expect(editor.commands.register).toHaveBeenCalledWith('testCommand', testCommand);
        });
        it('应该注册快捷键', () => {
            const testCommand = vi.fn(() => true);
            const plugin = createPlugin({
                name: 'test-plugin',
                keys: {
                    'Mod-b': testCommand,
                },
            });
            plugin.install(editor);
            expect(editor.keymap.register).toHaveBeenCalledWith('Mod-b', testCommand);
        });
        it('应该调用init钩子', () => {
            const init = vi.fn();
            const plugin = createPlugin({
                name: 'test-plugin',
                init,
            });
            plugin.install(editor);
            expect(init).toHaveBeenCalledWith(editor);
        });
        it('应该调用destroy钩子', () => {
            const destroy = vi.fn();
            const plugin = createPlugin({
                name: 'test-plugin',
                destroy,
            });
            plugin.destroy();
            expect(destroy).toHaveBeenCalled();
        });
        it('应该处理异步init钩子', async () => {
            const init = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
            });
            const plugin = createPlugin({
                name: 'test-plugin',
                init,
            });
            plugin.install(editor);
            expect(init).toHaveBeenCalled();
            await new Promise(resolve => setTimeout(resolve, 20));
        });
        it('应该捕获init错误', async () => {
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const init = vi.fn(async () => {
                throw new Error('Init failed');
            });
            const plugin = createPlugin({
                name: 'test-plugin',
                init,
            });
            plugin.install(editor);
            await new Promise(resolve => setTimeout(resolve, 20));
            errorSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=Plugin.test.js.map