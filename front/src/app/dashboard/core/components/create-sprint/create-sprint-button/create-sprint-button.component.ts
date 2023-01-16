import { Component, OnInit } from '@angular/core';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { CreateSprintDialogComponent } from '../create-sprint-dialog/create-sprint-dialog.component';

@Component({
  selector: 'jira-create-sprint-button',
  templateUrl: './create-sprint-button.component.html',
})
export class CreateSprintButtonComponent implements OnInit {
  constructor(private _dialog: TimUIDialogService) {}

  ngOnInit(): void {}

  onCreateSprintDialog() {
    this._dialog.open(CreateSprintDialogComponent);
  }
}
