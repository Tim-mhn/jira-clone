import { Component, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { CreateProjectDialogComponent } from '../create-project-dialog/create-project-dialog.component';

@Component({
  selector: 'jira-create-project-button',
  templateUrl: './create-project-button.component.html',
})
export class CreateProjectButtonComponent implements OnInit {
  readonly PLUS_ICON = ICONS.PLUS_WHITE;
  constructor(private _dialog: TimUIDialogService) {}

  ngOnInit(): void {}

  openDialog() {
    this._dialog.open(CreateProjectDialogComponent);
  }
}
