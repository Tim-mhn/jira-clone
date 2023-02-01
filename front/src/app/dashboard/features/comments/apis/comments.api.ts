import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { buildSingleTaskEndpoint } from '../../../core/apis/endpoints';
import { ProjectTaskIds } from '../../../core/dtos';
import { TaskCommentsProvidersModule } from '../comments-providers.module';
import {
  CommentListDTO,
  DeleteCommentDTO,
  GetCommentsDTO,
  PostCommentDTO,
} from '../dtos/comments.dtos';

@Injectable({
  providedIn: TaskCommentsProvidersModule,
})
export class CommentsAPI {
  constructor(private http: HttpClient) {}

  public postComment(dto: PostCommentDTO) {
    const { text, projectId, taskId } = dto;
    const endpoint = this._buildCommentsEndpoint({ projectId, taskId });
    const body = { text };
    return this.http.post<void>(endpoint, body);
  }

  public getComments(dto: GetCommentsDTO) {
    const endpoint = this._buildCommentsEndpoint(dto);
    return this.http.get<CommentListDTO>(endpoint);
  }

  private _buildCommentsEndpoint(ids: ProjectTaskIds) {
    return `${buildSingleTaskEndpoint(ids)}/comments`;
  }

  public deleteComment(dto: DeleteCommentDTO) {
    const endpoint = `${this._buildCommentsEndpoint(dto)}/${dto.commentId}`;
    return this.http.delete<void>(endpoint);
  }
}
