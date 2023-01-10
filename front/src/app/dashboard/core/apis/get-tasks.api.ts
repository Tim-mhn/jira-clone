import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { TasksGroupedBySprintsDTO } from '../dtos/tasks-grouped-by-sprint.dto';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class GetTasksAPI {
  constructor(private http: HttpClient) {}

  @logMethod
  getTasksGroupedBySprints(projectId: string) {
    const endpoint = `${PROJECTS_API_ENDPOINT}/${projectId}/sprints`;
    return this.http.get<TasksGroupedBySprintsDTO>(endpoint);
  }
}
