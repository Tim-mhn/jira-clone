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
  UpdateCommentDTO,
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
    const endpoint = this._buildSingleCommentEndpoint(dto);
    return this.http.delete<void>(endpoint);
  }

  public updateComment(dto: UpdateCommentDTO) {
    const endpoint = this._buildSingleCommentEndpoint(dto);
    const body = {
      text: dto.text,
    };

    return this.http.patch<void>(endpoint, body);
  }

  private _buildSingleCommentEndpoint(
    ids: ProjectTaskIds & { commentId: string }
  ) {
    return `${buildSingleTaskEndpoint(ids)}/comments/${ids.commentId}`;
  }
}
