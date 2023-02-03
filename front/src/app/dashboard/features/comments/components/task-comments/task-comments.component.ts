import { Component, Input } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import {
  combineLatest,
  ReplaySubject,
  shareReplay,
  startWith,
  switchMap,
  tap,
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
    private refreshCommentsService: RefreshTaskCommentsService,
    private requestStateController: RequestStateController
  ) {}

  currentUser$ = this.loggedInUserService.user$;

  refreshComments$ = this.refreshCommentsService.refreshComments$.pipe(
    startWith(null)
  );

  requestState = new RequestState();
  taskId$ = new ReplaySubject<string>();
  taskComments$ = combineLatest({
    refresh: this.refreshComments$,
    taskId: this.taskId$,
  }).pipe(
    tap(() => this.requestState.toPending()),
    switchMap(({ taskId }) =>
      this.controller
        .getComments(taskId, this.requestState)
        .pipe(this.requestStateController.handleRequest(this.requestState))
    ),
    shareReplay()
  );
}
