import { Component, Inject, OnInit } from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import {
  emailListValidator,
  EMAIL_LIST_INPUT_VALIDATION_ERROR_MESSAGES,
} from '@tim-mhn/ng-forms/email-list-input';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDialogRef, TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { InvitationEmailList } from '../../../models/invitation-email';
import { InvitationsController } from '../../../controllers/invitations.controller';
import { ProjectId } from '../../../../dashboard/core/models';

export type InvitePeopleDialogInput = {
  projectId: ProjectId;
};
@Component({
  selector: 'jira-invite-people-dialog',
  templateUrl: './invite-people-dialog.component.html',
})
export class InvitePeopleDialogComponent implements OnInit {
  readonly EMAIL_LIST_ERROR_MESSAGES =
    EMAIL_LIST_INPUT_VALIDATION_ERROR_MESSAGES;

  constructor(
    @Inject(TIM_DIALOG_DATA) private dialogData: InvitePeopleDialogInput,
    private _dialogRef: TimUIDialogRef,
    private tfb: TypedFormBuilder,
    private controller: InvitationsController
  ) {}

  requestState = new RequestState();

  emailsControl = this.tfb.control<InvitationEmailList>(
    [],
    emailListValidator({ required: true })
  );

  ngOnInit(): void {}

  sendInvites() {
    if (this.emailsControl.invalid) {
      console.error('email list control invalid');
      return;
    }
    const { projectId } = this.dialogData;

    const guestsEmails = this.emailsControl.value;
    this.controller
      .sendProjectInvitations(projectId, guestsEmails, this.requestState)
      .subscribe(() => this._dialogRef.close());
  }
}
