import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { interval } from 'rxjs';
import { CommentsController } from '../../controllers/comments.controller';
import { TaskComment } from '../../models/comment';

@Component({
  selector: 'jira-single-comment-ui',
  templateUrl: './single-comment-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCommentUiComponent implements OnInit {
  @Input() comment: TaskComment;
  constructor(private controller: CommentsController) {}

  ngOnInit(): void {}

  recomputeTimeAgoLabel$ = interval(2000);

  deleteComment() {
    this.controller.deleteCommentAndRefreshList(this.comment).subscribe();
  }
}
