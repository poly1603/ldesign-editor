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

var DOMUtils = require('../utils/DOMUtils.cjs');
var StringUtils = require('../utils/StringUtils.cjs');
var StyleConstants = require('../utils/StyleConstants.cjs');
var UnifiedDialog = require('./UnifiedDialog.cjs');

function showAIDialog(options) {
  const {
    type,
    originalText = "",
    onConfirm,
    onCancel
  } = options;
  let currentTextarea = null;
  let dialogContent = null;
  const getTitle = () => {
    const titles = {
      correct: "AI \u7EA0\u9519",
      complete: "AI \u8865\u5168",
      continue: "AI \u7EED\u5199",
      rewrite: "AI \u91CD\u5199",
      suggest: "AI \u5EFA\u8BAE"
    };
    return titles[type] || "AI \u52A9\u624B";
  };
  const createLoadingContent = () => {
    const content = DOMUtils.createElement("div");
    const messages = {
      correct: "AI \u6B63\u5728\u5206\u6790\u6587\u672C\u4E2D\u7684\u9519\u8BEF...",
      complete: "AI \u6B63\u5728\u751F\u6210\u8865\u5168\u5185\u5BB9...",
      continue: "AI \u6B63\u5728\u7EED\u5199\u6587\u672C...",
      rewrite: "AI \u6B63\u5728\u91CD\u5199\u6587\u672C...",
      suggest: "AI \u6B63\u5728\u751F\u6210\u5EFA\u8BAE..."
    };
    content.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="loading-spinner" style="
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 3px solid #f0f0f0;
          border-top: 3px solid #409EFF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          ${messages[type]}
        </p>
        ${originalText ? `
          <div style="margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px; text-align: left;">
            <strong style="color: #333;">\u539F\u6587\uFF1A</strong>
            <p style="margin: 10px 0 0 0; color: #666; line-height: 1.5;">
              ${StringUtils.escapeHTML(originalText).substring(0, 200)}${originalText.length > 200 ? "..." : ""}
            </p>
          </div>
        ` : ""}
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    return content;
  };
  const createResultContent = (result, original) => {
    const content = DOMUtils.createElement("div", {
      style: "max-height: 500px; overflow-y: auto;"
    });
    if (type === "correct" && original) {
      const diffHTML = generateDiffHTML(original, result);
      content.innerHTML = `
        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
          AI \u5DF2\u5B8C\u6210\u7EA0\u9519\uFF0C<span style="color: #f56c6c; font-weight: bold;">\u7EA2\u8272\u5220\u9664\u7EBF</span>\u8868\u793A\u9519\u8BEF\uFF0C
          <span style="color: #67c23a; font-weight: bold;">\u7EFF\u8272</span>\u8868\u793A\u4FEE\u6B63\u5185\u5BB9\uFF1A
        </p>
        <div style="background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-bottom: 15px;">
          <div style="line-height: 1.8; font-size: 14px;">
            ${diffHTML}
          </div>
        </div>
      `;
    } else {
      content.innerHTML = `
        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
          AI \u751F\u6210\u7684\u5185\u5BB9\u5982\u4E0B\uFF0C\u60A8\u53EF\u4EE5\u7F16\u8F91\u540E\u786E\u8BA4\u4F7F\u7528\uFF1A
        </p>
      `;
    }
    const textareaContainer = DOMUtils.createElement("div", {
      style: "margin-top: 15px"
    });
    textareaContainer.style.marginTop = "15px";
    textareaContainer.innerHTML = `
      <p style="margin-bottom: 8px; font-size: 14px; color: #666;">
        ${type === "correct" ? "\u7EA0\u6B63\u540E\u7684\u6587\u672C" : "\u751F\u6210\u7684\u6587\u672C"}\uFF08\u53EF\u7EE7\u7EED\u7F16\u8F91\uFF09\uFF1A
      </p>
    `;
    const textarea = DOMUtils.createElement("textarea", {
      value: result,
      style: StyleConstants.CommonStyles.textarea
    });
    currentTextarea = textarea;
    textareaContainer.appendChild(textarea);
    content.appendChild(textareaContainer);
    return content;
  };
  const createErrorContent = (error) => {
    const content = DOMUtils.createElement("div");
    content.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#f56c6c" style="margin-bottom: 15px;">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p style="color: #f56c6c; font-weight: bold; margin-bottom: 10px;">\u64CD\u4F5C\u5931\u8D25</p>
        <p style="color: #666; font-size: 14px;">${StringUtils.escapeHTML(error)}</p>
      </div>
    `;
    return content;
  };
  dialogContent = createLoadingContent();
  UnifiedDialog.showUnifiedDialog({
    title: getTitle(),
    content: dialogContent,
    showCancel: true,
    confirmText: "\u7B49\u5F85\u4E2D...",
    cancelText: "\u53D6\u6D88",
    width: type === "correct" ? "700px" : "600px",
    confirmDisabled: true,
    onConfirm: () => {
      if (currentTextarea) {
        const text = currentTextarea.value.trim();
        if (text)
          onConfirm(text);
      }
    },
    onCancel
  });
  return {
    updateResult: (result, original) => {
      const resultContent = createResultContent(result, original || originalText);
      const dialogBody = DOMUtils.$(".unified-dialog-body");
      if (dialogBody) {
        dialogBody.innerHTML = "";
        dialogBody.appendChild(resultContent);
      }
      const confirmBtn = DOMUtils.$(".unified-dialog-confirm");
      if (confirmBtn) {
        confirmBtn.textContent = type === "correct" ? "\u5E94\u7528\u7EA0\u6B63" : "\u4F7F\u7528";
        confirmBtn.disabled = false;
      }
      setTimeout(() => {
        currentTextarea?.focus();
      }, 100);
    },
    showError: (error) => {
      const errorContent = createErrorContent(error);
      const dialogBody = DOMUtils.$(".unified-dialog-body");
      if (dialogBody) {
        dialogBody.innerHTML = "";
        dialogBody.appendChild(errorContent);
      }
      const confirmBtn = DOMUtils.$(".unified-dialog-confirm");
      if (confirmBtn) {
        confirmBtn.textContent = "\u5173\u95ED";
        confirmBtn.disabled = false;
      }
    },
    close: () => {
      const closeBtn = DOMUtils.$(".unified-dialog-close");
      closeBtn?.click();
    }
  };
}
function generateDiffHTML(original, corrected) {
  if (original === corrected)
    return `<span style="color: #666;">${StringUtils.escapeHTML(original)}</span>`;
  const patterns = [{
    from: /的地得/g,
    to: "\u7684"
  }, {
    from: /在哪/g,
    to: "\u5728\u90A3"
  }, {
    from: /因该/g,
    to: "\u5E94\u8BE5"
  }, {
    from: /既使/g,
    to: "\u5373\u4F7F"
  }];
  let html = StringUtils.escapeHTML(original);
  let hasChanges = false;
  for (const pattern of patterns) {
    if (pattern.from.test(original)) {
      hasChanges = true;
      html = html.replace(pattern.from, (match) => {
        return `<span style="text-decoration: line-through; color: #f56c6c; background: #ffe6e6; padding: 2px 4px; border-radius: 2px;">${match}</span>
        <span style="color: #67c23a; background: #e6ffe6; padding: 2px 4px; border-radius: 2px; font-weight: bold; margin-left: 5px;">${pattern.to}</span>`;
      });
    }
  }
  if (!hasChanges && original !== corrected) {
    return `
      <div><strong>\u539F\u6587\uFF1A</strong> <span style="color: #999; text-decoration: line-through;">${StringUtils.escapeHTML(original)}</span></div>
      <div style="margin-top: 10px;"><strong>\u7EA0\u6B63\u540E\uFF1A</strong> <span style="color: #67c23a;">${StringUtils.escapeHTML(corrected)}</span></div>
    `;
  }
  return html;
}
const AIMockUtils = {
  // 模拟纠错
  mockCorrect: (text) => {
    return text.replace(/的地得/g, "\u7684").replace(/在哪/g, "\u5728\u90A3").replace(/因该/g, "\u5E94\u8BE5").replace(/既使/g, "\u5373\u4F7F").replace(/偶而/g, "\u5076\u5C14");
  },
  // 模拟补全
  mockComplete: (context) => {
    const completions = ["\u7684\u91CD\u8981\u7EC4\u6210\u90E8\u5206", "\u5177\u6709\u91CD\u8981\u610F\u4E49", "\u53D1\u6325\u7740\u5173\u952E\u4F5C\u7528", "\u4EA7\u751F\u4E86\u6DF1\u8FDC\u5F71\u54CD"];
    return completions[Math.floor(Math.random() * completions.length)];
  },
  // 模拟续写
  mockContinue: (context) => {
    return "\n\n\u8FD9\u4E00\u521B\u65B0\u6027\u7684\u89E3\u51B3\u65B9\u6848\u4E0D\u4EC5\u63D0\u9AD8\u4E86\u6548\u7387\uFF0C\u8FD8\u5E26\u6765\u4E86\u66F4\u597D\u7684\u7528\u6237\u4F53\u9A8C\u3002\u901A\u8FC7\u6301\u7EED\u4F18\u5316\u548C\u6539\u8FDB\uFF0C\u6211\u4EEC\u76F8\u4FE1\u672A\u6765\u4F1A\u6709\u66F4\u5927\u7684\u53D1\u5C55\u7A7A\u95F4\u3002";
  },
  // 模拟重写
  mockRewrite: (text) => {
    return `[\u4F18\u5316\u540E] ${text}

\u6B64\u5185\u5BB9\u7ECF\u8FC7\u4E13\u4E1A\u6DA6\u8272\uFF0C\u8BED\u8A00\u66F4\u52A0\u7CBE\u7EC3\uFF0C\u8868\u8FBE\u66F4\u52A0\u51C6\u786E\u3002`;
  }
};

exports.AIMockUtils = AIMockUtils;
exports.showAIDialog = showAIDialog;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=AIDialog.cjs.map
