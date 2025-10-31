import { BaseComponent } from '../../../ui/base/BaseComponent';
export interface MediaProperties {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    title?: string;
    caption?: string;
}
export declare class MediaPropertiesDialog extends BaseComponent {
    private properties;
    private onSave?;
    private onCancel?;
    private dialogElement?;
    private overlayElement?;
    constructor(container: HTMLElement);
    show(properties: MediaProperties, onSave: (props: MediaProperties) => void, onCancel?: () => void): void;
    private render;
    private save;
    private cancel;
    private close;
    destroy(): void;
}
export default MediaPropertiesDialog;
