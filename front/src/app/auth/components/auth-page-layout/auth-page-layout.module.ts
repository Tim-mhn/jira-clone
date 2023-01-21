import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUICardModule } from '@tim-mhn/ng-ui/card';
import { RouterModule } from '@angular/router';
import { AuthPageLayoutComponent } from './auth-page-layout.component';
import { JiraLogoModule } from '../../../shared/components/jira-logo/logo.module';

@NgModule({
  declarations: [AuthPageLayoutComponent],
  imports: [CommonModule, TimUICardModule, JiraLogoModule, RouterModule],
  exports: [AuthPageLayoutComponent],
})
export class AuthPageLayoutModule {}
