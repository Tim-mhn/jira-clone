import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildSingleProjectEndpoint } from '../../core/apis/endpoints';
import { TaskTag } from './task-tag';

@Injectable()
export class TaskTagsAPI {
  constructor(private http: HttpClient) {}

  getTagTemplate(ids: { projectId: string }): Observable<string> {
    const endpoint = `${this._buildTagsEndpoint(ids)}/template`;
    return this.http.get<string>(endpoint);
  }

  createTag(ids: { projectId: string }, tag: TaskTag): Observable<void> {
    const endpoint = this._buildTagsEndpoint(ids);
    const body = { tag };
    return this.http.post<void>(endpoint, body);
  }

  getProjectTags(ids: { projectId: string }): Observable<TaskTag[]> {
    const endpoint = this._buildTagsEndpoint(ids);
    return this.http.get<TaskTag[]>(endpoint);
  }

  private _buildTagsEndpoint(ids: { projectId: string }) {
    return `${buildSingleProjectEndpoint(ids.projectId)}/tags`;
  }
}
