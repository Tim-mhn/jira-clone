import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { shareReplay } from 'rxjs';
import { Project } from '../../../core/models/project';
import { Sprint } from '../../../core/models/sprint';
import { Task } from '../../../core/models/task';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';
import { ProjectMembersService } from '../../state-services/project-members.service';

@Component({
  selector: 'jira-sprint',
  templateUrl: './sprint.component.html',
})
export class SprintComponent implements OnInit {
  readonly ARROW_RIGHT = ICONS.ARROW_RIGHT_GRAY;
  readonly ARROW_DOWN = ICONS.ARROW_DOWN_GRAY;

  @Input() sprint: Sprint;
  @Input() tasks: Task[];
  @Input() project: Project;
  @Output() taskClicked = new EventEmitter<Task>();

  constructor(
    private membersService: ProjectMembersService,
    private sprintService: CurrentSprintsService
  ) {}

  ngOnInit(): void {}

  showList = false;

  members$ = this.membersService.projectMembers$;
  sprintInfoList$ = this.sprintService.sprintInfoList$.pipe(shareReplay());

  toggleList = () => (this.showList = !this.showList);
}
