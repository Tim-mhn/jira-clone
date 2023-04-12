import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUICardModule } from '@tim-mhn/ng-ui/card';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from './auth-page-layout.component';
import { NonDashboardPageContainerModule } from '../../../shared/components/non-dashboard-page-container/non-dashboard-page-container.module';

@NgModule({
  declarations: [AuthPageLayoutComponent],
  imports: [
    CommonModule,
    TimUICardModule,
    NonDashboardPageContainerModule,
    RouterModule,
  ],
  exports: [AuthPageLayoutComponent],
})
export class AuthPageLayoutModule {}
