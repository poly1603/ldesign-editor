import { Injectable } from '@angular/core'
import { Editor } from '@ldesign/editor-core'
import type { EditorOptions } from '@ldesign/editor-core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class EditorService {
  private editors = new Map<string, Editor>()
  private activeEditorId$ = new BehaviorSubject<string | null>(null)

  createEditor(id: string, options: EditorOptions): Editor {
    const editor = new Editor(options)
    this.editors.set(id, editor)
    this.activeEditorId$.next(id)
    return editor
  }

  getEditor(id: string): Editor | undefined {
    return this.editors.get(id)
  }

  destroyEditor(id: string): void {
    const editor = this.editors.get(id)
    if (editor) {
      editor.destroy()
      this.editors.delete(id)
      if (this.activeEditorId$.value === id) {
        this.activeEditorId$.next(null)
      }
    }
  }

  getActiveEditor(): Editor | undefined {
    const id = this.activeEditorId$.value
    return id ? this.editors.get(id) : undefined
  }

  getActiveEditorId(): Observable<string | null> {
    return this.activeEditorId$.asObservable()
  }

  setActiveEditor(id: string): void {
    if (this.editors.has(id)) {
      this.activeEditorId$.next(id)
    }
  }
}
