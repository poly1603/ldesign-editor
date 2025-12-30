/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { presetDescriptions } from '../config/presets/index.js';
import { getComponentFactory } from './base/ComponentFactory.js';
import { Modal } from './base/Modal.js';

class ConfigWizard {
  constructor() {
    this.componentFactory = getComponentFactory();
    this.modal = null;
    this.answers = {};
    this.currentStep = 0;
    this.questions = [{
      id: "usage",
      question: "\u4F60\u4E3B\u8981\u7528\u7F16\u8F91\u5668\u505A\u4EC0\u4E48\uFF1F",
      options: [{
        label: "\u{1F4DD} \u5199\u535A\u5BA2\u6587\u7AE0",
        value: "blog",
        description: "\u4E2A\u4EBA\u535A\u5BA2\u3001\u6587\u7AE0\u5199\u4F5C"
      }, {
        label: "\u{1F3E2} \u7BA1\u7406\u5185\u5BB9",
        value: "cms",
        description: "\u4F01\u4E1ACMS\u3001\u5185\u5BB9\u53D1\u5E03"
      }, {
        label: "\u{1F465} \u56E2\u961F\u534F\u4F5C",
        value: "collaboration",
        description: "\u591A\u4EBA\u5728\u7EBF\u7F16\u8F91"
      }, {
        label: "\u{1F4C4} \u5199\u6280\u672F\u6587\u6863",
        value: "markdown",
        description: "Markdown\u3001API\u6587\u6863"
      }, {
        label: "\u{1F4D2} \u8BB0\u7B14\u8BB0",
        value: "note",
        description: "\u4E2A\u4EBA\u7B14\u8BB0\u3001\u77E5\u8BC6\u7BA1\u7406"
      }, {
        label: "\u{1F4AC} \u8BC4\u8BBA\u56DE\u590D",
        value: "comment",
        description: "\u8BC4\u8BBA\u6846\u3001\u8868\u5355"
      }]
    }, {
      id: "features",
      question: "\u4F60\u9700\u8981\u54EA\u4E9B\u529F\u80FD\uFF1F",
      options: [{
        label: "\u{1F3A8} \u4E30\u5BCC\u7684\u683C\u5F0F\u5316",
        value: "rich-format"
      }, {
        label: "\u{1F5BC}\uFE0F \u56FE\u7247\u89C6\u9891",
        value: "media"
      }, {
        label: "\u{1F4CA} \u8868\u683C\u652F\u6301",
        value: "table"
      }, {
        label: "\u{1F916} AI\u8F85\u52A9",
        value: "ai"
      }, {
        label: "\u26A1 \u53EA\u8981\u57FA\u7840\u529F\u80FD\uFF08\u66F4\u5FEB\uFF09",
        value: "basic"
      }]
    }, {
      id: "device",
      question: "\u4E3B\u8981\u5728\u4EC0\u4E48\u8BBE\u5907\u4E0A\u4F7F\u7528\uFF1F",
      options: [{
        label: "\u{1F4BB} \u684C\u9762\u7535\u8111",
        value: "desktop"
      }, {
        label: "\u{1F4F1} \u624B\u673A\u5E73\u677F",
        value: "mobile"
      }, {
        label: "\u{1F310} \u4E24\u8005\u90FD\u6709",
        value: "both"
      }]
    }, {
      id: "priority",
      question: "\u4F60\u66F4\u770B\u91CD\u4EC0\u4E48\uFF1F",
      options: [{
        label: "\u26A1 \u901F\u5EA6\u6027\u80FD",
        value: "performance"
      }, {
        label: "\u{1F3A8} \u529F\u80FD\u4E30\u5BCC",
        value: "features"
      }, {
        label: "\u2696\uFE0F \u5E73\u8861\u4E24\u8005",
        value: "balanced"
      }]
    }];
  }
  /**
   * 显示向导
   */
  show(onComplete) {
    this.answers = {};
    this.currentStep = 0;
    this.modal = new Modal({
      title: "\u914D\u7F6E\u5411\u5BFC",
      width: 800
    });
    this.renderStep();
    this.modal.show();
    this.onComplete = onComplete;
  }
  /**
   * 渲染当前步骤
   */
  renderStep() {
    const question = this.questions[this.currentStep];
    const content = this.createStepContent(question);
    this.modal?.setContent(content);
    this.modal?.setFooter(this.createFooter());
  }
  /**
   * 创建步骤内容
   */
  createStepContent(question) {
    const container = document.createElement("div");
    container.className = "wizard-step";
    container.style.cssText = `
      padding: 30px;
      min-height: 300px;
    `;
    const progress = document.createElement("div");
    progress.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 30px;
    `;
    for (let i = 0; i < this.questions.length; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${i === this.currentStep ? "#3b82f6" : "#e5e7eb"};
        transition: all 0.3s;
      `;
      progress.appendChild(dot);
    }
    container.appendChild(progress);
    const title = document.createElement("h3");
    title.textContent = `${this.currentStep + 1}. ${question.question}`;
    title.style.cssText = `
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 24px;
      text-align: center;
      color: var(--editor-color-text-primary, #1f2937);
    `;
    container.appendChild(title);
    const options = document.createElement("div");
    options.className = "wizard-options";
    options.style.cssText = `
      display: grid;
      gap: 12px;
    `;
    question.options.forEach((option) => {
      const optionEl = document.createElement("div");
      optionEl.className = "wizard-option";
      optionEl.style.cssText = `
        padding: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      `;
      optionEl.innerHTML = `
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${option.label}</div>
        ${option.description ? `<div style="font-size: 14px; color: #6b7280;">${option.description}</div>` : ""}
      `;
      optionEl.addEventListener("mouseenter", () => {
        optionEl.style.borderColor = "#3b82f6";
        optionEl.style.background = "#f0f9ff";
      });
      optionEl.addEventListener("mouseleave", () => {
        optionEl.style.borderColor = "#e5e7eb";
        optionEl.style.background = "white";
      });
      optionEl.addEventListener("click", () => {
        this.answers[question.id] = option.value;
        this.nextStep();
      });
      options.appendChild(optionEl);
    });
    container.appendChild(options);
    return container;
  }
  /**
   * 创建底部按钮
   */
  createFooter() {
    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 16px 30px;
      border-top: 1px solid var(--editor-color-border, #e5e7eb);
    `;
    const backBtn = this.componentFactory.createButton({
      label: "\u4E0A\u4E00\u6B65",
      type: "secondary",
      disabled: this.currentStep === 0,
      onClick: () => this.prevStep()
    });
    const skipBtn = this.componentFactory.createButton({
      label: "\u8DF3\u8FC7\u5411\u5BFC",
      type: "text",
      onClick: () => this.skip()
    });
    footer.appendChild(backBtn);
    footer.appendChild(skipBtn);
    return footer;
  }
  /**
   * 下一步
   */
  nextStep() {
    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.complete();
    }
  }
  /**
   * 上一步
   */
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep();
    }
  }
  /**
   * 跳过向导
   */
  skip() {
    this.modal?.hide();
    if (this.onComplete)
      this.onComplete("blog");
  }
  /**
   * 完成向导
   */
  complete() {
    const preset = this.recommendPreset();
    this.showRecommendation(preset);
  }
  /**
   * 推荐配置
   */
  recommendPreset() {
    const {
      usage,
      features,
      device,
      priority
    } = this.answers;
    if (usage === "blog")
      return "blog";
    if (usage === "cms")
      return "cms";
    if (usage === "collaboration")
      return "collaboration";
    if (usage === "markdown")
      return "markdown";
    if (usage === "note")
      return "note";
    if (usage === "comment")
      return "comment";
    if (features === "ai")
      return "aiEnhanced";
    if (features === "basic" || priority === "performance")
      return "minimal";
    if (device === "mobile")
      return "mobile";
    return "blog";
  }
  /**
   * 显示推荐结果
   */
  showRecommendation(preset) {
    const desc = presetDescriptions[preset];
    const content = document.createElement("div");
    content.style.cssText = "padding: 30px; text-align: center;";
    content.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 16px;">${desc.icon}</div>
      <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 12px;">${desc.name}</h3>
      <p style="font-size: 16px; color: #6b7280; margin-bottom: 24px;">${desc.description}</p>
      <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="font-size: 14px; color: #1e40af;">
          <strong>\u63A8\u8350\u7406\u7531\uFF1A</strong><br>
          \u57FA\u4E8E\u4F60\u7684\u9009\u62E9\uFF0C\u8FD9\u4E2A\u914D\u7F6E\u6700\u9002\u5408\u4F60\u7684\u4F7F\u7528\u573A\u666F\u3002
        </p>
      </div>
    `;
    const buttonGroup = document.createElement("div");
    buttonGroup.style.cssText = "display: flex; gap: 12px; justify-content: center;";
    const applyBtn = this.componentFactory.createButton({
      label: "\u5E94\u7528\u914D\u7F6E",
      type: "primary",
      onClick: () => {
        this.modal?.hide();
        if (this.onComplete)
          this.onComplete(preset);
      }
    });
    const changeBtn = this.componentFactory.createButton({
      label: "\u91CD\u65B0\u9009\u62E9",
      type: "secondary",
      onClick: () => {
        this.currentStep = 0;
        this.answers = {};
        this.renderStep();
      }
    });
    buttonGroup.appendChild(applyBtn);
    buttonGroup.appendChild(changeBtn);
    content.appendChild(buttonGroup);
    this.modal?.setContent(content);
    this.modal?.setFooter(document.createElement("div"));
  }
}
function showConfigWizard(onComplete) {
  const wizard = new ConfigWizard();
  wizard.show(onComplete);
  return wizard;
}

export { ConfigWizard, showConfigWizard };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=ConfigWizard.js.map
