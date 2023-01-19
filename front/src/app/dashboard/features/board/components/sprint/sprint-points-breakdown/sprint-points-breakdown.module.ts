import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { TimUITooltipModule } from '@tim-mhn/ng-ui/tooltip';
import { SprintPointsBreakdownComponent } from './sprint-points-breakdown.component';

@NgModule({
  declarations: [SprintPointsBreakdownComponent],
  imports: [CommonModule, TimUIChipModule, TimUITooltipModule],
  exports: [SprintPointsBreakdownComponent],
})
export class SprintPointsBreakdownModule {}
