import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TimUIAlertModule } from '@tim-mhn/ng-ui/alert';
import { DeleteSprintButtonComponent } from './delete-sprint-button/delete-sprint-button.directive';
import { DeleteSprintDialogComponent } from './delete-sprint-dialog/delete-sprint-dialog.component';

@NgModule({
  declarations: [DeleteSprintButtonComponent, DeleteSprintDialogComponent],
  imports: [
    CommonModule,
    TimUIButtonModule,
    TimUIDialogModule,
    TimUIAlertModule,
  ],
  exports: [DeleteSprintButtonComponent],
})
export class DeleteSprintModule {}
