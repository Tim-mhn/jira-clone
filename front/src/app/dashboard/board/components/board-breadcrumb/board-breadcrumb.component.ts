import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../core/models/project';

@Component({
  selector: 'jira-board-breadcrumb',
  templateUrl: './board-breadcrumb.component.html',
})
export class BoardBreadcrumbComponent implements OnInit {
  constructor() {}

  @Input() project: Project;

  ngOnInit(): void {}
}
