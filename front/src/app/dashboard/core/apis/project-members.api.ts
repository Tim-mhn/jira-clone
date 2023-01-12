import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { ProjectMember } from '../models/project-member';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class ProjectMembersAPI {
  constructor(private http: HttpClient) {}

  getProjectMembers(projectId: string) {
    const endpoint = `${PROJECTS_API_ENDPOINT}/${projectId}/members`;
    return this.http.get<ProjectMember[]>(endpoint);
  }
}