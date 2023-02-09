import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TypedChanges } from '@tim-mhn/common/extra-types';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDialogService } from '@tim-mhn/ng-ui/dialog';
import { BreadcrumbParts } from '../../../../../shared/components/breadcrumb/breadcrumbs';
import { ProjectInfo, ProjectMembers } from '../../../../core/models';
import {
  AddMembersDialogComponent,
  AddMembersDialogInput,
} from '../add-members-dialog/add-members-dialog.component';

@Component({
  selector: 'jira-project-settings-ui',
  templateUrl: './project-settings-ui.component.html',
})
export class ProjectSettingsUiComponent implements OnInit, OnChanges {
  @Input() projectInfo: ProjectInfo;
  @Input() members: ProjectMembers;
  @Input() requestState: RequestState;
  constructor(private _dialog: TimUIDialogService) {}

  breadcrumbs: BreadcrumbParts;

  ngOnInit(): void {}

  ngOnChanges(changes: TypedChanges<ProjectSettingsUiComponent>): void {
    if (changes?.projectInfo && this.projectInfo) {
      this.breadcrumbs = [
        {
          route: 'projects',
          label: 'Projects',
        },
        {
          route: this.projectInfo.Id,
          label: this.projectInfo.Name,
        },
        {
          route: 'settings',
          label: 'Settings',
        },
      ];
    }
  }

  openAddMembersDialog() {
    this._dialog.open<void, AddMembersDialogInput>(AddMembersDialogComponent, {
      projectId: this.projectInfo.Id,
    });
  }
}
