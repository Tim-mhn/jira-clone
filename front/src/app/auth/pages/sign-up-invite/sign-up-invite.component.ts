import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { InvitationsController } from '../../../invitations/controllers/invitations.controller';
import { AuthAPI } from '../../apis/auth.api';
import { OnSignUpFn } from '../../components/sign-up-ui/sign-up.component';
import { SignUpForm } from '../../models/sign-up';

@Component({
  selector: 'jira-sign-up-invite',
  templateUrl: './sign-up-invite.component.html',
})
export class SignUpInviteComponent implements OnInit {
  constructor(
    private authAPI: AuthAPI,
    private route: ActivatedRoute,
    private controller: InvitationsController
  ) {}

  projectId: string;

  showSignUpPage = false;

  onSignUpFn: OnSignUpFn = (signupForm: SignUpForm) =>
    this.controller
      .signUpAndAcceptInvitation(signupForm, {
        guestEmail: signupForm.email,
        token: this.token,
      })
      .pipe(tap(() => console.log('SignUpInviteComponent')));

  ngOnInit(): void {
    this.authAPI.me().subscribe({
      next: (u) => {
        const { Email } = u;
        this.controller.acceptInvitationAndNavigateToProject({
          guestEmail: Email,
          token: this.token,
        });
      },
      error: () => {
        // do nothing
        this.showSignUpPage = true;
      },
    });
  }

  private get token() {
    const { token } = this.route.snapshot.queryParams;
    return token;
  }
}
