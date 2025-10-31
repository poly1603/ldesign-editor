import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { Editor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'

@Component({
  selector: 'ldesign-editor',
  template: `
    <div #editorContainer class="ldesign-editor-container"></div>
  `,
  styles: [`
    .ldesign-editor-container {
      min-height: 200px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>

  @Input() content = ''
  @Input() editable = true
  @Input() plugins: string[] = []
  @Input() options: Partial<EditorOptions> = {}

  @Output() contentChange = new EventEmitter<string>()
  @Output() update = new EventEmitter<string>()

  private editorInstance: Editor | null = null

  ngOnInit(): void {
    this.editorInstance = new Editor({
      element: this.editorContainer.nativeElement,
      content: this.content,
      editable: this.editable,
      plugins: this.plugins,
      ...this.options,
    })

    this.editorInstance.on('update', () => {
      if (this.editorInstance) {
        const html = this.editorInstance.getContent()
        this.contentChange.emit(html)
        this.update.emit(html)
      }
    })
  }

  ngOnDestroy(): void {
    this.editorInstance?.destroy()
  }

  ngOnChanges(): void {
    if (this.editorInstance && this.content !== undefined) {
      const currentContent = this.editorInstance.getContent()
      if (currentContent !== this.content) {
        this.editorInstance.setContent(this.content)
      }
    }
  }

  getEditor(): Editor | null {
    return this.editorInstance
  }
}
