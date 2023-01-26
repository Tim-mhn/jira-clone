import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from './endpoints';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { TaskStatus } from '../models/task-status';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class TaskStatusAPI {
  constructor(private http: HttpClient) {}

  getAllTaskStatus(projectId: string) {
    const endpoint = this.buildEndpoint(projectId);

    return this.http.get<TaskStatus[]>(endpoint);
  }

  private buildEndpoint(projectId: string) {
    return `${PROJECTS_API_ENDPOINT}/${projectId}/task-status`;
  }
}
