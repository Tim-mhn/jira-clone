import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { ProjectInfoList } from '../models/project';
import { DashboardCoreProvidersModule } from '../core-apis-providers.module';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectListAPI {
  constructor(private http: HttpClient) {}

  getUserProjects() {
    return this.http.get<ProjectInfoList>(PROJECTS_API_ENDPOINT);
  }
}
