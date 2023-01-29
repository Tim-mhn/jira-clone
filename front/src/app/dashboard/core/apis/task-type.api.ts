import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from './endpoints';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { TaskType } from '../models';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class TaskTypeAPI {
  constructor(private http: HttpClient) {}

  getAllTaskType(projectId: string) {
    const endpoint = this.buildEndpoint(projectId);
    return this.http.get<TaskType[]>(endpoint);
  }

  private buildEndpoint(projectId: string) {
    return `${PROJECTS_API_ENDPOINT}/${projectId}/task-types`;
  }
}
