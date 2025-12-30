/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class UploadProgress {
  constructor(options = {}) {
    this.cancelled = false;
    this.options = options;
    this.container = this.createContainer();
    this.progressBar = this.container.querySelector(".progress-fill");
    this.percentText = this.container.querySelector(".percent");
    this.statusText = this.container.querySelector(".status");
  }
  /**
   * 创建容器
   */
  createContainer() {
    const container = document.createElement("div");
    container.className = "upload-progress";
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    this.addAnimation();
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
            ${this.options.fileName || "\u4E0A\u4F20\u6587\u4EF6"}
          </div>
          <div class="status" style="font-size: 12px; color: #6b7280;">
            \u51C6\u5907\u4E0A\u4F20...
          </div>
        </div>
        <button class="cancel-btn" style="border: none; background: none; font-size: 20px; cursor: pointer; color: #666; padding: 0; width: 24px; height: 24px;">&times;</button>
      </div>
      
      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 4px;">
          <span class="percent">0%</span>
          <span class="size">${this.formatSize(this.options.fileSize || 0)}</span>
        </div>
        <div style="height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
          <div class="progress-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.3s ease;"></div>
        </div>
      </div>
    `;
    const cancelBtn = container.querySelector(".cancel-btn");
    cancelBtn?.addEventListener("click", () => {
      this.cancel();
    });
    return container;
  }
  /**
   * 添加动画样式
   */
  addAnimation() {
    if (document.getElementById("upload-progress-animation"))
      return;
    const style = document.createElement("style");
    style.id = "upload-progress-animation";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  /**
   * 更新进度
   */
  updateProgress(percent, status) {
    const clampedPercent = Math.min(100, Math.max(0, percent));
    this.progressBar.style.width = `${clampedPercent}%`;
    this.percentText.textContent = `${Math.round(clampedPercent)}%`;
    if (status) {
      this.statusText.textContent = status;
    } else {
      if (clampedPercent === 0)
        this.statusText.textContent = "\u51C6\u5907\u4E0A\u4F20...";
      else if (clampedPercent < 100)
        this.statusText.textContent = "\u4E0A\u4F20\u4E2D...";
      else
        this.statusText.textContent = "\u4E0A\u4F20\u5B8C\u6210\uFF01";
    }
  }
  /**
   * 设置为成功状态
   */
  success(message = "\u4E0A\u4F20\u6210\u529F\uFF01") {
    this.progressBar.style.background = "#10b981";
    this.statusText.textContent = message;
    this.statusText.style.color = "#10b981";
    setTimeout(() => {
      this.hide();
    }, 2e3);
  }
  /**
   * 设置为错误状态
   */
  error(message = "\u4E0A\u4F20\u5931\u8D25") {
    this.progressBar.style.background = "#ef4444";
    this.statusText.textContent = message;
    this.statusText.style.color = "#ef4444";
    setTimeout(() => {
      this.hide();
    }, 3e3);
  }
  /**
   * 取消上传
   */
  cancel() {
    this.cancelled = true;
    this.statusText.textContent = "\u5DF2\u53D6\u6D88";
    this.statusText.style.color = "#f59e0b";
    if (this.options.onCancel)
      this.options.onCancel();
    setTimeout(() => {
      this.hide();
    }, 1e3);
  }
  /**
   * 检查是否已取消
   */
  isCancelled() {
    return this.cancelled;
  }
  /**
   * 显示
   */
  show() {
    if (!this.container.parentElement)
      document.body.appendChild(this.container);
  }
  /**
   * 隐藏
   */
  hide() {
    this.container.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (this.container.parentElement)
        this.container.parentElement.removeChild(this.container);
    }, 300);
  }
  /**
   * 格式化文件大小
   */
  formatSize(bytes) {
    if (bytes === 0)
      return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(2)} ${units[i]}`;
  }
}
function createUploadProgress(options) {
  return new UploadProgress(options);
}
function showUploadProgress(options) {
  const progress = new UploadProgress(options);
  progress.show();
  return progress;
}

export { UploadProgress, createUploadProgress, showUploadProgress };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=UploadProgress.js.map
