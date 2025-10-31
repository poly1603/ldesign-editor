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
export default FullscreenPlugin;
//# sourceMappingURL=fullscreen.js.map