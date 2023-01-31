import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MemberComponentsModule } from '../../../shared/components/member/member-components.module';
import { SingleCommentUiComponent } from './components/single-comment-ui/single-comment-ui.component';
import { CommentListUiComponent } from './components/comment-list-ui/comment-list-ui.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { TaskCommentsProvidersModule } from './comments-providers.module';

@NgModule({
  declarations: [
    SingleCommentUiComponent,
    CommentListUiComponent,
    CommentListComponent,
  ],
  imports: [CommonModule, MemberComponentsModule, TaskCommentsProvidersModule],

  exports: [CommentListComponent],
})
export class TaskCommentsModule {}
