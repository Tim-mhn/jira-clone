import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { BoardUiComponent } from './board-ui.component';
import { BoardBreadcrumbModule } from '../board-breadcrumb/board-breadcrumb.module';
import { TaskListModule } from '../task-list/task-list.module';
import { TaskDetailsModule } from '../task-details/task-details.module';
import { SprintModule } from '../sprint/sprint.module';
import { CreateSprintModule } from '../../../core/components/create-sprint/create-sprint.module';
import { BoardFiltersModule } from '../board-filters/board-filters.module';

@NgModule({
  declarations: [BoardUiComponent],
  imports: [
    CommonModule,
    BoardBreadcrumbModule,
    TaskListModule,
    TaskDetailsModule,
    SprintModule,
    TimUISpinnerModule,
    CreateSprintModule,
    BoardFiltersModule,
  ],
  exports: [BoardUiComponent],
})
export class BoardUiModule {}
