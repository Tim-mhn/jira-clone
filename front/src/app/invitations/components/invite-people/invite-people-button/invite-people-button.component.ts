import { Component, Input, OnInit } from '@angular/core';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { ProjectId } from '../../../../dashboard/core/models';
import {
  InvitePeopleDialogComponent,
  InvitePeopleDialogInput,
} from '../invite-people-dialog/invite-people-dialog.component';

@Component({
  selector: 'jira-invite-people-button',
  templateUrl: './invite-people-button.component.html',
})
export class InvitePeopleButtonComponent implements OnInit {
  @Input() projectId: ProjectId;

  constructor(private _dialog: TimUIDialogService) {}

  ngOnInit(): void {}

  openInvitePeopleDialog() {
    this._dialog.open<void, InvitePeopleDialogInput>(
      InvitePeopleDialogComponent,
      {
        projectId: this.projectId,
      }
    );
  }
}
