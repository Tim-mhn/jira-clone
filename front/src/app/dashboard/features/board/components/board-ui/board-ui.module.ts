import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { BoardUiComponent } from './board-ui.component';
import { TaskListModule } from '../task-list/task-list.module';
import { TaskDetailsModule } from '../task-details/task-details.module';
import { SprintModule } from '../sprint/sprint.module';
import { CreateSprintModule } from '../../../../core/components/create-sprint/create-sprint.module';
import { BoardFiltersModule } from '../board-filters/board-filters.module';
import { FeaturePageContainerModule } from '../../../../core/components/feature-page-container/feature-page-container.module';
import { ResizableModule } from '../../../../../shared/components/resizable/resizable.module';

@NgModule({
  declarations: [BoardUiComponent],
  imports: [
    CommonModule,
    TaskListModule,
    TaskDetailsModule,
    SprintModule,
    TimUISpinnerModule,
    CreateSprintModule,
    BoardFiltersModule,
    FeaturePageContainerModule,
    ResizableModule,
  ],
  exports: [BoardUiComponent],
})
export class BoardUiModule {}
