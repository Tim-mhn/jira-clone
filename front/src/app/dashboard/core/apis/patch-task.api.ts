import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { PROJECTS_API_ENDPOINT } from '.';
import { concatObjectsIf } from '../../../shared/utils/object.util';

export interface PatchTaskDTO {
  taskId: string;
  projectId: string;
  status?: number;
  assigneeId?: string;
}
@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class PatchTaskAPI {
  constructor(private http: HttpClient) {}

  updateTask(dto: PatchTaskDTO) {
    const endpoint = this.buildEndpoint(dto);
    let body = {};
    const { status, assigneeId } = dto;
    body = concatObjectsIf(body, { status }, status !== undefined);
    body = concatObjectsIf(body, { assigneeId }, assigneeId !== undefined);

    return this.http.patch<void>(endpoint, body);
  }

  private buildEndpoint(dto: PatchTaskDTO) {
    return `${PROJECTS_API_ENDPOINT}/${dto.projectId}/tasks/${dto.taskId}`;
  }
}
