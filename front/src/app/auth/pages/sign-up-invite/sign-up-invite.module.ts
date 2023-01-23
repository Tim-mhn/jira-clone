import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimUISnackbarModule } from '@tim-mhn/ng-ui/snackbar';
import { TimUICardModule } from '@tim-mhn/ng-ui/card';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TimUIAlertModule } from '@tim-mhn/ng-ui/alert';
import { TimUILinkModule } from '@tim-mhn/ng-ui/link';
import { SignUpInviteComponent } from './sign-up-invite.component';
import { ProjectInvitationsProvidersModule } from '../../../invitations/invitations.providers.module';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { JiraLogoModule } from '../../../shared/components/jira-logo/logo.module';
import { SignUpFormModule } from '../../components/sign-up-form/sign-up-form.module';
import { AuthDirectivesModule } from '../../directives/auth-directives.module';

const routes: Routes = [
  {
    path: '',
    component: SignUpInviteComponent,
  },
];

@NgModule({
  declarations: [SignUpInviteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProjectInvitationsProvidersModule,
    SignUpFormModule,
    AuthDirectivesModule,
    JiraLogoModule,
    TimUISnackbarModule,
    TimUICardModule,
    TimUIAlertModule,
    TimUISpinnerModule,
    TimUILinkModule,
  ],
  providers: [SnackbarFeedbackService],
})
export class SignUpInviteModule {}
