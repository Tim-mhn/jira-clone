import { Directive, HostListener, Input } from '@angular/core';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { Sprint } from '../../../../../core/models';
import {
  EditSprintDialogComponent,
  EditSprintDialogInput,
} from './edit-sprint-dialog/edit-sprint-dialog.component';

@Directive({
  selector: '[edit-sprint-button]',
})
export class EditSprintButtonDirective {
  constructor(private _dialog: TimUIDialogService) {}

  @Input() sprint: Sprint;

  ngOnInit(): void {}

  @HostListener('click', ['$event'])
  openWarningDialog(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this._dialog.open<void, EditSprintDialogInput>(
      EditSprintDialogComponent,
      this.sprint
    );
  }
}
