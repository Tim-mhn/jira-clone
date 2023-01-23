import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestState } from '@tim-mhn/common/http';
import { LoggedInUserService } from '../../../dashboard/core/state-services/logged-in-user.service';
import { InvitationsController } from '../../../invitations/controllers/invitations.controller';
import { AcceptInvitationInputDTO } from '../../../invitations/dtos/invitations.dtos';
import { AuthController } from '../../controllers/auth.controller';
import { SignUpForm } from '../../models/sign-up';

@Component({
  selector: 'jira-sign-up-invite',
  templateUrl: './sign-up-invite.component.html',
})
export class SignUpInviteComponent implements OnInit {
  constructor(
    private authController: AuthController,
    private route: ActivatedRoute,
    private controller: InvitationsController,
    private loggedInUserService: LoggedInUserService
  ) {}

  projectId: string;

  showSignUpPage = false;

  isLoggedIn$ = this.loggedInUserService.isLoggedIn$;

  acceptInvitationRequestState = new RequestState();

  acceptInvitationAfterSignUp(signUpForm: SignUpForm) {
    this.showSignUpPage = false;
    const acceptInvitationPayload = {
      email: signUpForm.email,
      token: this.token,
    };
    this._acceptInvitationAndGoToProjectPage(acceptInvitationPayload);
  }

  private _acceptInvitationAndGoToProjectPage(
    invitationPayload: AcceptInvitationInputDTO
  ) {
    this.showSignUpPage = false;
    this.controller
      .acceptInvitationAndNavigateToProject(
        invitationPayload,
        this.acceptInvitationRequestState
      )
      .subscribe({});
  }

  ngOnInit(): void {
    this.authController.fetchAndUpdateCurrentUser().subscribe({
      next: (u) => {
        const { Email } = u;
        const invitationPayload = {
          email: Email,
          token: this.token,
        };
        this._acceptInvitationAndGoToProjectPage(invitationPayload);
      },
      error: () => {
        // do nothing
        console.log('show sign up');
        this.showSignUpPage = true;
      },
    });
  }

  private get token() {
    const { token } = this.route.snapshot.queryParams;
    return token;
  }
}
