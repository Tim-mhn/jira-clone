import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { NewProjectDTO } from '../dtos';
import { buildSingleProjectEndpoint, PROJECTS_API_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectCommandsAPI {
  constructor(private http: HttpClient) {}

  createProject(dto: NewProjectDTO) {
    const endpoint = PROJECTS_API_ENDPOINT;
    return this.http.post<void>(endpoint, dto);
  }

  deleteProject(projectId: string) {
    const endpoint = buildSingleProjectEndpoint(projectId);
    return this.http.delete<void>(endpoint);
  }
}
