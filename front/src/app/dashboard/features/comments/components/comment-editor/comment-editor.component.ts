// eslint-disable-next-line max-classes-per-file
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { TimTextEditorComponent } from '@tim-mhn/ng-forms/text-editor';
import { Observable } from 'rxjs';
import { randomString } from '@tim-mhn/common/strings';

export type PostCommentFn<T = any> = (newText: string) => Observable<T>;
@Component({
  selector: 'jira-comment-editor',
  templateUrl: './comment-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentEditorComponent<T = any> implements OnInit {
  @Input('show') set _show(show: boolean) {
    this.show = show;
    if (this.show) this.textEditor.focus();
  }

  show: boolean;
  @Input('commentInitialText') set commentInitialText(initialText: string) {
    this._commentInitialText = initialText || '';
    if (initialText) this.commentFc.setValue(initialText, { emitEvent: false });
  }

  private _commentInitialText: string = '';

  @Input() requestPending: boolean;
  @Input() postCommentFn: (newText: string) => Observable<T>;
  @Output() showChange = new EventEmitter<boolean>();
  @Output() saveClick = new EventEmitter<string>();

  @ViewChild(TimTextEditorComponent) textEditor: TimTextEditorComponent;

  constructor(
    private tfb: TypedFormBuilder,
    private requestStateController: RequestStateController,
    private el: ElementRef<HTMLElement>
  ) {}

  commentFc = this.tfb.control('', Validators.minLength(1));
  requestState = new RequestState();

  ngOnInit(): void {}

  ignoreEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  hideTextEditor() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  cancel() {
    this.commentFc.reset();
    this.commentFc.setValue(this._commentInitialText, { emitEvent: false });
    this.hideTextEditor();
  }

  private _showTextEditor() {
    this.show = true;
    this.showChange.emit(this.show);
  }

  showEditorAndHideOthers() {
    this._showTextEditor();
    this._emitEditorClick();
  }

  saveComment(event: Event) {
    this.ignoreEvent(event);
    if (this.commentFc.invalid) return;

    this.postCommentFn(this.commentFc.value)
      .pipe(this.requestStateController.handleRequest(this.requestState))
      .subscribe({
        complete: () => this.commentFc.reset(),
      });
  }

  private _emitEditorClick() {
    const commentEditorClickEvent = new CommentEditorClickEvent(this.sourceId);
    this.el.nativeElement.dispatchEvent(commentEditorClickEvent);
  }

  @HostListener('document:click', ['$event'])
  hideEditorOnDocClick(_e: Event) {
    this.hideTextEditor();
  }

  @HostListener(`document:${CommentEditorClick}`, ['$event'])
  hideEditorOnOtherEditorsClick(e: CommentEditorClickEvent) {
    if (e.sourceId === this.sourceId) return;
    this.hideTextEditor();
  }

  private sourceId = randomString();

  @HostListener('click', ['$event'])
  dispatchCommentEditorClick(e: Event) {
    this.ignoreEvent(e);
    this._emitEditorClick();
  }
}

const CommentEditorClick = 'comment-editor-click';
class CommentEditorClickEvent extends Event {
  constructor(public sourceId: string) {
    super(CommentEditorClick, { bubbles: true });
  }
}
