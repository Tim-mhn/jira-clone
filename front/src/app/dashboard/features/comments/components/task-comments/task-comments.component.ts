import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { ReplaySubject, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { combineLatestWithTrigger } from '../../../../../shared/rxjs-operators';
import { LoggedInUserService } from '../../../../core/state-services/logged-in-user.service';
import { CommentsController } from '../../controllers/comments.controller';
import { RefreshTaskCommentsService } from '../../services/refresh-comments.service';

@Component({
  selector: 'jira-task-comments',
  templateUrl: './task-comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCommentsComponent {
  @Input() set taskId(taskId: string) {
    if (!taskId) return;
    this.taskId$.next(taskId);
  }

  constructor(
    private controller: CommentsController,
    private loggedInUserService: LoggedInUserService,
    private refreshCommentsService: RefreshTaskCommentsService,
    private cdr: ChangeDetectorRef
  ) {}

  currentUser$ = this.loggedInUserService.user$;

  refreshComments$ = this.refreshCommentsService.refreshComments$.pipe(
    startWith(null)
  );

  requestState = new RequestState();
  taskId$ = new ReplaySubject<string>();
  taskComments$ = combineLatestWithTrigger({
    refresh: this.refreshComments$,
    taskId: this.taskId$,
  }).pipe(
    tap(({ trigger }) => {
      // eslint-disable-next-line no-unused-expressions
      this._updateRequestStateCondition(trigger)
        ? this.requestState.toPending()
        : null;
      this.cdr.detectChanges();
    }),
    switchMap(({ taskId, trigger }) =>
      this.controller.getComments(taskId).pipe(
        tap({
          error: (err) =>
            this._updateRequestStateCondition(trigger)
              ? this.requestState.toError(err)
              : null,
          complete: () => this.requestState.toSuccess(),
          next: () =>
            this._updateRequestStateCondition(trigger)
              ? this.requestState.toPending()
              : null,
        })
      )
    ),
    shareReplay()
  );

  private _updateRequestStateCondition(trigger: 'refresh' | 'taskId') {
    return trigger === 'taskId';
  }
}
