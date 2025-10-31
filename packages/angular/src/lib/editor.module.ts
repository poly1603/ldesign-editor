import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EditorComponent } from './components/editor.component'
import { EditorService } from './services/editor.service'

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule],
  exports: [EditorComponent],
  providers: [EditorService],
})
export class EditorModule {}
