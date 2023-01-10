import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatObjectsIf } from '@tim-mhn/common/objects';
import { buildTaskEndpoint } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { handleNullAssigneeId } from '../dtos';
import { PatchTaskDTO } from '../dtos/patch-task.dto';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class PatchTaskAPI {
  constructor(private http: HttpClient) {}

  updateTask(_dto: PatchTaskDTO) {
    const endpoint = this.buildEndpoint(_dto);
    let body = {};
    const dto = handleNullAssigneeId(_dto);

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
    const { projectId, taskId } = dto;
    return `${buildTaskEndpoint({ projectId })}/${taskId}`;
  }
}
