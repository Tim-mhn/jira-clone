import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimUIDialogRef } from '@tim-mhn/ng-ui/dialog';
import { filter } from 'rxjs';
import { ProjectListController } from '../../../controllers/project-list.controller';
import { suggestProjectKeyFromName } from '../utils/suggest-project-key.util';

@Component({
  selector: 'jira-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
})
export class CreateProjectDialogComponent implements OnInit {
  constructor(
    private _dialogRef: TimUIDialogRef,
    private tfb: TypedFormBuilder,
    private controller: ProjectListController
  ) {}

  ngOnInit(): void {
    this._suggestKeyOnProjectNameChanges();
  }

  requestState = new RequestState();

  newProjectForm = this.tfb.group({
    name: this.tfb.control('', Validators.required),
    key: this.tfb.control('', Validators.required),
  });

  createProject() {
    if (this.newProjectForm.invalid) {
      console.error('project form invalid. Not calling endpoint');
      return;
    }

    this.controller
      .createProjectAndUpdateList(this.newProjectForm.value, this.requestState)
      .subscribe(() => this._closeDialog());
  }

  private _suggestKeyOnProjectNameChanges() {
    this.nameControl.valueChanges
      .pipe(filter(() => !this.keyControl.touched))
      .subscribe((name) => {
        const keySuggestion = suggestProjectKeyFromName(name);
        this.keyControl.setValue(keySuggestion);
      });
  }

  private get nameControl() {
    return this.newProjectForm.controls.name;
  }

  private get keyControl() {
    return this.newProjectForm.controls.key;
  }

  private _closeDialog() {
    this._dialogRef.close();
  }
}
