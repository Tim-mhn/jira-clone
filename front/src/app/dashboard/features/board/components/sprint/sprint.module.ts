import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimDateModule } from '@tim-mhn/common/date';
import { SprintComponent } from './sprint.component';
import { TaskListModule } from '../task-list/task-list.module';
import { CreateTaskRowModule } from './create-task-row/create-task-row.module';
import { SprintPointsBreakdownModule } from './sprint-points-breakdown/sprint-points-breakdown.module';
import { SprintSideActionsModule } from './sprint-side-actions/sprint-side-actions.module';
import { CompleteSprintButtonModule } from './complete-sprint-button/complete-sprint-button.module';

@NgModule({
  declarations: [SprintComponent],
  imports: [
    CommonModule,
    TaskListModule,
    CreateTaskRowModule,
    SprintPointsBreakdownModule,
    SprintSideActionsModule,
    CompleteSprintButtonModule,
    TimDateModule,
  ],
  exports: [SprintComponent],
})
export class SprintModule {}
