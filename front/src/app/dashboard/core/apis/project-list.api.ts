import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { ProjectIdNames } from '../models/project';

@Injectable()
export class ProjectListAPI {
  constructor(private http: HttpClient) {}

  getUserProjects() {
    return this.http.get<ProjectIdNames>(PROJECTS_API_ENDPOINT);
  }
}
