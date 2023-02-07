import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { finalize, tap } from 'rxjs';
import { User } from '../../../../../auth/models/user';
import { CommentsController } from '../../controllers/comments.controller';
import { PostCommentFn } from '../comment-editor/comment-editor.component';

@Component({
  selector: 'jira-write-comment',
  templateUrl: './write-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriteCommentComponent implements OnInit {
  @Input() currentUser: User;
  @Input() set taskId(taskId: string) {
    this.createCommentFn = this._buildCreateCommentFn(taskId);
  }

  constructor(
    private tfb: TypedFormBuilder,
    private controller: CommentsController,
    private cdr: ChangeDetectorRef
  ) {}

  showTextEditor = false;

  createCommentFn: PostCommentFn;

  private _buildCreateCommentFn(taskId: string) {
    return (text: string) => {
      const newComment = { taskId, text };
      return this.controller.postCommentAndRefreshList(newComment).pipe(
        tap(() => this.hideTextEditor()),
        finalize(() => this.cdr.detectChanges())
      );
    };
  }

  ngOnInit(): void {}

  showEditor(e: Event) {
    this.ignoreEvent(e);
    this.showTextEditor = true;
  }

  ignoreEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  hideTextEditor() {
    this.showTextEditor = false;
  }
}
