import { Component, Input, OnInit } from '@angular/core';
import { ProjectInfoList } from '../../../core/models/project';

@Component({
  selector: 'jira-project-list-ui',
  templateUrl: './project-list-ui.component.html',
})
export class ProjectListUiComponent implements OnInit {
  @Input() projectList: ProjectInfoList;
  @Input() loading: boolean;
  constructor() {}

  ngOnInit(): void {}
}
