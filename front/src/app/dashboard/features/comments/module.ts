import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TimTextEditorModule } from '@tim-mhn/ng-forms/text-editor';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUILinkModule } from '@tim-mhn/ng-ui/link';
import { MemberComponentsModule } from '../../../shared/components/member/member-components.module';
import { SingleCommentUiComponent } from './components/single-comment-ui/single-comment-ui.component';
import { CommentListUiComponent } from './components/comment-list-ui/comment-list-ui.component';
import { TaskCommentsProvidersModule } from './comments-providers.module';
import { WriteCommentComponent } from './components/write-comment/write-comment.component';
import { TaskCommentsComponent } from './components/task-comments/task-comments.component';
import { SharedPipesModule } from '../../../shared/pipes/pipes.module';
import { CommentEditorComponent } from './components/comment-editor/comment-editor.component';

@NgModule({
  declarations: [
    SingleCommentUiComponent,
    CommentListUiComponent,
    WriteCommentComponent,
    TaskCommentsComponent,
    CommentEditorComponent,
  ],
  imports: [
    CommonModule,
    MemberComponentsModule,
    TaskCommentsProvidersModule,
    ReactiveFormsModule,
    TimTextEditorModule,
    TypedFormsModule,
    TimUIButtonModule,
    TimUILinkModule,
    SharedPipesModule,
  ],

  exports: [TaskCommentsComponent],
})
export class TaskCommentsModule {}
