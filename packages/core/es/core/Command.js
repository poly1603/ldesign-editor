/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createLogger } from '../utils/logger.js';
import { History } from './History.js';

const logger = createLogger("CommandManager");
class CommandManager {
  constructor(editor) {
    this.commands = /* @__PURE__ */ new Map();
    this.editor = editor;
    this.history = new History(editor);
    logger.debug("CommandManager initialized");
  }
  /**
   * 撤销
   */
  undo() {
    const result = this.history.undo();
    if (result)
      this.editor.emit("content-change");
    return result;
  }
  /**
   * 重做
   */
  redo() {
    const result = this.history.redo();
    if (result)
      this.editor.emit("content-change");
    return result;
  }
  /**
   * 检查是否可以撤销
   */
  canUndo() {
    return this.history.canUndo();
  }
  /**
   * 检查是否可以重做
   */
  canRedo() {
    return this.history.canRedo();
  }
  /**
   * 注册命令
   */
  register(name, command) {
    this.commands.set(name, command);
  }
  /**
   * 执行命令
   */
  execute(name, ...args) {
    logger.debug(`Executing command: "${name}" with args:`, args);
    const command = this.commands.get(name);
    if (!command) {
      logger.warn(`Command "${name}" not found`);
      logger.debug("Available commands:", Array.from(this.commands.keys()));
      return false;
    }
    const state = this.editor.getState();
    logger.debug("State:", state);
    logger.debug("Calling command function");
    const result = command(state, this.editor.dispatch.bind(this.editor), ...args);
    logger.debug("Command returned:", result);
    return result;
  }
  /**
   * 检查命令是否可用
   */
  canExecute(name) {
    const command = this.commands.get(name);
    if (!command)
      return false;
    const state = this.editor.getState();
    return command(state);
  }
  /**
   * 获取命令
   */
  get(name) {
    return this.commands.get(name);
  }
  /**
   * 检查命令是否存在
   */
  has(name) {
    return this.commands.has(name);
  }
  /**
   * 获取所有命令
   */
  getCommands() {
    return Array.from(this.commands.keys());
  }
  /**
   * 移除命令
   */
  unregister(name) {
    this.commands.delete(name);
  }
  /**
   * 清除所有命令
   */
  clear() {
    this.commands.clear();
  }
}
class KeymapManager {
  constructor(editor) {
    this.keymap = /* @__PURE__ */ new Map();
    this.editor = editor;
  }
  /**
   * 注册快捷键
   * 支持两种形式：
   * - register('Mod-B', command)
   * - register({ key: 'Ctrl+Z', command: 'undo' | Command })
   */
  register(keys, command) {
    if (typeof keys === "string") {
      if (!command)
        return;
      this.keymap.set(this.normalizeKey(keys), command);
      return;
    }
    const keyStr = keys.key;
    const cmdOrName = keys.command;
    const handler = (state, dispatch) => {
      if (typeof cmdOrName === "string")
        return this.editor.commands.execute(cmdOrName);
      return cmdOrName(state, dispatch);
    };
    this.keymap.set(this.normalizeKey(keyStr), handler);
  }
  /**
   * 处理键盘事件
   */
  handleKeyDown(event) {
    const key = this.eventToKey(event);
    const command = this.keymap.get(key);
    if (command) {
      const state = this.editor.getState();
      const result = command(state, this.editor.dispatch.bind(this.editor));
      if (result) {
        event.preventDefault();
        return true;
      }
    }
    return false;
  }
  /**
   * 事件转快捷键字符串
   */
  eventToKey(event) {
    const parts = [];
    if (event.ctrlKey || event.metaKey)
      parts.push("Mod");
    if (event.altKey)
      parts.push("Alt");
    if (event.shiftKey)
      parts.push("Shift");
    const key = event.key;
    if (key.length === 1)
      parts.push(key.toUpperCase());
    else
      parts.push(key);
    return parts.join("-");
  }
  /**
   * 规范化快捷键
   */
  normalizeKey(key) {
    return key.split(/[-+]/).map((part) => {
      if (part === "Ctrl" || part === "Cmd" || part === "Command" || part === "Meta")
        return "Mod";
      if (part === "Option")
        return "Alt";
      return part;
    }).join("-");
  }
  /**
   * 移除快捷键
   */
  unregister(keys) {
    this.keymap.delete(this.normalizeKey(keys));
  }
  /**
   * 清除所有快捷键
   */
  clear() {
    this.keymap.clear();
  }
}

export { CommandManager, KeymapManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=Command.js.map
