import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { buildSingleTaskEndpoint, buildTaskEndpoint } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { handleNullAssigneeId } from '../dtos';
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
}
