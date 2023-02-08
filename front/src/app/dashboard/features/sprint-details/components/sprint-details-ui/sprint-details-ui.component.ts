// eslint-disable-next-line max-classes-per-file
import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbParts } from '../../../../../shared/components/breadcrumb/breadcrumbs';
import { Project, Sprint } from '../../../../core/models';

@Component({
  selector: 'jira-sprint-details-ui',
  templateUrl: './sprint-details-ui.component.html',
})
export class SprintDetailsUiComponent implements OnInit {
  @Input() sprint: Sprint;
  @Input() project: Project;
  constructor() {}

  breadcrumbs: BreadcrumbParts = [];
  ngOnInit(): void {}

  ngOnChanges() {
    this._setBreadcrumbs();
  }

  private _setBreadcrumbs() {
    this.breadcrumbs = [
      {
        label: 'Projects',
        route: 'projects',
      },
      {
        route: this.project?.Id,
        label: this.project?.Name,
      },
      {
        route: ['browse', 'sprints', this.sprint?.Id],
        label: this.sprint?.Name,
      },
    ];
  }
}
