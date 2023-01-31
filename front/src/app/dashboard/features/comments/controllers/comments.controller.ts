import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable } from 'rxjs';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { CommentsAPI } from '../apis/comments.api';
import { TaskCommentsProvidersModule } from '../comments-providers.module';
import { CommentDTO } from '../dtos/comments.dtos';
import { TaskComment, TaskComments } from '../models';

@Injectable({
  providedIn: TaskCommentsProvidersModule,
})
export class CommentsController {
  constructor(
    private api: CommentsAPI,
    private requestStateController: RequestStateController,
    private projectService: CurrentProjectService
  ) {}

  getComments(
    taskId: string,
    requestState?: RequestState
  ): Observable<TaskComments> {
    const projectId = this._getCurrentProjectId();
    return this.api.getComments({ projectId, taskId }).pipe(
      this.requestStateController.handleRequest(requestState),
      map((commentListDTO) =>
        commentListDTO.map((dto) => this._mapCommentDTO(dto))
      )
    );
  }

  private _getCurrentProjectId() {
    return this.projectService.currentProject.Id;
  }

  private _mapCommentDTO(dto: CommentDTO): TaskComment {
    const createdOn = new Date(dto?.CreatedOn);
    return {
      ...dto,
      CreatedOn: createdOn,
    };
  }
}
