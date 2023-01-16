import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { SprintSideActionsComponent } from './sprint-side-actions.component';
import { DeleteSprintModule } from '../../../../core/components/delete-sprint/delete-sprint.module';

@NgModule({
  declarations: [SprintSideActionsComponent],
  imports: [
    CommonModule,
    DeleteSprintModule,
    TimUIButtonModule,
    TimUIDropdownMenuModule,
  ],
  exports: [SprintSideActionsComponent],
})
export class SprintSideActionsModule {}
