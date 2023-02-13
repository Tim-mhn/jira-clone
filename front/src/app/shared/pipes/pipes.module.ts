import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoLabelPipe } from './time-ago-label.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

@NgModule({
  declarations: [TimeAgoLabelPipe, SanitizeHtmlPipe],
  imports: [CommonModule],
  exports: [TimeAgoLabelPipe, SanitizeHtmlPipe],
})
export class SharedPipesModule {}
