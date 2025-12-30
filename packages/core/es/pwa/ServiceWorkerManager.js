/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../utils/event.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger("ServiceWorkerManager");
class ServiceWorkerManager extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.setupEventListeners();
  }
  /**
   * 注册Service Worker
   */
  async register() {
    if (!("serviceWorker" in navigator))
      throw new Error("Service Worker not supported");
    try {
      logger.info("Registering service worker");
      const swUrl = this.getServiceWorkerURL();
      this.registration = await navigator.serviceWorker.register(swUrl, {
        scope: this.config.scope || "/"
      });
      logger.info("Service worker registered successfully");
      this.watchServiceWorker();
      return this.registration;
    } catch (error) {
      logger.error("Failed to register service worker:", error);
      throw error;
    }
  }
  /**
   * 获取Service Worker URL
   */
  getServiceWorkerURL() {
    return "/sw.js";
  }
  /**
   * 设置事件监听
   */
  setupEventListeners() {
    window.addEventListener("online", () => {
      logger.info("Application is online");
      this.emit("online");
    });
    window.addEventListener("offline", () => {
      logger.info("Application is offline");
      this.emit("offline");
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        this.handleMessage(event.data);
      });
    }
  }
  /**
   * 监听Service Worker
   */
  watchServiceWorker() {
    if (!this.registration)
      return;
    this.registration.addEventListener("updatefound", () => {
      logger.info("Service worker update found");
      const newWorker = this.registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            logger.info("New service worker installed");
            this.emit("update-available");
          }
          if (newWorker.state === "activated") {
            logger.info("New service worker activated");
            this.emit("update-activated");
          }
        });
      }
    });
    if (this.registration.waiting)
      this.emit("update-available");
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      logger.info("Service worker controller changed");
      this.emit("controller-change");
    });
  }
  /**
   * 处理Service Worker消息
   */
  handleMessage(message) {
    logger.debug("Received message from service worker:", message);
    switch (message.type) {
      case "CACHE_UPDATED":
        this.emit("cache-updated", message.payload);
        break;
      case "SYNC_COMPLETE":
        this.emit("sync-complete", message.payload);
        break;
      case "NOTIFICATION":
        this.emit("notification", message.payload);
        break;
      default:
        logger.debug("Unknown message type:", message.type);
    }
  }
  /**
   * 检查更新
   */
  async checkForUpdates() {
    if (!this.registration) {
      logger.warn("No service worker registration");
      return false;
    }
    try {
      await this.registration.update();
      return !!this.registration.waiting;
    } catch (error) {
      logger.error("Failed to check for updates:", error);
      return false;
    }
  }
  /**
   * 应用更新
   */
  async update() {
    if (!this.registration?.waiting) {
      logger.warn("No waiting service worker");
      return;
    }
    this.registration.waiting.postMessage({
      type: "SKIP_WAITING"
    });
    await new Promise((resolve) => {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        resolve();
      }, {
        once: true
      });
    });
    this.emit("update-installed");
  }
  /**
   * 跳过等待
   */
  async skipWaiting() {
    if (!this.registration?.waiting)
      return;
    this.registration.waiting.postMessage({
      type: "SKIP_WAITING"
    });
  }
  /**
   * 发送消息给Service Worker
   */
  async postMessage(message) {
    if (!navigator.serviceWorker.controller) {
      logger.warn("No service worker controller");
      return;
    }
    navigator.serviceWorker.controller.postMessage(message);
  }
  /**
   * 获取状态
   */
  async getStatus() {
    if (!this.registration) {
      return {
        state: "redundant",
        updateAvailable: false
      };
    }
    const sw = this.registration.active || this.registration.installing || this.registration.waiting;
    return {
      state: sw?.state || "redundant",
      scriptURL: sw?.scriptURL,
      scope: this.registration.scope,
      updateAvailable: !!this.registration.waiting
    };
  }
  /**
   * 注销Service Worker
   */
  async unregister() {
    if (!this.registration)
      return false;
    try {
      const result = await this.registration.unregister();
      logger.info("Service worker unregistered");
      this.registration = void 0;
      return result;
    } catch (error) {
      logger.error("Failed to unregister service worker:", error);
      return false;
    }
  }
  /**
   * 销毁
   */
  destroy() {
    if (this.updateCheckTimer)
      clearInterval(this.updateCheckTimer);
    this.removeAllListeners();
  }
}

export { ServiceWorkerManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ServiceWorkerManager.js.map
