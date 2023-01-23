import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUITooltipModule } from '@tim-mhn/ng-ui/tooltip';
import { MemberIconComponent } from './member-icon.component';

@NgModule({
  declarations: [MemberIconComponent],
  imports: [CommonModule, TimUITooltipModule],
  exports: [MemberIconComponent],
})
export class MemberIconModule {}
