import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableContainerComponent } from './resizable-container/resizable-container.component';
import { ResizableLeftElementDirective } from './resizable-left-element.directive';
import { ResizableRightElementDirective } from './resizable-right-element.directive';

@NgModule({
  declarations: [
    ResizableContainerComponent,
    ResizableLeftElementDirective,
    ResizableRightElementDirective,
  ],
  imports: [CommonModule],
  exports: [
    ResizableContainerComponent,
    ResizableLeftElementDirective,
    ResizableRightElementDirective,
  ],
})
export class ResizableModule {}
