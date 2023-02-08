import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { SprintStatusTagComponent } from './sprint-status-tag.component';

@NgModule({
  declarations: [SprintStatusTagComponent],
  imports: [CommonModule, TimUIChipModule],
  exports: [SprintStatusTagComponent],
})
export class SprintStatusTagModule {}
