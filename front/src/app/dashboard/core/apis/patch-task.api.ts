import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatObjectsIf } from '@tim-mhn/common/objects';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { PROJECTS_API_ENDPOINT } from '.';

export interface PatchTaskDTO {
  taskId: string;
  projectId: string;
  status?: number;
  assigneeId?: string;
  description?: string;
  title?: string;
  points?: number;
}
@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class PatchTaskAPI {
  constructor(private http: HttpClient) {}

  updateTask(dto: PatchTaskDTO) {
    const endpoint = this.buildEndpoint(dto);
    let body = {};
    const { status, assigneeId, description, title, points } = dto;
    body = concatObjectsIf(body, { status }, status !== undefined);
    body = concatObjectsIf(body, { assigneeId }, assigneeId !== undefined);
    body = concatObjectsIf(body, { description }, description !== undefined);
    body = concatObjectsIf(body, { title }, title !== undefined);
    body = concatObjectsIf(
      body,
      // eslint-disable-next-line radix
      { points: parseInt(<string>(<any>points)) },
      points !== undefined
    );

    return this.http.patch<void>(endpoint, body);
  }

  private buildEndpoint(dto: PatchTaskDTO) {
    return `${PROJECTS_API_ENDPOINT}/${dto.projectId}/tasks/${dto.taskId}`;
  }
}
