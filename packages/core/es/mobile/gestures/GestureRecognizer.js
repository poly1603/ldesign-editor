/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';
import { createLogger } from '../../utils/logger.js';

createLogger("GestureRecognizer");
class GestureRecognizer extends EventEmitter {
  constructor(element, options = {}) {
    super();
    this.touches = /* @__PURE__ */ new Map();
    this.isGesturing = false;
    this.lastTapTime = 0;
    this.lastTapX = 0;
    this.lastTapY = 0;
    this.initialDistance = 0;
    this.initialAngle = 0;
    this.gestureStartTime = 0;
    this.element = element;
    this.options = {
      touchStartDelay: 0,
      longPressThreshold: 500,
      doubleTapInterval: 300,
      swipeThreshold: 30,
      pinchThreshold: 0.1,
      preventDefault: true,
      stopPropagation: false,
      ...options
    };
    this.setupEventListeners();
  }
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    this.element.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false
    });
    this.element.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false
    });
    this.element.addEventListener("touchend", this.handleTouchEnd.bind(this), {
      passive: false
    });
    this.element.addEventListener("touchcancel", this.handleTouchCancel.bind(this), {
      passive: false
    });
    if (process.env.NODE_ENV === "development") {
      let mouseDown = false;
      this.element.addEventListener("mousedown", (e) => {
        mouseDown = true;
        this.handleTouchStart({
          touches: [{
            identifier: 0,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            target: e.target
          }],
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        });
      });
      document.addEventListener("mousemove", (e) => {
        if (!mouseDown)
          return;
        this.handleTouchMove({
          touches: [{
            identifier: 0,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            target: e.target
          }],
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        });
      });
      document.addEventListener("mouseup", (e) => {
        if (!mouseDown)
          return;
        mouseDown = false;
        this.handleTouchEnd({
          touches: [],
          changedTouches: [{
            identifier: 0,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            target: e.target
          }],
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        });
      });
    }
  }
  /**
   * 处理触摸开始
   */
  handleTouchStart(e) {
    if (this.options.preventDefault)
      e.preventDefault();
    if (this.options.stopPropagation)
      e.stopPropagation();
    const timestamp = Date.now();
    Array.from(e.touches).forEach((touch) => {
      this.touches.set(touch.identifier, {
        identifier: touch.identifier,
        startX: touch.pageX,
        startY: touch.pageY,
        startTime: timestamp,
        currentX: touch.pageX,
        currentY: touch.pageY,
        previousX: touch.pageX,
        previousY: touch.pageY,
        velocityX: 0,
        velocityY: 0
      });
    });
    if (!this.isGesturing) {
      this.isGesturing = true;
      this.gestureStartTime = timestamp;
      const gestureEvent = this.createGestureEvent("gesturestart", e);
      this.emit("gesturestart", gestureEvent);
    }
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const timeDiff = timestamp - this.lastTapTime;
      const xDiff = Math.abs(touch.pageX - this.lastTapX);
      const yDiff = Math.abs(touch.pageY - this.lastTapY);
      if (timeDiff < this.options.doubleTapInterval && xDiff < 30 && yDiff < 30) {
        this.emit("doubletap", this.createGestureEvent("doubletap", e));
        this.lastTapTime = 0;
      } else {
        this.lastTapTime = timestamp;
        this.lastTapX = touch.pageX;
        this.lastTapY = touch.pageY;
      }
      this.longPressTimer = window.setTimeout(() => {
        const touchInfo = this.touches.get(touch.identifier);
        if (touchInfo) {
          const moveDistance = Math.sqrt((touchInfo.currentX - touchInfo.startX) ** 2 + (touchInfo.currentY - touchInfo.startY) ** 2);
          if (moveDistance < 10)
            this.emit("longpress", this.createGestureEvent("longpress", e));
        }
      }, this.options.longPressThreshold);
    }
    if (e.touches.length === 2) {
      const [touch1, touch2] = Array.from(e.touches);
      this.initialDistance = this.getDistance(touch1, touch2);
      this.initialAngle = this.getAngle(touch1, touch2);
      this.emit("pinchstart", this.createGestureEvent("pinchstart", e));
    }
  }
  /**
   * 处理触摸移动
   */
  handleTouchMove(e) {
    if (this.options.preventDefault)
      e.preventDefault();
    if (this.options.stopPropagation)
      e.stopPropagation();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = void 0;
    }
    const timestamp = Date.now();
    Array.from(e.touches).forEach((touch) => {
      const touchInfo = this.touches.get(touch.identifier);
      if (touchInfo) {
        touchInfo.previousX = touchInfo.currentX;
        touchInfo.previousY = touchInfo.currentY;
        touchInfo.currentX = touch.pageX;
        touchInfo.currentY = touch.pageY;
        const deltaTime = timestamp - touchInfo.startTime;
        if (deltaTime > 0) {
          touchInfo.velocityX = (touchInfo.currentX - touchInfo.startX) / deltaTime * 1e3;
          touchInfo.velocityY = (touchInfo.currentY - touchInfo.startY) / deltaTime * 1e3;
        }
      }
    });
    const gestureEvent = this.createGestureEvent("gesturemove", e);
    this.emit("gesturemove", gestureEvent);
    if (e.touches.length === 1)
      this.emit("pan", gestureEvent);
    if (e.touches.length === 2) {
      const [touch1, touch2] = Array.from(e.touches);
      const currentDistance = this.getDistance(touch1, touch2);
      const currentAngle = this.getAngle(touch1, touch2);
      const scale = currentDistance / this.initialDistance;
      const rotation = currentAngle - this.initialAngle;
      const pinchEvent = {
        ...gestureEvent,
        scale,
        rotation
      };
      this.emit("pinch", pinchEvent);
      if (Math.abs(scale - 1) > this.options.pinchThreshold)
        this.emit("pinchzoom", pinchEvent);
      if (Math.abs(rotation) > 5)
        this.emit("rotate", pinchEvent);
    }
  }
  /**
   * 处理触摸结束
   */
  handleTouchEnd(e) {
    if (this.options.preventDefault)
      e.preventDefault();
    if (this.options.stopPropagation)
      e.stopPropagation();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = void 0;
    }
    const timestamp = Date.now();
    Array.from(e.changedTouches).forEach((touch) => {
      const touchInfo = this.touches.get(touch.identifier);
      if (touchInfo) {
        const deltaX = touchInfo.currentX - touchInfo.startX;
        const deltaY = touchInfo.currentY - touchInfo.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = timestamp - touchInfo.startTime;
        if (distance > this.options.swipeThreshold && duration < 300) {
          const direction = this.getSwipeDirection(deltaX, deltaY);
          const swipeEvent = this.createGestureEvent("swipe", e);
          this.emit("swipe", swipeEvent);
          this.emit(`swipe${direction}`, swipeEvent);
        }
        if (distance < 10 && duration < 200)
          this.emit("tap", this.createGestureEvent("tap", e));
        this.touches.delete(touch.identifier);
      }
    });
    if (e.touches.length < 2 && this.touches.size === 1)
      this.emit("pinchend", this.createGestureEvent("pinchend", e));
    if (e.touches.length === 0) {
      this.isGesturing = false;
      this.emit("gestureend", this.createGestureEvent("gestureend", e));
    }
  }
  /**
   * 处理触摸取消
   */
  handleTouchCancel(e) {
    this.handleTouchEnd(e);
  }
  /**
   * 创建手势事件
   */
  createGestureEvent(type, e) {
    const touches = Array.from(e.touches).map((touch) => ({
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      target: touch.target,
      timestamp: Date.now()
    }));
    const center = this.getCenter(touches);
    const touchInfos = Array.from(this.touches.values());
    let deltaX = 0;
    let deltaY = 0;
    let distance = 0;
    let angle = 0;
    let velocity = {
      x: 0,
      y: 0
    };
    let scale = 1;
    let rotation = 0;
    if (touchInfos.length > 0) {
      const avgDeltaX = touchInfos.reduce((sum, t) => sum + (t.currentX - t.startX), 0) / touchInfos.length;
      const avgDeltaY = touchInfos.reduce((sum, t) => sum + (t.currentY - t.startY), 0) / touchInfos.length;
      deltaX = avgDeltaX;
      deltaY = avgDeltaY;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      const avgVelocityX = touchInfos.reduce((sum, t) => sum + t.velocityX, 0) / touchInfos.length;
      const avgVelocityY = touchInfos.reduce((sum, t) => sum + t.velocityY, 0) / touchInfos.length;
      velocity = {
        x: avgVelocityX,
        y: avgVelocityY
      };
    }
    if (touches.length === 2 && this.initialDistance > 0) {
      const currentDistance = this.getDistance(touches[0], touches[1]);
      scale = currentDistance / this.initialDistance;
      const currentAngle = this.getAngle(touches[0], touches[1]);
      rotation = currentAngle - this.initialAngle;
    }
    return {
      type,
      touches,
      center,
      deltaX,
      deltaY,
      deltaTime: Date.now() - this.gestureStartTime,
      distance,
      angle,
      velocity,
      scale,
      rotation,
      target: e.target,
      preventDefault: () => e.preventDefault()
    };
  }
  /**
   * 获取两点间距离
   */
  getDistance(touch1, touch2) {
    const x1 = "pageX" in touch1 ? touch1.pageX : touch1.currentX;
    const y1 = "pageY" in touch1 ? touch1.pageY : touch1.currentY;
    const x2 = "pageX" in touch2 ? touch2.pageX : touch2.currentX;
    const y2 = "pageY" in touch2 ? touch2.pageY : touch2.currentY;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  /**
   * 获取两点间角度
   */
  getAngle(touch1, touch2) {
    const x1 = "pageX" in touch1 ? touch1.pageX : touch1.currentX;
    const y1 = "pageY" in touch1 ? touch1.pageY : touch1.currentY;
    const x2 = "pageX" in touch2 ? touch2.pageX : touch2.currentX;
    const y2 = "pageY" in touch2 ? touch2.pageY : touch2.currentY;
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  }
  /**
   * 获取触摸点中心
   */
  getCenter(touches) {
    if (touches.length === 0)
      return {
        x: 0,
        y: 0
      };
    const sumX = touches.reduce((sum, touch) => sum + touch.pageX, 0);
    const sumY = touches.reduce((sum, touch) => sum + touch.pageY, 0);
    return {
      x: sumX / touches.length,
      y: sumY / touches.length
    };
  }
  /**
   * 获取滑动方向
   */
  getSwipeDirection(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX > absY)
      return deltaX > 0 ? "right" : "left";
    else
      return deltaY > 0 ? "down" : "up";
  }
  /**
   * 销毁手势识别器
   */
  destroy() {
    this.element.removeEventListener("touchstart", this.handleTouchStart.bind(this));
    this.element.removeEventListener("touchmove", this.handleTouchMove.bind(this));
    this.element.removeEventListener("touchend", this.handleTouchEnd.bind(this));
    this.element.removeEventListener("touchcancel", this.handleTouchCancel.bind(this));
    if (this.longPressTimer)
      clearTimeout(this.longPressTimer);
    this.touches.clear();
    this.removeAllListeners();
  }
}

export { GestureRecognizer };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=GestureRecognizer.js.map
