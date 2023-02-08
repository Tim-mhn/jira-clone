import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimDateModule } from '@tim-mhn/common/date';
import { TimUICardModule } from '@tim-mhn/ng-ui/card';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { SprintDetailsUiComponent } from './sprint-details-ui.component';
import { FeaturePageContainerModule } from '../../../../core/components/feature-page-container/feature-page-container.module';
import { EditSprintModule } from '../../../board/components/sprint/edit-sprint/edit-sprint.module';
import { CompleteSprintButtonModule } from '../../../board/components/sprint/complete-sprint-button/complete-sprint-button.module';
import { SprintPointsBreakdownModule } from '../../../board/components/sprint/sprint-points-breakdown/sprint-points-breakdown.module';
import { SprintStatusTagModule } from '../sprint-status-tag/sprint-status-tag.module';
import { ReactiveSprintButtonModule } from '../reactive-sprint-button/reactive-sprint-button.module';

@NgModule({
  declarations: [SprintDetailsUiComponent],
  imports: [
    CommonModule,
    FeaturePageContainerModule,
    EditSprintModule,
    TimDateModule,
    CompleteSprintButtonModule,
    SprintPointsBreakdownModule,
    TimUICardModule,
    SprintStatusTagModule,
    ReactiveSprintButtonModule,
    EditSprintModule,
    TimUIButtonModule,
  ],
  exports: [SprintDetailsUiComponent],
})
export class SprintDetailsUiModule {}
