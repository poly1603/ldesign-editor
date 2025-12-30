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

Object.defineProperty(exports, '__esModule', { value: true });

var AIService = require('../../ai/AIService.cjs');
var Plugin = require('../../core/Plugin.cjs');
var AIConfigDialog = require('../../ui/AIConfigDialog.cjs');
var AIDialog = require('../../ui/AIDialog.cjs');
var EditorUtils = require('../../utils/EditorUtils.cjs');

function createAICommand(type) {
  return (state, dispatch) => {
    console.log(`[AIPlugin] Executing ai-${type} command`);
    const editor = window.editor;
    if (!editor)
      return false;
    const aiService = AIService.getAIService();
    let selectedText = "";
    let savedRange = null;
    if (type === "correct" || type === "rewrite") {
      selectedText = editor.getSelectedText ? editor.getSelectedText() : EditorUtils.getSelectedText();
      if (!selectedText) {
        alert(`\u8BF7\u5148\u9009\u62E9\u8981${type === "correct" ? "\u7EA0\u9519" : "\u91CD\u5199"}\u7684\u6587\u672C`);
        return false;
      }
    } else if (type === "complete" || type === "continue") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const textContent = container.textContent || "";
        const offset = range.startOffset;
        selectedText = textContent.substring(Math.max(0, offset - 100), offset);
      }
    }
    savedRange = EditorUtils.saveRange();
    const dialogHandle = AIDialog.showAIDialog({
      type,
      originalText: selectedText,
      onConfirm: (text) => {
        if (editor.contentElement) {
          editor.contentElement.focus();
          EditorUtils.replaceSelection(text, savedRange);
          editor.handleInput?.();
        }
      }
    });
    if (!aiService.getConfig().providers.deepseek?.apiKey) {
      setTimeout(() => {
        let mockResult = "";
        switch (type) {
          case "correct":
            mockResult = AIDialog.AIMockUtils.mockCorrect(selectedText);
            break;
          case "complete":
            mockResult = AIDialog.AIMockUtils.mockComplete(selectedText);
            break;
          case "continue":
            mockResult = AIDialog.AIMockUtils.mockContinue(selectedText);
            break;
          case "rewrite":
            mockResult = AIDialog.AIMockUtils.mockRewrite(selectedText);
            break;
        }
        dialogHandle.updateResult(mockResult, selectedText);
      }, 1e3);
    } else {
      const apiMethod = type === "correct" ? aiService.correct : type === "complete" ? aiService.complete : type === "continue" ? aiService.continue : aiService.rewrite;
      apiMethod.call(aiService, selectedText).then((response) => {
        if (response.success && response.text)
          dialogHandle.updateResult(response.text, selectedText);
        else
          dialogHandle.showError(response.error || `AI ${type} \u5931\u8D25`);
      }).catch((error) => {
        console.error(`[AIPlugin] AI ${type} failed:`, error);
        dialogHandle.showError(`AI ${type} \u8BF7\u6C42\u5931\u8D25`);
      });
    }
    return true;
  };
}
const aiPluginConfig = {
  name: "ai",
  commands: {
    "ai-correct": createAICommand("correct"),
    "ai-complete": createAICommand("complete"),
    "ai-continue": createAICommand("continue"),
    "ai-rewrite": createAICommand("rewrite"),
    "ai-config": (state, dispatch) => {
      console.log("[AIPlugin] Opening AI config");
      const editor = window.editor;
      if (!editor)
        return false;
      const aiService = AIService.getAIService();
      AIConfigDialog.showAIConfigDialog(editor, aiService.getConfig(), (config) => {
        aiService.updateConfig(config);
        console.log("[AIPlugin] AI config updated");
      });
      return true;
    }
  },
  init(editor) {
    console.log("[AIPlugin] Initializing AI plugin");
    const aiService = AIService.getAIService();
    editor.ai = aiService;
    console.log("[AIPlugin] AI service attached to editor");
    console.log("[AIPlugin] Commands registered:", Object.keys(aiPluginConfig.commands || {}));
  }
};
const AIPlugin = Plugin.createPlugin(aiPluginConfig);

exports.default = AIPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=AIPluginV2.cjs.map
