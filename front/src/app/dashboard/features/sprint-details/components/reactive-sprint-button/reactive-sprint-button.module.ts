import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { ReactiveSprintButtonComponent } from './reactive-sprint-button.component';

@NgModule({
  declarations: [ReactiveSprintButtonComponent],
  imports: [CommonModule, TimUIButtonModule],
  exports: [ReactiveSprintButtonComponent],
})
export class ReactiveSprintButtonModule {}
