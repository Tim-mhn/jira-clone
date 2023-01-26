import { Component, Input, OnInit } from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { ProjectListController } from '../../../../features/project-list/controllers/project-list.controller';
import { ProjectInfo } from '../../../models';
import {
  DeleteProjectDialogComponent,
  DeleteProjectDialogInput,
  DeleteProjectDialogOutput,
} from '../delete-project-dialog/delete-project-dialog.component';

@Component({
  selector: 'jira-delete-project-button',
  templateUrl: './delete-project-button.component.html',
})
export class DeleteProjectButtonComponent implements OnInit {
  @Input() project: ProjectInfo;

  requestState = new RequestState();
  constructor(
    private controller: ProjectListController,
    private _dialogService: TimUIDialogService
  ) {}

  ngOnInit(): void {}

  openDeleteDialog() {
    const deleteDialog = this._dialogService.open<
      DeleteProjectDialogOutput,
      DeleteProjectDialogInput
    >(DeleteProjectDialogComponent, this.project);

    deleteDialog.closed$.subscribe((output) => {
      if (output?.delete)
        this.controller
          .deleteProjectAndUpdateList(this.project, this.requestState)
          .subscribe();
    });
  }
}
