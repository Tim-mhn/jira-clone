import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { finalize, interval, tap } from 'rxjs';
import { CommentsController } from '../../controllers/comments.controller';
import { TaskComment } from '../../models/comment';
import {
  CommentEditorComponent,
  PostCommentFn,
} from '../comment-editor/comment-editor.component';

@Component({
  selector: 'jira-single-comment-ui',
  templateUrl: './single-comment-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCommentUiComponent implements OnInit, OnChanges {
  @Input() comment: TaskComment;
  constructor(
    private controller: CommentsController,
    private tfb: TypedFormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  commentsFc = this.tfb.control('');
  requestState = new RequestState();

  @ViewChild(CommentEditorComponent, { static: true })
  commentEditor: CommentEditorComponent;

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.comment) {
      this.commentsFc.setValue(this.comment.Text, { emitEvent: false });
      this.postCommentFn = this._buildPostCommentFn(this.comment);
    }
  }

  private _buildPostCommentFn(comment: TaskComment) {
    return (newText: string) =>
      this.controller
        .updateComment({
          Comment: comment,
          NewText: newText,
        })
        .pipe(
          tap(() => {
            this.showTextEditor = false;
            this.comment.Text = newText;
          }),
          finalize(() => this.cdr.detectChanges())
        );
  }

  postCommentFn: PostCommentFn;

  updateComment(newText: string) {
    this.controller
      .updateComment(
        {
          Comment: this.comment,
          NewText: newText,
        },
        this.requestState
      )
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe(() => {
        this.showTextEditor = false;
        this.comment.Text = newText;
      });
  }

  recomputeTimeAgoLabel$ = interval(2000);

  deleteComment() {
    this.controller.deleteCommentAndRefreshList(this.comment).subscribe();
  }

  showTextEditor = false;

  showCommentEditor(e: Event) {
    e.stopPropagation();
    this.commentEditor.showEditorAndHideOthers();
  }
}
