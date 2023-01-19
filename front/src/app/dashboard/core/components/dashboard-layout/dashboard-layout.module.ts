import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DashboardHeaderModule } from '../dashboard-header/dashboard-header.module';
import { AuthProvidersModule } from '../../../../auth/auth.providers.module';

@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    DashboardHeaderModule,
    AuthProvidersModule,
  ],
})
export class DashboardLayoutModule {}
