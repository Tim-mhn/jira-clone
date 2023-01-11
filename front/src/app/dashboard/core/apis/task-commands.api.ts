import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatObjectsIf } from '@tim-mhn/common/objects';
import { map } from 'rxjs';
import { buildSingleTaskEndpoint, buildTaskEndpoint } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { handleNullAssigneeId, PatchTaskDTO } from '../dtos';
import { DeleteTaskDTO } from '../dtos/delete-task.dto';
import { NewTaskDTO } from '../dtos/new-task.dto';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class TaskCommandsAPI {
  constructor(private http: HttpClient) {}

  createTask(_dto: NewTaskDTO) {
    const dto = handleNullAssigneeId(_dto);
    const { projectId, ...body } = dto;

    const endpoint = buildTaskEndpoint({ projectId });

    return this.http
      .post<string>(endpoint, body)
      .pipe(map((taskId) => ({ taskId })));
  }

  deleteTask(dto: DeleteTaskDTO) {
    const endpoint = buildSingleTaskEndpoint(dto);
    return this.http.delete<void>(endpoint);
  }

  updateTask(_dto: PatchTaskDTO) {
    const endpoint = buildTaskEndpoint(_dto);
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
}
