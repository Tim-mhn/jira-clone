import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpInviteComponent } from './sign-up-invite.component';
import { ProjectInvitationsProvidersModule } from '../../../invitations/invitations.providers.module';
import { SignUpUIModule } from '../../components/sign-up-ui/sign-up.module';

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
    SignUpUIModule,
  ],
})
export class SignUpInviteModule {}
