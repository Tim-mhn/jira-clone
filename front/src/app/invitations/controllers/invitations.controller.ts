import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { AuthController } from '../../auth/controllers/auth.controller';
import { ProjectId } from '../../dashboard/core/models';
import {
  APIErrorResponse,
  MyHttpErrorResponse,
} from '../../shared/errors/api-error';
import { SnackbarFeedbackService } from '../../shared/services/snackbar-feedback.service';
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
    private router: Router,
    private snackbarFeedback: SnackbarFeedbackService
  ) {}

  acceptInvitationAndNavigateToProject(
    dto: AcceptInvitationInputDTO,
    requestState?: RequestState
  ) {
    return this.api.acceptInvitation(dto).pipe(
      switchMap(({ ProjectId: projectId }) =>
        this._navigateToProjectPage(projectId)
      ),
      this.snackbarFeedback.showFeedbackSnackbars<boolean, HttpErrorResponse>(
        {
          errorMessage: (err: MyHttpErrorResponse<APIErrorResponse>) => {
            console.log(err);
            return err.error.Message;
          },
        },
        {
          showLoadingMessage: false,
        }
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
    return this.api.sendInvitation(projectId, emails).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage: 'Invitation emails successfully sent',
        },
        {
          showLoadingMessage: false,
        }
      ),
      this.requestStateController.handleRequest(requestState)
    );
  }
}
