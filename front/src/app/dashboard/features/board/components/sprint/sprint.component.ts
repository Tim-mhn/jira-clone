import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { shareReplay } from 'rxjs';
import { Project, Sprint, Task } from '../../../../core/models';
import { CurrentSprintsService } from '../../state-services/current-sprints.service';
import { ProjectMembersService } from '../../state-services/project-members.service';

@Component({
  selector: 'jira-sprint',
  templateUrl: './sprint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintComponent implements OnInit {
  readonly ARROW_RIGHT = ICONS.ARROW_RIGHT_GRAY;
  readonly ARROW_DOWN = ICONS.ARROW_DOWN_GRAY;

  @Input() sprint: Sprint;
  @Input() tasks: Task[];
  @Input() project: Project;
  @Output() taskClicked = new EventEmitter<Task>();

  renderTaskList = false;

  constructor(
    private membersService: ProjectMembersService,
    private sprintService: CurrentSprintsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sprint.update$.subscribe(() => this.cdr.detectChanges());
  }

  showList = false;

  members$ = this.membersService.projectMembers$;
  activeSprints$ = this.sprintService.activeSprints$.pipe(shareReplay());

  toggleList = () => (this.showList = !this.showList);
}
