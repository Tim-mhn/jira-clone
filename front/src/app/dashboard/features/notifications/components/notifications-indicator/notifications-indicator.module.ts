import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { NotificationsIndicatorComponent } from './notifications-indicator.component';

@NgModule({
  declarations: [NotificationsIndicatorComponent],
  imports: [CommonModule, TimUIDropdownMenuModule],
  exports: [NotificationsIndicatorComponent],
})
export class NotificationsIndicatorModule {}
