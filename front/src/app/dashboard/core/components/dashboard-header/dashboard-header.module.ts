import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './dashboard-header.component';

@NgModule({
  declarations: [DashboardHeaderComponent],
  imports: [CommonModule],
  exports: [DashboardHeaderComponent],
})
export class DashboardHeaderModule {}
