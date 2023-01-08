import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimTextEditorModule } from '@tim-mhn/ng-forms/text-editor';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimHttpModule } from '@tim-mhn/common/http';
import { TimEditableHeaderInputModule } from '@tim-mhn/ng-forms/editable-header-input';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TaskDetailsComponent } from './task-details.component';
import { TaskAssigneeModule } from '../../../core/components/task-assignee/task-assignee.module';
import { TaskStatusComponentsModule } from '../../../core/components/task-status/task-status.module';
import { TaskEditableTitleComponent } from './task-editable-title/task-editable-title.component';
import { TaskDetailsEditableDescriptionComponent } from './task-details-editable-description/task-details-editable-description.component';
import { TaskPointsChipModule } from '../../../core/components/task-points-chip/task-points-chip.module';

@NgModule({
  declarations: [
    TaskDetailsComponent,
    TaskEditableTitleComponent,
    TaskDetailsEditableDescriptionComponent,
  ],
  imports: [
    CommonModule,
    TaskAssigneeModule,
    TaskStatusComponentsModule,
    TimTextEditorModule,
    TimEditableHeaderInputModule,
    TypedFormsModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TimUISpinnerModule,
    TimHttpModule,
    TaskPointsChipModule,
  ],
  exports: [TaskDetailsComponent],
})
export class TaskDetailsModule {}
