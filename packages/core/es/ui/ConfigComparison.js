/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { getPresetNames, presetDescriptions, getPreset } from '../config/presets/index.js';
import { getComponentFactory } from './base/ComponentFactory.js';
import { Modal } from './base/Modal.js';

class ConfigComparison {
  constructor() {
    this.componentFactory = getComponentFactory();
    this.modal = null;
  }
  /**
   * 显示对比面板
   */
  show() {
    this.modal = new Modal({
      title: "\u914D\u7F6E\u5BF9\u6BD4",
      width: 900
    });
    const content = this.createContent();
    this.modal.setContent(content);
    this.modal.show();
  }
  /**
   * 创建内容
   */
  createContent() {
    const container = document.createElement("div");
    container.className = "config-comparison";
    container.style.cssText = "padding: 20px;";
    const selectors = this.createSelectors();
    container.appendChild(selectors);
    const resultArea = document.createElement("div");
    resultArea.className = "comparison-result";
    resultArea.id = "comparison-result";
    resultArea.style.cssText = `
      margin-top: 20px;
      padding: 20px;
      background: var(--editor-color-background-paper, #f9fafb);
      border-radius: 8px;
      min-height: 300px;
    `;
    resultArea.innerHTML = '<p style="text-align: center; color: #6b7280;">\u8BF7\u9009\u62E9\u4E24\u4E2A\u914D\u7F6E\u8FDB\u884C\u5BF9\u6BD4</p>';
    container.appendChild(resultArea);
    return container;
  }
  /**
   * 创建选择器
   */
  createSelectors() {
    const container = document.createElement("div");
    container.style.cssText = `
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 16px;
      align-items: center;
    `;
    const presetNames = getPresetNames();
    const options = presetNames.map((name) => ({
      label: `${presetDescriptions[name].icon} ${presetDescriptions[name].name}`,
      value: name
    }));
    const select1 = this.componentFactory.createSelect({
      options,
      placeholder: "\u9009\u62E9\u914D\u7F6E1",
      onChange: (value) => this.handleSelection()
    });
    select1.id = "preset1";
    const vsLabel = document.createElement("div");
    vsLabel.textContent = "VS";
    vsLabel.style.cssText = `
      font-size: 20px;
      font-weight: 700;
      color: #3b82f6;
    `;
    const select2 = this.componentFactory.createSelect({
      options,
      placeholder: "\u9009\u62E9\u914D\u7F6E2",
      onChange: (value) => this.handleSelection()
    });
    select2.id = "preset2";
    container.appendChild(select1);
    container.appendChild(vsLabel);
    container.appendChild(select2);
    return container;
  }
  /**
   * 处理选择
   */
  handleSelection() {
    const select1 = document.getElementById("preset1");
    const select2 = document.getElementById("preset2");
    if (!select1.value || !select2.value)
      return;
    const preset1 = select1.value;
    const preset2 = select2.value;
    const comparison = this.compare(preset1, preset2);
    this.renderComparison(comparison);
  }
  /**
   * 对比配置
   */
  compare(preset1, preset2) {
    const config1 = getPreset(preset1);
    const config2 = getPreset(preset2);
    const features1 = new Set(config1.features?.enabled || []);
    const features2 = new Set(config2.features?.enabled || []);
    const onlyIn1 = Array.from(features1).filter((f) => !features2.has(f));
    const onlyIn2 = Array.from(features2).filter((f) => !features1.has(f));
    const common = Array.from(features1).filter((f) => features2.has(f));
    const loadTime1 = this.estimateLoadTime(features1.size);
    const loadTime2 = this.estimateLoadTime(features2.size);
    const memory1 = this.estimateMemory(features1.size);
    const memory2 = this.estimateMemory(features2.size);
    return {
      preset1,
      preset2,
      differences: {
        icons: config1.icons?.defaultSet !== config2.icons?.defaultSet ? `${config1.icons?.defaultSet} vs ${config2.icons?.defaultSet}` : void 0,
        theme: config1.theme?.defaultTheme !== config2.theme?.defaultTheme ? `${config1.theme?.defaultTheme} vs ${config2.theme?.defaultTheme}` : void 0,
        features: {
          onlyIn1,
          onlyIn2,
          common
        }
      },
      performance: {
        loadTime: {
          preset1: loadTime1,
          preset2: loadTime2,
          diff: loadTime2 - loadTime1
        },
        memory: {
          preset1: memory1,
          preset2: memory2,
          diff: memory2 - memory1
        },
        features: {
          preset1: features1.size,
          preset2: features2.size,
          diff: features2.size - features1.size
        }
      }
    };
  }
  /**
   * 估算加载时间
   */
  estimateLoadTime(featureCount) {
    return 300 + featureCount * 15;
  }
  /**
   * 估算内存使用
   */
  estimateMemory(featureCount) {
    return 40 + featureCount * 1.5;
  }
  /**
   * 渲染对比结果
   */
  renderComparison(comparison) {
    const resultArea = document.getElementById("comparison-result");
    if (!resultArea)
      return;
    const desc1 = presetDescriptions[comparison.preset1];
    const desc2 = presetDescriptions[comparison.preset2];
    resultArea.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div>
          <h3 style="font-size: 18px; margin-bottom: 8px;">${desc1.icon} ${desc1.name}</h3>
          <p style="font-size: 14px; color: #6b7280;">${desc1.description}</p>
        </div>
        <div>
          <h3 style="font-size: 18px; margin-bottom: 8px;">${desc2.icon} ${desc2.name}</h3>
          <p style="font-size: 14px; color: #6b7280;">${desc2.description}</p>
        </div>
      </div>
      
      <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">\u6027\u80FD\u5BF9\u6BD4</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          ${this.createPerfCard("\u52A0\u8F7D\u65F6\u95F4", comparison.performance.loadTime, "ms")}
          ${this.createPerfCard("\u5185\u5B58\u4F7F\u7528", comparison.performance.memory, "MB")}
          ${this.createPerfCard("\u529F\u80FD\u6570\u91CF", comparison.performance.features, "\u4E2A")}
        </div>
      </div>
      
      <div style="background: white; padding: 16px; border-radius: 8px;">
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">\u529F\u80FD\u5DEE\u5F02</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #3b82f6;">\u4EC5\u5728 ${desc1.name}</div>
            <div style="font-size: 14px; color: #6b7280;">
              ${comparison.differences.features.onlyIn1.length > 0 ? comparison.differences.features.onlyIn1.map((f) => `\u2022 ${f}`).join("<br>") : "\u65E0\u72EC\u6709\u529F\u80FD"}
            </div>
          </div>
          <div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #10b981;">\u4EC5\u5728 ${desc2.name}</div>
            <div style="font-size: 14px; color: #6b7280;">
              ${comparison.differences.features.onlyIn2.length > 0 ? comparison.differences.features.onlyIn2.map((f) => `\u2022 ${f}`).join("<br>") : "\u65E0\u72EC\u6709\u529F\u80FD"}
            </div>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #6b7280;">\u5171\u540C\u529F\u80FD (${comparison.differences.features.common.length}\u4E2A)</div>
          <div style="font-size: 12px; color: #9ca3af;">
            ${comparison.differences.features.common.slice(0, 10).join(", ")}
            ${comparison.differences.features.common.length > 10 ? `... \u7B49${comparison.differences.features.common.length}\u4E2A` : ""}
          </div>
        </div>
      </div>
    `;
  }
  /**
   * 创建性能卡片
   */
  createPerfCard(label, data, unit) {
    const better = data.diff < 0 ? 1 : 2;
    const diffPercent = Math.abs(data.diff / data.preset1 * 100).toFixed(1);
    return `
      <div style="text-align: center; padding: 12px; background: #f9fafb; border-radius: 6px;">
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${label}</div>
        <div style="display: flex; justify-content: space-around; margin-bottom: 8px;">
          <div>
            <div style="font-size: 20px; font-weight: 700; color: ${better === 1 ? "#10b981" : "#6b7280"};">
              ${data.preset1.toFixed(0)}
            </div>
          </div>
          <div>
            <div style="font-size: 20px; font-weight: 700; color: ${better === 2 ? "#10b981" : "#6b7280"};">
              ${data.preset2.toFixed(0)}
            </div>
          </div>
        </div>
        <div style="font-size: 11px; color: ${data.diff < 0 ? "#10b981" : data.diff > 0 ? "#ef4444" : "#6b7280"};">
          ${data.diff === 0 ? "\u76F8\u540C" : `${(data.diff < 0 ? "\u2193" : "\u2191") + diffPercent}%`}
        </div>
      </div>
    `;
  }
}
function showConfigComparison() {
  const comparison = new ConfigComparison();
  comparison.show();
  return comparison;
}

export { ConfigComparison, showConfigComparison };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigComparison.js.map
