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

var Plugin = require('../../core/Plugin.cjs');

const toggleBulletList = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("insertUnorderedList", false);
  return true;
};
const toggleOrderedList = (state, dispatch) => {
  if (!dispatch)
    return true;
  document.execCommand("insertOrderedList", false);
  return true;
};
function isListActive(listType) {
  return () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return false;
    let node = selection.anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName === listType)
        return true;
      node = node.parentNode;
    }
    return false;
  };
}
const BulletListPlugin = Plugin.createPlugin({
  name: "bulletList",
  commands: {
    toggleBulletList
  },
  keys: {
    "Mod-Shift-8": toggleBulletList
  },
  toolbar: [{
    name: "bulletList",
    title: "\u65E0\u5E8F\u5217\u8868",
    icon: "list",
    command: toggleBulletList,
    active: isListActive("UL")
  }]
});
const OrderedListPlugin = Plugin.createPlugin({
  name: "orderedList",
  commands: {
    toggleOrderedList
  },
  keys: {
    "Mod-Shift-7": toggleOrderedList
  },
  toolbar: [{
    name: "orderedList",
    title: "\u6709\u5E8F\u5217\u8868",
    icon: "list-ordered",
    command: toggleOrderedList,
    active: isListActive("OL")
  }]
});
const TaskListPlugin = Plugin.createPlugin({
  name: "taskList",
  commands: {
    toggleTaskList: (state, dispatch) => {
      if (!dispatch)
        return true;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0)
        return false;
      const range = selection.getRangeAt(0);
      const li = document.createElement("li");
      li.innerHTML = '<input type="checkbox"> ';
      range.insertNode(li);
      return true;
    }
  },
  toolbar: [{
    name: "taskList",
    title: "\u4EFB\u52A1\u5217\u8868",
    icon: "list-checks",
    command: (state, dispatch) => true
  }]
});

exports.BulletListPlugin = BulletListPlugin;
exports.OrderedListPlugin = OrderedListPlugin;
exports.TaskListPlugin = TaskListPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=list.cjs.map
