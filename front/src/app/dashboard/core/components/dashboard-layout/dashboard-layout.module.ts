import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DashboardHeaderModule } from '../dashboard-header/dashboard-header.module';
import { SideNavModule } from '../side-nav/side-nav.module';

@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [CommonModule, RouterModule, DashboardHeaderModule, SideNavModule],
})
export class DashboardLayoutModule {}
