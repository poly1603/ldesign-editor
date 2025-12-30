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

var helpers = require('../utils/helpers.cjs');
var logger$1 = require('../utils/logger.cjs');
var ContextMenu = require('./components/ContextMenu.cjs');
var MobileToolbar = require('./components/MobileToolbar.cjs');
var SwipeMenu = require('./components/SwipeMenu.cjs');
var GestureRecognizer = require('./gestures/GestureRecognizer.cjs');

const logger = logger$1.createLogger("MobileEditorAdapter");
class MobileEditorAdapter {
  constructor(editor, options = {}) {
    this.currentZoom = 1;
    this.currentPanX = 0;
    this.currentPanY = 0;
    this.isPinching = false;
    this.isPanning = false;
    this.metrics = this.calculateMetrics();
    this.editor = editor;
    this.options = {
      enableGestures: true,
      enableSwipeMenu: true,
      enableContextMenu: true,
      enableMobileToolbar: true,
      minZoom: 0.5,
      maxZoom: 3,
      initialZoom: 1,
      enableMomentum: true,
      enableBounce: true,
      ...options
    };
    this.editorContainer = editor.getElement();
    this.contentWrapper = this.createContentWrapper();
    this.initialize();
  }
  /**
   * 初始化移动端适配
   */
  initialize() {
    logger.info("Initializing mobile editor adapter");
    this.setupViewport();
    this.applyMobileStyles();
    if (this.options.enableGestures)
      this.initializeGestures();
    if (this.options.enableSwipeMenu)
      this.initializeSwipeMenu();
    if (this.options.enableContextMenu)
      this.initializeContextMenu();
    if (this.options.enableMobileToolbar)
      this.initializeMobileToolbar();
    this.setupOrientationListener();
    this.setupKeyboardListener();
  }
  /**
   * 创建内容包装器
   */
  createContentWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "mobile-content-wrapper";
    wrapper.style.cssText = `
      width: 100%;
      height: 100%;
      transform-origin: 0 0;
      transition: transform 0.2s ease-out;
      will-change: transform;
    `;
    while (this.editorContainer.firstChild)
      wrapper.appendChild(this.editorContainer.firstChild);
    this.editorContainer.appendChild(wrapper);
    return wrapper;
  }
  /**
   * 设置viewport
   */
  setupViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }
    viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover";
    this.viewportMeta = viewport;
  }
  /**
   * 应用移动端样式
   */
  applyMobileStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .mobile-editor {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        touch-action: none;
      }
      
      .mobile-editor.pinching {
        touch-action: pinch-zoom;
      }
      
      .mobile-editor.panning {
        touch-action: pan-x pan-y;
      }
      
      .mobile-content-wrapper {
        position: relative;
      }
      
      .mobile-toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e0e0e0;
        z-index: 1000;
        transform: translateY(0);
        transition: transform 0.3s ease-out;
      }
      
      .mobile-toolbar.hidden {
        transform: translateY(100%);
      }
      
      .swipe-menu {
        position: fixed;
        top: 0;
        left: -80%;
        width: 80%;
        height: 100%;
        background: white;
        box-shadow: 2px 0 8px rgba(0,0,0,0.15);
        z-index: 999;
        transition: transform 0.3s ease-out;
      }
      
      .swipe-menu.open {
        transform: translateX(100%);
      }
      
      .context-menu {
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        padding: 8px 0;
        z-index: 1001;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.2s, transform 0.2s;
      }
      
      .context-menu.visible {
        opacity: 1;
        transform: scale(1);
      }
      
      @media (max-width: 768px) {
        .ldesign-toolbar {
          display: none;
        }
        
        .ldesign-editor-content {
          font-size: 16px;
          padding: 10px;
        }
      }
      
      @supports (padding: env(safe-area-inset-bottom)) {
        .mobile-toolbar {
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `;
    document.head.appendChild(style);
    this.editorContainer.classList.add("mobile-editor");
  }
  /**
   * 初始化手势识别
   */
  initializeGestures() {
    this.gestureRecognizer = new GestureRecognizer.GestureRecognizer(this.editorContainer, {
      longPressThreshold: 500,
      doubleTapInterval: 300,
      swipeThreshold: 30,
      preventDefault: false
    });
    this.gestureRecognizer.on("pinchstart", () => {
      this.isPinching = true;
      this.editorContainer.classList.add("pinching");
    });
    this.gestureRecognizer.on("pinch", (e) => {
      this.handlePinch(e);
    });
    this.gestureRecognizer.on("pinchend", () => {
      this.isPinching = false;
      this.editorContainer.classList.remove("pinching");
    });
    this.gestureRecognizer.on("doubletap", (e) => {
      this.handleDoubleTap(e);
    });
    this.gestureRecognizer.on("pan", (e) => {
      if (!this.isPinching)
        this.handlePan(e);
    });
    this.gestureRecognizer.on("swipeleft", () => {
      if (this.swipeMenu?.isOpen())
        this.swipeMenu.close();
    });
    this.gestureRecognizer.on("swiperight", () => {
      if (this.currentPanX === 0 && !this.swipeMenu?.isOpen())
        this.swipeMenu?.open();
    });
    this.gestureRecognizer.on("longpress", (e) => {
      this.handleLongPress(e);
    });
  }
  /**
   * 处理双指缩放
   */
  handlePinch(e) {
    const newZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, this.currentZoom * e.scale));
    if (newZoom !== this.currentZoom) {
      const rect = this.editorContainer.getBoundingClientRect();
      const centerX = e.center.x - rect.left;
      const centerY = e.center.y - rect.top;
      const scaleDiff = newZoom - this.currentZoom;
      this.currentPanX -= centerX * scaleDiff;
      this.currentPanY -= centerY * scaleDiff;
      this.currentZoom = newZoom;
      this.updateTransform();
    }
  }
  /**
   * 处理双击缩放
   */
  handleDoubleTap(e) {
    if (this.currentZoom > 1.01) {
      this.animateZoom(1, 0, 0);
    } else {
      const rect = this.editorContainer.getBoundingClientRect();
      const centerX = e.center.x - rect.left;
      const centerY = e.center.y - rect.top;
      const targetPanX = -centerX;
      const targetPanY = -centerY;
      this.animateZoom(2, targetPanX, targetPanY);
    }
  }
  /**
   * 处理拖动
   */
  handlePan(e) {
    if (this.currentZoom > 1) {
      this.currentPanX += e.deltaX;
      this.currentPanY += e.deltaY;
      this.constrainPan();
      this.updateTransform();
    }
  }
  /**
   * 处理长按
   */
  handleLongPress(e) {
    if (this.contextMenu) {
      const selection = window.getSelection();
      const selectedText = selection?.toString();
      this.contextMenu.show({
        x: e.center.x,
        y: e.center.y,
        selectedText,
        items: this.getContextMenuItems(selectedText)
      });
    }
    if ("vibrate" in navigator)
      navigator.vibrate(50);
  }
  /**
   * 获取上下文菜单项
   */
  getContextMenuItems(selectedText) {
    const items = [];
    if (selectedText) {
      items.push({
        label: "\u590D\u5236",
        icon: "\u{1F4CB}",
        action: () => this.copyText(selectedText)
      }, {
        label: "\u526A\u5207",
        icon: "\u2702\uFE0F",
        action: () => this.cutText()
      }, {
        type: "separator"
      });
    }
    items.push({
      label: "\u7C98\u8D34",
      icon: "\u{1F4C4}",
      action: () => this.pasteText()
    }, {
      label: "\u5168\u9009",
      icon: "\u{1F532}",
      action: () => this.selectAll()
    }, {
      type: "separator"
    }, {
      label: "\u64A4\u9500",
      icon: "\u21A9\uFE0F",
      action: () => this.editor.undo()
    }, {
      label: "\u91CD\u505A",
      icon: "\u21AA\uFE0F",
      action: () => this.editor.redo()
    });
    return items;
  }
  /**
   * 初始化滑动菜单
   */
  initializeSwipeMenu() {
    this.swipeMenu = new SwipeMenu.SwipeMenu({
      container: this.editorContainer,
      items: [{
        label: "\u6587\u4EF6",
        icon: "\u{1F4C1}",
        action: () => this.showFileMenu()
      }, {
        label: "\u7F16\u8F91",
        icon: "\u270F\uFE0F",
        action: () => this.showEditMenu()
      }, {
        label: "\u63D2\u5165",
        icon: "\u2795",
        action: () => this.showInsertMenu()
      }, {
        label: "\u683C\u5F0F",
        icon: "\u{1F3A8}",
        action: () => this.showFormatMenu()
      }, {
        label: "\u5DE5\u5177",
        icon: "\u{1F527}",
        action: () => this.showToolsMenu()
      }, {
        label: "\u8BBE\u7F6E",
        icon: "\u2699\uFE0F",
        action: () => this.showSettings()
      }]
    });
  }
  /**
   * 初始化长按上下文菜单
   */
  initializeContextMenu() {
    this.contextMenu = new ContextMenu.ContextMenu({
      container: this.editorContainer
    });
  }
  /**
   * 初始化移动端工具栏
   */
  initializeMobileToolbar() {
    this.mobileToolbar = new MobileToolbar.MobileToolbar({
      container: this.editorContainer,
      editor: this.editor,
      items: [{
        id: "bold",
        icon: "B",
        title: "\u52A0\u7C97"
      }, {
        id: "italic",
        icon: "I",
        title: "\u659C\u4F53"
      }, {
        id: "underline",
        icon: "U",
        title: "\u4E0B\u5212\u7EBF"
      }, {
        type: "separator"
      }, {
        id: "undo",
        icon: "\u21A9",
        title: "\u64A4\u9500"
      }, {
        id: "redo",
        icon: "\u21AA",
        title: "\u91CD\u505A"
      }, {
        type: "separator"
      }, {
        id: "image",
        icon: "\u{1F5BC}",
        title: "\u63D2\u5165\u56FE\u7247"
      }, {
        id: "link",
        icon: "\u{1F517}",
        title: "\u63D2\u5165\u94FE\u63A5"
      }, {
        id: "more",
        icon: "\u22EF",
        title: "\u66F4\u591A"
      }]
    });
    this.setupKeyboardVisibilityListener();
  }
  /**
   * 设置屏幕方向监听
   */
  setupOrientationListener() {
    const handleOrientationChange = helpers.debounce(() => {
      logger.info("Orientation changed:", window.orientation);
      this.metrics = this.calculateMetrics();
      this.adjustLayoutForOrientation();
      this.editor.emit("orientationchange", {
        orientation: this.getOrientation(),
        angle: window.orientation
      });
    }, 300);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
  }
  /**
   * 设置键盘监听
   */
  setupKeyboardListener() {
    if (this.isIOS()) {
      let lastHeight = window.innerHeight;
      window.addEventListener("resize", () => {
        const currentHeight = window.innerHeight;
        const heightDiff = lastHeight - currentHeight;
        if (Math.abs(heightDiff) > 100) {
          if (heightDiff > 0)
            this.onKeyboardShow(heightDiff);
          else
            this.onKeyboardHide();
        }
        lastHeight = currentHeight;
      });
    }
    if (this.isAndroid()) {
      window.addEventListener("resize", () => {
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA")
          this.onKeyboardShow(0);
        else
          this.onKeyboardHide();
      });
    }
  }
  /**
   * 设置键盘可见性监听
   */
  setupKeyboardVisibilityListener() {
    if ("visualViewport" in window) {
      window.visualViewport?.addEventListener("resize", () => {
        const hasKeyboard = window.visualViewport.height < window.innerHeight * 0.75;
        if (hasKeyboard)
          this.mobileToolbar?.hide();
        else
          this.mobileToolbar?.show();
      });
    }
  }
  /**
   * 键盘显示时的处理
   */
  onKeyboardShow(keyboardHeight) {
    logger.info("Keyboard shown, height:", keyboardHeight);
    this.mobileToolbar?.hide();
    this.scrollToCursor();
    this.editor.emit("keyboardshow", {
      height: keyboardHeight
    });
  }
  /**
   * 键盘隐藏时的处理
   */
  onKeyboardHide() {
    logger.info("Keyboard hidden");
    this.mobileToolbar?.show();
    this.editor.emit("keyboardhide");
  }
  /**
   * 更新变换
   */
  updateTransform() {
    const transform = `scale(${this.currentZoom}) translate(${this.currentPanX}px, ${this.currentPanY}px)`;
    this.contentWrapper.style.transform = transform;
  }
  /**
   * 动画缩放
   */
  animateZoom(targetZoom, targetPanX, targetPanY) {
    const startZoom = this.currentZoom;
    const startPanX = this.currentPanX;
    const startPanY = this.currentPanY;
    const duration = 300;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeInOutCubic(progress);
      this.currentZoom = startZoom + (targetZoom - startZoom) * easeProgress;
      this.currentPanX = startPanX + (targetPanX - startPanX) * easeProgress;
      this.currentPanY = startPanY + (targetPanY - startPanY) * easeProgress;
      this.updateTransform();
      if (progress < 1)
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  /**
   * 缓动函数
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }
  /**
   * 限制拖动范围
   */
  constrainPan() {
    const rect = this.editorContainer.getBoundingClientRect();
    const contentWidth = rect.width * this.currentZoom;
    const contentHeight = rect.height * this.currentZoom;
    const maxPanX = Math.max(0, (contentWidth - rect.width) / 2);
    const maxPanY = Math.max(0, (contentHeight - rect.height) / 2);
    this.currentPanX = Math.max(-maxPanX, Math.min(maxPanX, this.currentPanX));
    this.currentPanY = Math.max(-maxPanY, Math.min(maxPanY, this.currentPanY));
  }
  /**
   * 滚动到光标位置
   */
  scrollToCursor() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 100) {
        window.scrollTo({
          top: window.scrollY + rect.bottom - window.innerHeight + 100,
          behavior: "smooth"
        });
      }
    }
  }
  /**
   * 计算视口指标
   */
  calculateMetrics() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: this.getOrientation(),
      devicePixelRatio: window.devicePixelRatio,
      isKeyboardVisible: this.isKeyboardVisible()
    };
  }
  /**
   * 获取屏幕方向
   */
  getOrientation() {
    return window.innerWidth < window.innerHeight ? "portrait" : "landscape";
  }
  /**
   * 检查键盘是否可见
   */
  isKeyboardVisible() {
    if ("visualViewport" in window && window.visualViewport)
      return window.visualViewport.height < window.innerHeight * 0.75;
    return false;
  }
  /**
   * 调整布局以适应方向
   */
  adjustLayoutForOrientation() {
    const orientation = this.getOrientation();
    if (orientation === "landscape") {
      this.mobileToolbar?.setCompactMode(true);
    } else {
      this.mobileToolbar?.setCompactMode(false);
    }
  }
  /**
   * 复制文本
   */
  async copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast("\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
    } catch (err) {
      logger.error("Failed to copy text:", err);
    }
  }
  /**
   * 剪切文本
   */
  cutText() {
    document.execCommand("cut");
    this.showToast("\u5DF2\u526A\u5207");
  }
  /**
   * 粘贴文本
   */
  async pasteText() {
    try {
      const text = await navigator.clipboard.readText();
      this.editor.insertText(text);
      this.showToast("\u5DF2\u7C98\u8D34");
    } catch (err) {
      logger.error("Failed to paste text:", err);
    }
  }
  /**
   * 全选
   */
  selectAll() {
    document.execCommand("selectAll");
  }
  /**
   * 显示提示
   */
  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "mobile-toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2e3);
  }
  /**
   * 显示文件菜单
   */
  showFileMenu() {
  }
  /**
   * 显示编辑菜单
   */
  showEditMenu() {
  }
  /**
   * 显示插入菜单
   */
  showInsertMenu() {
  }
  /**
   * 显示格式菜单
   */
  showFormatMenu() {
  }
  /**
   * 显示工具菜单
   */
  showToolsMenu() {
  }
  /**
   * 显示设置
   */
  showSettings() {
  }
  /**
   * 检测iOS
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  /**
   * 检测Android
   */
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  }
  /**
   * 销毁适配器
   */
  destroy() {
    this.gestureRecognizer?.destroy();
    this.swipeMenu?.destroy();
    this.contextMenu?.destroy();
    this.mobileToolbar?.destroy();
  }
}

exports.MobileEditorAdapter = MobileEditorAdapter;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=MobileEditorAdapter.cjs.map
