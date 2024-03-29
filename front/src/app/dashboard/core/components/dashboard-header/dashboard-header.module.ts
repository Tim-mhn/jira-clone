import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TimUIDividerModule } from '@tim-mhn/ng-ui/divider';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { MemberComponentsModule } from '../../../../shared/components/member/member-components.module';
import { SearchModule } from '../../../features/search/search.module';
import { NotificationsModule } from '../../../features/notifications/notifications.module';

@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [
    CommonModule,
    TimUIDropdownMenuModule,
    TimUIDividerModule,
    MemberComponentsModule,
    SearchModule,
    NotificationsModule,
  ],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}
