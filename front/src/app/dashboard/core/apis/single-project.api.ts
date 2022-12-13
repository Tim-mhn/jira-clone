import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { ProjectWithMembersAndTasks } from '../../models/project';

@Injectable()
export class SingleProjectAPI {
  constructor(private http: HttpClient) {}

  getProjectInfo(projectId: string) {
    const projectEndpoint = `${PROJECTS_API_ENDPOINT}/${projectId}`;
    return this.http.get<ProjectWithMembersAndTasks>(projectEndpoint);
  }
}
