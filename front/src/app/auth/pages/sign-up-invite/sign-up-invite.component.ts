import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationsController } from '../../../invitations/controllers/invitations.controller';
import { AuthAPI } from '../../apis/auth.api';
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

  acceptInvitationAndNavigateToProject(signUpForm: SignUpForm) {
    this.controller.acceptInvitationAndNavigateToProject({
      email: signUpForm.email,
      token: this.token,
    });
  }

  ngOnInit(): void {
    this.authAPI.me().subscribe({
      next: (u) => {
        const { Email } = u;
        this.controller
          .acceptInvitationAndNavigateToProject({
            email: Email,
            token: this.token,
          })
          .subscribe();
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
