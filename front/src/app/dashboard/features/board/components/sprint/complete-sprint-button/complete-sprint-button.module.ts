import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { CompleteSprintButtonComponent } from './complete-sprint-button.component';

@NgModule({
  declarations: [CompleteSprintButtonComponent],
  imports: [CommonModule, TimUIButtonModule],
  exports: [CompleteSprintButtonComponent],
})
export class CompleteSprintButtonModule {}
