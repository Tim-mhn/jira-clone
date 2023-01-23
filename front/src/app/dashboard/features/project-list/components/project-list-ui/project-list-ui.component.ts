import { Component, Input, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { ProjectInfoList } from '../../../../core/models/project';

@Component({
  selector: 'jira-project-list-ui',
  templateUrl: './project-list-ui.component.html',
})
export class ProjectListUiComponent implements OnInit {
  readonly PLUS_ICON = ICONS.PLUS_WHITE;

  @Input() projectList: ProjectInfoList;
  @Input() loading: boolean;
  constructor() {}

  ngOnInit(): void {}
}
