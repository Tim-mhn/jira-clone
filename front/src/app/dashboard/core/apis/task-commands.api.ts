import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { buildSingleTaskEndpoint, buildTaskEndpoint } from './endpoints';
import { removeUndefinedValues } from '../../../shared/utils/object.util';
import { handleNullAssigneeId, PatchTaskDTO } from '../dtos';
import { DeleteTaskDTO } from '../dtos/delete-task.dto';
import { NewTaskDTO } from '../dtos/new-task.dto';
import { DashboardCoreProvidersModule } from '../core.providers.module';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
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
    const endpoint = buildSingleTaskEndpoint(_dto);
    let body = {};
    // const dto = handleNullAssigneeId(_dto);

    const { projectId, taskId, ...patchDTO } = _dto;

    if (patchDTO.points !== undefined)
      // eslint-disable-next-line radix
      patchDTO.points = parseInt(<string>(<any>patchDTO.points));

    body = removeUndefinedValues(patchDTO);

    return this.http.patch<void>(endpoint, body);
  }
}
