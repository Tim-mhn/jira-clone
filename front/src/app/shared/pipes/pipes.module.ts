import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoLabelPipe } from './time-ago-label.pipe';

@NgModule({
  declarations: [TimeAgoLabelPipe],
  imports: [CommonModule],
  exports: [TimeAgoLabelPipe],
})
export class SharedPipesModule {}
