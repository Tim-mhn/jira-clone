import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { Project } from '../../../../core/models/project';
import { Task } from '../../../../core/models/task';

@Component({
  selector: 'jira-task-list-item',
  templateUrl: './task-list-item.component.html',
})
export class TaskListItemComponent implements OnInit, OnChanges {
  @Input() task: Task;
  @Input() project: Project;

  constructor(private tfb: TypedFormBuilder) {}

  titleFc = this.tfb.control('');

  editTitleModeActive = false;

  ngOnInit(): void {}

  ngOnChanges(ch: TypedChanges<TaskListItemComponent>) {
    if (ch.task) {
      this.titleFc.setValue(this.task.Title, { emitEvent: false });
    }
  }

  activateEditMode(event: Event) {
    this.editTitleModeActive = true;
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('document:click')
  cancelEditModeOnDocumentClick() {
    this.editTitleModeActive = false;
  }
}
