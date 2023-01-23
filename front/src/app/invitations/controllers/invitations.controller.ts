import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { ProjectId } from '../../dashboard/core/models';
import { APIErrorMapper } from '../../shared/errors/api-error.mapper';
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
    private errorMapper: APIErrorMapper,
    private requestStateController: RequestStateController,
    private router: Router,
    private snackbarFeedback: SnackbarFeedbackService
  ) {}

  acceptInvitationAndNavigateToProject(
    dto: AcceptInvitationInputDTO,
    requestState?: RequestState
  ) {
    return this.api.acceptInvitation(dto).pipe(
      this.errorMapper.mapToErrorMessage,
      switchMap((res) => this._navigateToProjectPage(res?.ProjectId)),
      this.snackbarFeedback.showFeedbackSnackbars<boolean, HttpErrorResponse>(
        {
          successMessage: "You've successfully joined the project",
        },
        {
          showLoadingMessage: false,
          showErrorMessage: false,
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
      this.errorMapper.mapToErrorMessage,
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
