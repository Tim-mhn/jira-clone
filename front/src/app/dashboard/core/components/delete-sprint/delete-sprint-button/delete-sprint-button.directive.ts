import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { SprintInfo } from '../../../models/sprint';
import {
  DeleteSprintDialogComponent,
  DeleteSprintDialogInput,
} from '../delete-sprint-dialog/delete-sprint-dialog.component';

@Directive({
  selector: '[delete-sprint-button]',
})
export class DeleteSprintButtonComponent implements OnInit {
  constructor(private _dialog: TimUIDialogService) {}

  @Input() sprint: SprintInfo;

  ngOnInit(): void {}

  @HostListener('click', ['$event'])
  openWarningDialog(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this._dialog.open<void, DeleteSprintDialogInput>(
      DeleteSprintDialogComponent,
      {
        sprintId: this.sprint?.Id,
        sprintName: this.sprint?.Name,
      }
    );
  }
}
