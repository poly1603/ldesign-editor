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
 * Fullscreen plugin
 * Provides fullscreen editing functionality
 */
const FullscreenPlugin = {
    name: 'Fullscreen',
    install(editor) {
        // Register fullscreen toggle command
        editor.commands.register('toggleFullscreen', () => {
            const element = editor.element;
            if (!element)
                return false;
            if (element.classList.contains('fullscreen')) {
                element.classList.remove('fullscreen');
                document.body.style.overflow = '';
            }
            else {
                element.classList.add('fullscreen');
                document.body.style.overflow = 'hidden';
            }
            // Trigger resize event
            window.dispatchEvent(new Event('resize'));
            return true;
        });
        // Add keyboard shortcut
        editor.keymap?.register({
            key: 'F11',
            command: 'toggleFullscreen',
            description: 'Toggle fullscreen',
        });
        console.log('[FullscreenPlugin] Installed');
    },
};

exports.default = FullscreenPlugin;
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=fullscreen.cjs.map
