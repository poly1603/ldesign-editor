/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var event = require('../utils/event.cjs');
var logger$1 = require('../utils/logger.cjs');

const logger = logger$1.createLogger("InstallPromptManager");
class InstallPromptManager extends event.EventEmitter {
  constructor(config) {
    super();
    this.installed = false;
    this.config = config;
    this.checkInstallStatus();
  }
  /**
   * 初始化
   */
  async initialize() {
    logger.info("Initializing install prompt manager");
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      logger.info("Install prompt available");
      this.emit("prompt-available");
      if (this.config.installPrompt) {
        setTimeout(() => {
          this.show();
        }, 3e3);
      }
    });
    window.addEventListener("appinstalled", () => {
      logger.info("App installed");
      this.installed = true;
      this.deferredPrompt = null;
      this.emit("installed");
    });
    logger.info("Install prompt manager initialized");
  }
  /**
   * 检查安装状态
   */
  checkInstallStatus() {
    this.installed = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (this.installed)
      logger.info("App is already installed");
  }
  /**
   * 显示安装提示
   */
  async show() {
    if (!this.deferredPrompt) {
      logger.warn("Install prompt not available");
      return false;
    }
    if (this.installed) {
      logger.info("App already installed");
      return false;
    }
    try {
      this.deferredPrompt.prompt();
      this.emit("prompt-shown");
      const result = await this.deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        logger.info("User accepted install prompt");
        return true;
      } else {
        logger.info("User dismissed install prompt");
        this.emit("dismissed");
        return false;
      }
    } catch (error) {
      logger.error("Failed to show install prompt:", error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }
  /**
   * 是否可以显示提示
   */
  canShowPrompt() {
    return !!this.deferredPrompt && !this.installed;
  }
  /**
   * 是否已安装
   */
  isInstalled() {
    return this.installed;
  }
  /**
   * 销毁
   */
  destroy() {
    this.deferredPrompt = null;
    this.removeAllListeners();
  }
}

exports.InstallPromptManager = InstallPromptManager;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=InstallPromptManager.cjs.map
