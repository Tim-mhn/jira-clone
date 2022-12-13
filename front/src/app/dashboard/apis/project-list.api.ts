import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROJECTS_API_ENDPOINT } from '.';
import { Projects } from '../models/project';

@Injectable()
export class ProjectListAPI {
  constructor(private http: HttpClient) {}

  getUserProjects() {
    return this.http.get<Projects>(PROJECTS_API_ENDPOINT);
  }
}
