import { Component, Inject, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import {
  emailListValidator,
  EMAIL_LIST_INPUT_VALIDATION_ERROR_MESSAGES,
} from '@tim-mhn/ng-forms/email-list-input';
import { TIM_DIALOG_DATA } from '@tim-mhn/ng-ui/dialog';
import { InvitationsController } from '../../../../../invitations/controllers/invitations.controller';

export type AddMembersDialogInput = {
  projectId: string;
};

@Component({
  selector: 'jira-add-members-dialog',
  templateUrl: './add-members-dialog.component.html',
})
export class AddMembersDialogComponent implements OnInit {
  constructor(
    @Inject(TIM_DIALOG_DATA) private dialogData: AddMembersDialogInput,
    private tfb: TypedFormBuilder,
    private controller: InvitationsController
  ) {}

  readonly VALIDATION_ERROR_MESSAGES =
    EMAIL_LIST_INPUT_VALIDATION_ERROR_MESSAGES;

  requestState = new RequestState();
  ngOnInit(): void {}

  membersEmailsControl = this.tfb.control<string[]>(
    [],
    emailListValidator({ required: false })
  );

  sendInvites() {
    const emailList = this.membersEmailsControl.value;
    const { projectId } = this.dialogData;
    this.controller
      .sendProjectInvitations(projectId, emailList, this.requestState)
      .subscribe();
  }
}
