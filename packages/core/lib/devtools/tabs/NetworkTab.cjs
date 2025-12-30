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

var logger = require('../../utils/logger.cjs');

logger.createLogger("NetworkTab");
class NetworkTab {
  constructor(options) {
    this.requests = [];
    this.filter = "";
    this.typeFilter = "all";
    this.isRecording = true;
    this.maxRequests = 500;
    this.editor = options.editor;
  }
  /**
   * 渲染标签页
   */
  render() {
    this.container = document.createElement("div");
    this.container.className = "network-tab";
    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    const toolbar = this.createToolbar();
    const content = this.createContent();
    this.container.appendChild(toolbar);
    this.container.appendChild(content);
    return this.container;
  }
  /**
   * 创建工具栏
   */
  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "network-toolbar";
    toolbar.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
      gap: 10px;
      flex-shrink: 0;
    `;
    const recordBtn = document.createElement("button");
    recordBtn.style.cssText = `
      padding: 4px 8px;
      background: ${this.isRecording ? "#ff4444" : "transparent"};
      color: ${this.isRecording ? "white" : "#ff4444"};
      border: 1px solid #ff4444;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    recordBtn.innerHTML = this.isRecording ? "\u23F8 \u505C\u6B62" : "\u23FA \u5F55\u5236";
    recordBtn.onclick = () => {
      this.isRecording = !this.isRecording;
      recordBtn.style.background = this.isRecording ? "#ff4444" : "transparent";
      recordBtn.style.color = this.isRecording ? "white" : "#ff4444";
      recordBtn.innerHTML = this.isRecording ? "\u23F8 \u505C\u6B62" : "\u23FA \u5F55\u5236";
    };
    const clearBtn = document.createElement("button");
    clearBtn.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid #666;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    clearBtn.innerHTML = "\u{1F5D1}\uFE0F \u6E05\u7A7A";
    clearBtn.onclick = () => this.clear();
    const typeFilter = this.createTypeFilter();
    const searchBox = this.createSearchBox();
    const stats = document.createElement("div");
    stats.className = "network-stats";
    stats.style.cssText = `
      margin-left: auto;
      font-size: 12px;
      color: #666;
      display: flex;
      gap: 15px;
    `;
    stats.innerHTML = `
      <span id="request-count">0 \u8BF7\u6C42</span>
      <span id="data-size">0 KB</span>
      <span id="load-time">0 ms</span>
    `;
    toolbar.appendChild(recordBtn);
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(typeFilter);
    toolbar.appendChild(searchBox);
    toolbar.appendChild(stats);
    return toolbar;
  }
  /**
   * 创建类型过滤器
   */
  createTypeFilter() {
    const container = document.createElement("select");
    container.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
    `;
    const types = [{
      value: "all",
      label: "\u5168\u90E8"
    }, {
      value: "xhr",
      label: "XHR"
    }, {
      value: "fetch",
      label: "Fetch"
    }, {
      value: "script",
      label: "JS"
    }, {
      value: "style",
      label: "CSS"
    }, {
      value: "image",
      label: "\u56FE\u7247"
    }, {
      value: "media",
      label: "\u5A92\u4F53"
    }, {
      value: "font",
      label: "\u5B57\u4F53"
    }, {
      value: "doc",
      label: "\u6587\u6863"
    }, {
      value: "ws",
      label: "WS"
    }, {
      value: "other",
      label: "\u5176\u4ED6"
    }];
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.value;
      option.textContent = type.label;
      container.appendChild(option);
    });
    container.onchange = (e) => {
      this.typeFilter = e.target.value;
      this.renderRequests();
    };
    return container;
  }
  /**
   * 创建搜索框
   */
  createSearchBox() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "\u8FC7\u6EE4\u8BF7\u6C42...";
    input.style.cssText = `
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      width: 200px;
    `;
    input.oninput = (e) => {
      this.filter = e.target.value;
      this.renderRequests();
    };
    return input;
  }
  /**
   * 创建主内容区
   */
  createContent() {
    const content = document.createElement("div");
    content.style.cssText = `
      flex: 1;
      display: flex;
      overflow: hidden;
    `;
    this.requestsContainer = document.createElement("div");
    this.requestsContainer.className = "network-requests";
    this.requestsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid #e0e0e0;
    `;
    this.detailsContainer = document.createElement("div");
    this.detailsContainer.className = "network-details";
    this.detailsContainer.style.cssText = `
      width: 400px;
      overflow-y: auto;
      background: #fafafa;
      display: none;
    `;
    this.requestsContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead style="background: #f5f5f5; position: sticky; top: 0;">
          <tr>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0;">\u540D\u79F0</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0; width: 60px;">\u72B6\u6001</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0; width: 60px;">\u7C7B\u578B</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e0e0e0; width: 60px;">\u5927\u5C0F</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e0e0e0; width: 60px;">\u65F6\u95F4</th>
          </tr>
        </thead>
        <tbody id="requests-tbody">
          <tr>
            <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
              \u6682\u65E0\u7F51\u7EDC\u8BF7\u6C42
            </td>
          </tr>
        </tbody>
      </table>
    `;
    content.appendChild(this.requestsContainer);
    content.appendChild(this.detailsContainer);
    return content;
  }
  /**
   * 开始记录请求
   */
  startRequest(requestInfo) {
    if (!this.isRecording)
      return "";
    const id = `req-${Date.now()}-${Math.random()}`;
    const request = {
      id,
      url: requestInfo.url,
      method: requestInfo.method,
      requestHeaders: requestInfo.headers,
      requestBody: requestInfo.body,
      startTime: performance.now(),
      type: this.detectRequestType(requestInfo.url)
    };
    this.requests.push(request);
    if (this.requests.length > this.maxRequests)
      this.requests.shift();
    this.addRequestRow(request);
    this.updateStats();
    return id;
  }
  /**
   * 完成请求
   */
  completeRequest(id, response) {
    const request = this.requests.find((r) => r.id === id);
    if (!request)
      return;
    request.status = response.status;
    request.statusText = response.statusText;
    request.endTime = performance.now();
    request.duration = response.duration || request.endTime - request.startTime;
    request.responseBody = response.body;
    if (response.body)
      request.size = new Blob([JSON.stringify(response.body)]).size;
    this.updateRequestRow(request);
    this.updateStats();
  }
  /**
   * 失败请求
   */
  failRequest(id, error) {
    const request = this.requests.find((r) => r.id === id);
    if (!request)
      return;
    request.error = error.error;
    request.endTime = performance.now();
    request.duration = error.duration || request.endTime - request.startTime;
    this.updateRequestRow(request);
    this.updateStats();
  }
  /**
   * 检测请求类型
   */
  detectRequestType(url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes("/api/"))
      return "xhr";
    if (urlLower.endsWith(".js"))
      return "script";
    if (urlLower.endsWith(".css"))
      return "style";
    if (/\.(jpg|jpeg|png|gif|svg|webp|ico)/.test(urlLower))
      return "image";
    if (/\.(mp4|webm|ogg|mp3|wav)/.test(urlLower))
      return "media";
    if (/\.(woff|woff2|ttf|eot|otf)/.test(urlLower))
      return "font";
    if (urlLower.endsWith(".html"))
      return "doc";
    if (urlLower.startsWith("ws://") || urlLower.startsWith("wss://"))
      return "ws";
    return "other";
  }
  /**
   * 添加请求行
   */
  addRequestRow(request) {
    const tbody = this.container?.querySelector("#requests-tbody");
    if (!tbody)
      return;
    if (tbody.children.length === 1 && tbody.children[0].textContent?.includes("\u6682\u65E0"))
      tbody.innerHTML = "";
    const row = document.createElement("tr");
    row.dataset.id = request.id;
    row.style.cssText = `
      cursor: pointer;
      transition: background 0.2s;
    `;
    row.innerHTML = `
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
        ${this.getRequestName(request.url)}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">
        <span style="color: #999;">...</span>
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">
        ${request.type}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
        -
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
        <span style="color: #999;">...</span>
      </td>
    `;
    row.onclick = () => this.selectRequest(request);
    row.onmouseenter = () => {
      row.style.background = "#f5f5f5";
    };
    row.onmouseleave = () => {
      row.style.background = "transparent";
    };
    tbody.appendChild(row);
  }
  /**
   * 更新请求行
   */
  updateRequestRow(request) {
    const row = this.container?.querySelector(`tr[data-id="${request.id}"]`);
    if (!row)
      return;
    const statusColor = request.error ? "#f44336" : request.status && request.status >= 400 ? "#f44336" : request.status && request.status >= 300 ? "#ff9800" : "#4caf50";
    row.innerHTML = `
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
        ${this.getRequestName(request.url)}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">
        <span style="color: ${statusColor}; font-weight: bold;">
          ${request.status || (request.error ? "ERR" : "...")}
        </span>
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">
        ${request.type}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
        ${request.size ? this.formatSize(request.size) : "-"}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
        ${request.duration ? `${request.duration.toFixed(0)}ms` : "..."}
      </td>
    `;
  }
  /**
   * 渲染所有请求
   */
  renderRequests() {
    const tbody = this.container?.querySelector("#requests-tbody");
    if (!tbody)
      return;
    const filteredRequests = this.requests.filter((req) => {
      if (this.typeFilter !== "all" && req.type !== this.typeFilter)
        return false;
      if (this.filter && !req.url.toLowerCase().includes(this.filter.toLowerCase()))
        return false;
      return true;
    });
    if (filteredRequests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
            \u6682\u65E0\u5339\u914D\u7684\u7F51\u7EDC\u8BF7\u6C42
          </td>
        </tr>
      `;
      return;
    }
    tbody.innerHTML = "";
    filteredRequests.forEach((request) => {
      this.addRequestRow(request);
      if (request.endTime)
        this.updateRequestRow(request);
    });
  }
  /**
   * 选择请求显示详情
   */
  selectRequest(request) {
    this.selectedRequest = request;
    if (!this.detailsContainer)
      return;
    this.detailsContainer.style.display = "block";
    this.detailsContainer.innerHTML = `
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 14px;">\u8BF7\u6C42\u8BE6\u60C5</h3>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">URL</div>
          <div style="font-size: 12px; word-break: break-all;">${request.url}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u65B9\u6CD5</div>
          <div style="font-size: 12px;">${request.method}</div>
        </div>
        
        ${request.status ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u72B6\u6001</div>
            <div style="font-size: 12px;">${request.status} ${request.statusText || ""}</div>
          </div>
        ` : ""}
        
        ${request.duration ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u8017\u65F6</div>
            <div style="font-size: 12px;">${request.duration.toFixed(2)}ms</div>
          </div>
        ` : ""}
        
        ${request.size ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u5927\u5C0F</div>
            <div style="font-size: 12px;">${this.formatSize(request.size)}</div>
          </div>
        ` : ""}
        
        ${request.error ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #999; margin-bottom: 5px;">\u9519\u8BEF</div>
            <div style="font-size: 12px; color: #f44336;">${request.error}</div>
          </div>
        ` : ""}
        
        <button onclick="this.parentElement.parentElement.style.display='none'" style="
          padding: 6px 12px;
          background: #666;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">\u5173\u95ED</button>
      </div>
    `;
  }
  /**
   * 获取请求名称
   */
  getRequestName(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split("/").pop() || urlObj.pathname;
    } catch {
      return url.split("/").pop() || url;
    }
  }
  /**
   * 格式化大小
   */
  formatSize(bytes) {
    if (bytes < 1024)
      return `${bytes}B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  }
  /**
   * 更新统计
   */
  updateStats() {
    const count = this.requests.length;
    const totalSize = this.requests.reduce((sum, req) => sum + (req.size || 0), 0);
    const totalTime = Math.max(...this.requests.map((req) => req.endTime || req.startTime)) - Math.min(...this.requests.map((req) => req.startTime));
    const countEl = this.container?.querySelector("#request-count");
    if (countEl)
      countEl.textContent = `${count} \u8BF7\u6C42`;
    const sizeEl = this.container?.querySelector("#data-size");
    if (sizeEl)
      sizeEl.textContent = this.formatSize(totalSize);
    const timeEl = this.container?.querySelector("#load-time");
    if (timeEl)
      timeEl.textContent = `${totalTime.toFixed(0)}ms`;
  }
  /**
   * 清空请求
   */
  clear() {
    this.requests = [];
    const tbody = this.container?.querySelector("#requests-tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
            \u6682\u65E0\u7F51\u7EDC\u8BF7\u6C42
          </td>
        </tr>
      `;
    }
    this.updateStats();
    if (this.detailsContainer)
      this.detailsContainer.style.display = "none";
  }
  /**
   * 激活标签页
   */
  activate() {
  }
  /**
   * 停用标签页
   */
  deactivate() {
  }
  /**
   * 销毁
   */
  destroy() {
    this.container = void 0;
  }
}

exports.NetworkTab = NetworkTab;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=NetworkTab.cjs.map
