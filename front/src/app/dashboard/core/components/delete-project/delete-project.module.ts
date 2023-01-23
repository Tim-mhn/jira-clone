import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { DeleteProjectButtonComponent } from './delete-project-button/delete-project-button.component';
import { DeleteProjectDialogComponent } from './delete-project-dialog/delete-project-dialog.component';
import { DialogContainerModule } from '../../../../shared/components/dialog-container/dialog-container.module';

@NgModule({
  declarations: [DeleteProjectButtonComponent, DeleteProjectDialogComponent],
  imports: [
    CommonModule,
    TimUIButtonModule,
    TimUIDialogModule,
    DialogContainerModule,
  ],
  exports: [DeleteProjectButtonComponent],
})
export class DeleteProjectModule {}
