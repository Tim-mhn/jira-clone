import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState } from '@tim-mhn/common/http';
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

  acceptInvitationRequestState = new RequestState();

  acceptInvitationAndNavigateToProject(signUpForm: SignUpForm) {
    this.showSignUpPage = false;
    const acceptInvitationPayload = {
      email: signUpForm.email,
      token: this.token,
    };
    this.controller
      .acceptInvitationAndNavigateToProject(
        acceptInvitationPayload,
        this.acceptInvitationRequestState
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.authAPI.me().subscribe({
      next: (u) => {
        const { Email } = u;
        const invitationPayload = {
          email: Email,
          token: this.token,
        };
        this.controller
          .acceptInvitationAndNavigateToProject(
            invitationPayload,
            this.acceptInvitationRequestState
          )
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
