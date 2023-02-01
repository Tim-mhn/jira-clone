import { Component, Input } from '@angular/core';
import {
  combineLatest,
  ReplaySubject,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { LoggedInUserService } from '../../../../core/state-services/logged-in-user.service';
import { CommentsController } from '../../controllers/comments.controller';
import { RefreshTaskCommentsService } from '../../services/refresh-comments.service';

@Component({
  selector: 'jira-task-comments',
  templateUrl: './task-comments.component.html',
})
export class TaskCommentsComponent {
  @Input() set taskId(taskId: string) {
    if (!taskId) return;
    this.taskId$.next(taskId);
  }

  // todo: show skeleton while task comments are loading
  constructor(
    private controller: CommentsController,
    private loggedInUserService: LoggedInUserService,
    private refreshCommentsService: RefreshTaskCommentsService
  ) {}

  currentUser$ = this.loggedInUserService.user$;

  refreshComments$ = this.refreshCommentsService.refreshComments$.pipe(
    startWith(null)
  );
  taskId$ = new ReplaySubject<string>();
  taskComments$ = combineLatest({
    refresh: this.refreshComments$,
    taskId: this.taskId$,
  }).pipe(
    switchMap(({ taskId }) => this.controller.getComments(taskId)),
    shareReplay()
  );
}
