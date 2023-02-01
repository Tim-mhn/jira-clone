import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimTextEditorComponent } from '@tim-mhn/ng-forms/text-editor';
import { finalize } from 'rxjs';
import { ProjectMember } from '../../../../core/models';
import { CommentsController } from '../../controllers/comments.controller';
import { RefreshTaskCommentsService } from '../../services/refresh-comments.service';

@Component({
  selector: 'jira-write-comment',
  templateUrl: './write-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriteCommentComponent implements OnInit {
  @Input() currentUser: ProjectMember;
  @Input() taskId: string;

  constructor(
    private tfb: TypedFormBuilder,
    private controller: CommentsController,
    private cdr: ChangeDetectorRef,
    private refreshCommentsService: RefreshTaskCommentsService
  ) {}

  @ViewChild(TimTextEditorComponent) textEditor: TimTextEditorComponent;

  commentFc = this.tfb.control('', Validators.minLength(1));

  showTextEditor = false;

  requestState = new RequestState();

  ngOnInit(): void {}

  saveComment(e: Event) {
    this.ignoreEvent(e);
    const newComment = { taskId: this.taskId, text: this.commentFc.value };
    this.controller
      .postCommentAndRefreshList(newComment, this.requestState)
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe(() => {
        this.commentFc.reset();
        this.hideTextEditor();
      });
  }

  showFocusTextEditor(e: Event) {
    this.ignoreEvent(e);
    this.showTextEditor = true;
    this.textEditor.focus();
  }

  @HostListener('document:click')
  hideTextEditorOnOtherClicks() {
    this.hideTextEditor();
  }

  ignoreEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  hideTextEditor() {
    this.showTextEditor = false;
  }
}
