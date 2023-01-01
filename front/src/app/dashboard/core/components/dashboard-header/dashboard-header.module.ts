import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { MemberIconModule } from '../../../../shared/components/member-icon/member-icon.module';

@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [CommonModule, MemberIconModule],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}
