import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { DialogContainerModule } from '../../../../../../shared/components/dialog-container/dialog-container.module';
import { EditSprintDialogComponent } from './edit-sprint-dialog/edit-sprint-dialog.component';
import { EditSprintButtonDirective } from './edit-sprint-button.directive';

@NgModule({
  imports: [
    CommonModule,
    TimUIDialogModule,
    DialogContainerModule,
    ReactiveFormsModule,
    TypedFormsModule,
    TimInputModule,
    TimInputFieldModule,
    TimUIButtonModule,
  ],
  declarations: [EditSprintDialogComponent, EditSprintButtonDirective],
  exports: [EditSprintButtonDirective],
})
export class EditSprintModule {}
