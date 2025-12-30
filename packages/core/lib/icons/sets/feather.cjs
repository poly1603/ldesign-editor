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

var types = require('../types.cjs');

class FeatherIconSet {
  constructor() {
    this.name = "feather";
    this.displayName = "Feather Icons";
    this.version = "4.29.0";
    this.author = "Cole Bemis";
    this.license = "MIT";
    this.icons = /* @__PURE__ */ new Map();
    this.loadIcons();
  }
  /**
   * 加载图标
   * Feather图标集与Lucide高度相似，这里复用Lucide的图标定义
   */
  loadIcons() {
    const iconDefinitions = [
      // 基础格式化
      {
        name: "bold",
        svg: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>',
        category: types.IconCategory.FORMAT
      },
      {
        name: "italic",
        svg: '<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>',
        category: types.IconCategory.FORMAT
      },
      {
        name: "underline",
        svg: '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>',
        category: types.IconCategory.FORMAT
      },
      // 其他常用图标...
      {
        name: "image",
        svg: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
        category: types.IconCategory.MEDIA
      },
      {
        name: "link",
        svg: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
        category: types.IconCategory.EDITOR
      }
    ];
    iconDefinitions.forEach((icon) => {
      this.icons.set(icon.name, icon);
    });
  }
  getIcon(name) {
    return this.icons.get(name) || null;
  }
  getAllIcons() {
    return Array.from(this.icons.values());
  }
  getIconsByCategory(category) {
    return this.getAllIcons().filter((icon) => icon.category === category);
  }
  searchIcons(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllIcons().filter((icon) => icon.name.toLowerCase().includes(lowerQuery) || icon.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
  }
}

exports.FeatherIconSet = FeatherIconSet;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=feather.cjs.map
