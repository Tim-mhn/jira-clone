import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ReplaySubject, switchMap } from 'rxjs';
import { CommentsController } from '../../controllers/comments.controller';

@Component({
  selector: 'jira-comment-list',
  templateUrl: './comment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnInit {
  @Input() set taskId(taskId: string) {
    if (!taskId) return;

    this.taskId$.next(taskId);
  }

  // todo: show skeleton while task comments are loading
  constructor(private controller: CommentsController) {}

  taskId$ = new ReplaySubject<string>();
  taskComments$ = this.taskId$.pipe(
    switchMap((taskId) => this.controller.getComments(taskId))
  );
  ngOnInit(): void {}
}
