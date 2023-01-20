import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { AuthController } from '../../auth/controllers/auth.controller';
import { SignUpDTO } from '../../auth/dtos/sign-up.dto';
import { ProjectId } from '../../dashboard/core/models';
import { InvitationsAPI } from '../apis/invitations.api';
import { AcceptInvitationInputDTO } from '../dtos/invitations.dtos';
import { ProjectInvitationsProvidersModule } from '../invitations.providers.module';
import { InvitationEmailList } from '../models/invitation-email';

@Injectable({
  providedIn: ProjectInvitationsProvidersModule,
})
export class InvitationsController {
  constructor(
    private api: InvitationsAPI,
    private authController: AuthController,
    private requestStateController: RequestStateController,
    private router: Router
  ) {}

  acceptInvitationAndNavigateToProject(
    dto: AcceptInvitationInputDTO,
    requestState?: RequestState
  ) {
    return this.api.acceptInvitation(dto).pipe(
      switchMap(({ ProjectId: projectId }) =>
        this._navigateToProjectPage(projectId)
      ),
      this.requestStateController.handleRequest(requestState)
    );
  }

  signUpAndAcceptInvitation(
    credentials: SignUpDTO,
    invitation: AcceptInvitationInputDTO,
    requestState?: RequestState
  ) {
    return this.authController.signUpAndLogin(credentials).pipe(
      switchMap(() => this.api.acceptInvitation(invitation)),
      switchMap(({ ProjectId: projectId }) =>
        this._navigateToProjectPage(projectId)
      ),
      this.requestStateController.handleRequest(requestState)
    );
  }

  private _navigateToProjectPage(projectId: string) {
    return this.router.navigate(['projects', projectId]);
  }

  sendProjectInvitations(
    projectId: ProjectId,
    emails: InvitationEmailList,
    requestState?: RequestState
  ) {
    return this.api
      .sendInvitation(projectId, emails)
      .pipe(this.requestStateController.handleRequest(requestState));
  }
}
