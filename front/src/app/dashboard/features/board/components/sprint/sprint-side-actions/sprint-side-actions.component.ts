import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ProjectInfo, Sprint } from '../../../../../core/models';
import { buildSprintPageRoute } from '../../../../browse/utils/build-browse-page-routes.util';

@Component({
  selector: 'jira-sprint-side-actions',
  templateUrl: './sprint-side-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintSideActionsComponent implements OnInit {
  @Input() sprint: Sprint;
  @Input() project: ProjectInfo;
  constructor() {}

  sprintPageRoute: string[];

  ngOnInit(): void {}

  ngOnChanges() {
    this.sprintPageRoute = buildSprintPageRoute(this.sprint, this.project);
  }
}
