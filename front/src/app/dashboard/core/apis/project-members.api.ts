import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from './endpoints';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectMemberDTO } from '../dtos/project-member.dto';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectMembersAPI {
  constructor(private http: HttpClient) {}

  getProjectMembers(projectId: string) {
    const endpoint = `${PROJECTS_API_ENDPOINT}/${projectId}/members`;
    return this.http.get<ProjectMemberDTO[]>(endpoint);
  }
}
