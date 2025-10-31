/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Image Plugin - Unified image handling plugin
 * Contains image insertion, context menu, and editing features
 */
/**
 * Image Plugin
 */
const ImagePlugin = {
    name: 'image',
    install(editor) {
        // Use unified context menu from MediaContextMenuPlugin to avoid duplicate bindings
        // Register upload image command (insertImage is handled by MediaDialogPlugin)
        if (!editor.commands.get('uploadImage')) {
            editor.commands.register('uploadImage', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const url = e.target?.result;
                            // Insert image with default left alignment
                            const alt = file.name || 'Image';
                            const html = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;">`;
                            if (typeof editor.insertHTML === 'function')
                                editor.insertHTML(html);
                            else
                                document.execCommand('insertHTML', false, html);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }
        console.log('[ImagePlugin] Loaded');
    },
};

exports.ImagePlugin = ImagePlugin;
exports.default = ImagePlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=image.cjs.map
