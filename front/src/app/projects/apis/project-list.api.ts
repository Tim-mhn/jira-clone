import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Projects } from '../models/project';

@Injectable()
export class ProjectListAPI {
  constructor(private http: HttpClient) {}

  private ENDPOINT = `${environment.apiUrl}projects`;

  getUserProjects() {
    return this.http.get<Projects>(this.ENDPOINT);
  }
}
