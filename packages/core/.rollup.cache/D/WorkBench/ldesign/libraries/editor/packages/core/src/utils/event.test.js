/**
 * event工具函数单元测试
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delegate, EventEmitter, on, once, trigger, } from './event';
describe('eventEmitter', () => {
    let emitter;
    beforeEach(() => {
        emitter = new EventEmitter();
    });
    describe('on', () => {
        it('应该注册事件处理器', () => {
            const handler = vi.fn();
            emitter.on('test', handler);
            emitter.emit('test', 'data');
            expect(handler).toHaveBeenCalledWith('data');
            expect(handler).toHaveBeenCalledTimes(1);
        });
        it('应该返回取消订阅函数', () => {
            const handler = vi.fn();
            const unsubscribe = emitter.on('test', handler);
            emitter.emit('test');
            expect(handler).toHaveBeenCalledTimes(1);
            unsubscribe();
            emitter.emit('test');
            expect(handler).toHaveBeenCalledTimes(1);
        });
        it('应该支持多个处理器', () => {
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            emitter.on('test', handler1);
            emitter.on('test', handler2);
            emitter.emit('test');
            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);
        });
    });
    describe('once', () => {
        it('应该只执行一次', () => {
            const handler = vi.fn();
            emitter.once('test', handler);
            emitter.emit('test');
            emitter.emit('test');
            emitter.emit('test');
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });
    describe('off', () => {
        it('应该移除事件处理器', () => {
            const handler = vi.fn();
            emitter.on('test', handler);
            emitter.emit('test');
            expect(handler).toHaveBeenCalledTimes(1);
            emitter.off('test', handler);
            emitter.emit('test');
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });
    describe('emit', () => {
        it('应该传递参数', () => {
            const handler = vi.fn();
            emitter.on('test', handler);
            emitter.emit('test', 'arg1', 'arg2', 'arg3');
            expect(handler).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
        });
        it('应该捕获处理器错误', () => {
            const errorHandler = vi.fn(() => {
                throw new Error('Handler error');
            });
            const normalHandler = vi.fn();
            emitter.on('test', errorHandler);
            emitter.on('test', normalHandler);
            // 不应该抛出错误
            expect(() => emitter.emit('test')).not.toThrow();
            // 其他处理器应该继续执行
            expect(normalHandler).toHaveBeenCalled();
        });
    });
    describe('clear', () => {
        it('应该清除指定事件的所有处理器', () => {
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            const handler3 = vi.fn();
            emitter.on('event1', handler1);
            emitter.on('event1', handler2);
            emitter.on('event2', handler3);
            emitter.clear('event1');
            emitter.emit('event1');
            emitter.emit('event2');
            expect(handler1).not.toHaveBeenCalled();
            expect(handler2).not.toHaveBeenCalled();
            expect(handler3).toHaveBeenCalled();
        });
        it('应该清除所有事件', () => {
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            emitter.on('event1', handler1);
            emitter.on('event2', handler2);
            emitter.clear();
            emitter.emit('event1');
            emitter.emit('event2');
            expect(handler1).not.toHaveBeenCalled();
            expect(handler2).not.toHaveBeenCalled();
        });
    });
    describe('listenerCount', () => {
        it('应该返回正确的监听器数量', () => {
            expect(emitter.listenerCount('test')).toBe(0);
            emitter.on('test', () => { });
            expect(emitter.listenerCount('test')).toBe(1);
            emitter.on('test', () => { });
            expect(emitter.listenerCount('test')).toBe(2);
        });
    });
});
describe('dOM事件工具', () => {
    let element;
    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });
    afterEach(() => {
        element.remove();
    });
    describe('on', () => {
        it('应该绑定事件', () => {
            const handler = vi.fn();
            const off = on(element, 'click', handler);
            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
            off();
            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
        });
        it('应该支持preventDefault选项', () => {
            const event = new Event('click', { cancelable: true });
            const handler = vi.fn();
            on(element, 'click', handler, { preventDefault: true });
            element.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });
    });
    describe('once', () => {
        it('应该只触发一次', () => {
            const handler = vi.fn();
            once(element, 'click', handler);
            element.click();
            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });
    describe('trigger', () => {
        it('应该触发自定义事件', () => {
            const handler = vi.fn();
            element.addEventListener('custom', handler);
            trigger(element, 'custom', { data: 'test' });
            expect(handler).toHaveBeenCalled();
            const event = handler.mock.calls[0][0];
            expect(event.detail).toEqual({ data: 'test' });
        });
    });
    describe('delegate', () => {
        it('应该支持事件委托', () => {
            const handler = vi.fn();
            const child = document.createElement('button');
            child.className = 'target';
            element.appendChild(child);
            delegate(element, '.target', 'click', handler);
            child.click();
            expect(handler).toHaveBeenCalled();
        });
    });
});
describe('工具函数', () => {
    describe('deepClone', () => {
        it('应该克隆基本类型', () => {
            expect(deepClone(null)).toBe(null);
            expect(deepClone(undefined)).toBe(undefined);
            expect(deepClone(42)).toBe(42);
            expect(deepClone('text')).toBe('text');
            expect(deepClone(true)).toBe(true);
        });
        it('应该克隆日期对象', () => {
            const date = new Date('2025-01-01');
            const cloned = deepClone(date);
            expect(cloned).toEqual(date);
            expect(cloned).not.toBe(date);
        });
        it('应该处理循环引用', () => {
            const obj = { a: 1 };
            obj.self = obj;
            const cloned = deepClone(obj);
            expect(cloned.a).toBe(1);
            expect(cloned.self).toBe(cloned);
        });
    });
    describe('deepMerge', () => {
        it('应该合并嵌套对象', () => {
            const result = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
            expect(result).toEqual({
                a: 1,
                b: { c: 2, d: 3 },
                e: 4,
            });
        });
    });
    describe('generateId', () => {
        it('应该生成字符串ID', () => {
            const id = generateId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(0);
        });
        it('应该生成不同的ID', () => {
            const ids = new Set();
            for (let i = 0; i < 100; i++)
                ids.add(generateId());
            expect(ids.size).toBe(100);
        });
    });
    describe('clamp', () => {
        it('应该在范围内时返回原值', () => {
            expect(clamp(5, 0, 10)).toBe(5);
        });
        it('应该限制最小值', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
        });
        it('应该限制最大值', () => {
            expect(clamp(15, 0, 10)).toBe(10);
        });
    });
    describe('isEmpty', () => {
        it('应该检测空值', () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(true);
            expect(isEmpty('')).toBe(true);
            expect(isEmpty([])).toBe(true);
            expect(isEmpty({})).toBe(true);
        });
        it('应该检测非空值', () => {
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(false)).toBe(false);
            expect(isEmpty('text')).toBe(false);
            expect(isEmpty([1])).toBe(false);
            expect(isEmpty({ a: 1 })).toBe(false);
        });
    });
    describe('formatFileSize', () => {
        it('应该格式化字节', () => {
            expect(formatFileSize(0)).toBe('0 B');
            expect(formatFileSize(500)).toBe('500 B');
        });
        it('应该格式化KB', () => {
            expect(formatFileSize(1024)).toBe('1.00 KB');
            expect(formatFileSize(1536)).toBe('1.50 KB');
        });
        it('应该格式化MB', () => {
            expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
            expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.50 MB');
        });
        it('应该格式化GB', () => {
            expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB');
        });
    });
    describe('formatDuration', () => {
        it('应该格式化毫秒', () => {
            expect(formatDuration(100)).toBe('100ms');
            expect(formatDuration(999)).toBe('999ms');
        });
        it('应该格式化秒', () => {
            expect(formatDuration(1000)).toBe('1.00s');
            expect(formatDuration(1500)).toBe('1.50s');
        });
        it('应该格式化分钟', () => {
            expect(formatDuration(60000)).toBe('1.00m');
            expect(formatDuration(90000)).toBe('1.50m');
        });
    });
});
//# sourceMappingURL=event.test.js.map