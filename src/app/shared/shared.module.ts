import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

@NgModule({
  declarations: [TreeViewComponent],
  imports: [CommonModule],
  exports: [TreeViewComponent],
})
export class SharedModule {}
