import { Injectable } from '@angular/core';
import {
  MockAPI,
  RequestState,
  RequestStateController,
} from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../../shared/services/snackbar-feedback.service';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { CommentsAPI } from '../apis/comments.api';
import { TaskCommentsProvidersModule } from '../comments-providers.module';
import {
  CommentDTO,
  DeleteCommentDTO,
  PostCommentDTO,
} from '../dtos/comments.dtos';
import { TaskComment, TaskComments } from '../models';
import { RefreshTaskCommentsService } from '../services/refresh-comments.service';

@Injectable({
  providedIn: TaskCommentsProvidersModule,
})
export class CommentsController {
  constructor(
    private api: CommentsAPI,
    private requestStateController: RequestStateController,
    private projectService: CurrentProjectService,
    private mockAPI: MockAPI,
    private snackbarFeedback: SnackbarFeedbackService,
    private refreshCommentsService: RefreshTaskCommentsService
  ) {}

  getComments(
    taskId: string,
    requestState?: RequestState
  ): Observable<TaskComments> {
    const projectId = this._getCurrentProjectId();
    return this.api.getComments({ projectId, taskId }).pipe(
      this.requestStateController.handleRequest(requestState),
      map((commentListDTO) =>
        commentListDTO.map((dto) => this._mapCommentDTO(dto, taskId))
      )
    );
  }

  postCommentAndRefreshList(
    postCommentInput: Pick<PostCommentDTO, 'taskId' | 'text'>,
    requestState?: RequestState
  ) {
    const dto: PostCommentDTO = {
      ...postCommentInput,
      projectId: this._getCurrentProjectId(),
    };
    return this.api.postComment(dto).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(),
      this.requestStateController.handleRequest(requestState),
      tap(() => this.refreshCommentsService.refreshComments())
    );
  }

  deleteCommentAndRefreshList(
    comment: TaskComment,
    requestState?: RequestState
  ) {
    const dto: DeleteCommentDTO = {
      commentId: comment.Id,
      taskId: comment.TaskId,
      projectId: this._getCurrentProjectId(),
    };

    return this.api.deleteComment(dto).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(),
      this.requestStateController.handleRequest(requestState),
      tap(() => this.refreshCommentsService.refreshComments())
    );
  }

  private _getCurrentProjectId() {
    return this.projectService.currentProject.Id;
  }

  private _mapCommentDTO(dto: CommentDTO, taskId: string): TaskComment {
    const createdOn = new Date(dto?.CreatedOn);
    return {
      ...dto,
      CreatedOn: createdOn,
      TaskId: taskId,
    };
  }
}
