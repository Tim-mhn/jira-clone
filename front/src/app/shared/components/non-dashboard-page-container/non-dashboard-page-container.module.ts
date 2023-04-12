import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonDashboardPageContainerComponent } from './non-dashboard-page-container.component';
import { JiraLogoModule } from '../jira-logo/logo.module';

@NgModule({
  declarations: [NonDashboardPageContainerComponent],
  imports: [CommonModule, JiraLogoModule],
  exports: [NonDashboardPageContainerComponent],
})
export class NonDashboardPageContainerModule {}
