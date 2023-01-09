import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../core/models/project';
import { Sprint } from '../../../core/models/sprint';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'jira-sprint',
  templateUrl: './sprint.component.html',
})
export class SprintComponent implements OnInit {
  @Input() sprint: Sprint;
  @Input() tasks: Task[];
  @Input() project: Project;

  constructor() {}

  ngOnInit(): void {}
}
