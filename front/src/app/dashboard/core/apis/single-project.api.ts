import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROJECTS_API_ENDPOINT } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { ProjectDTO } from '../dtos/project.dto';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class SingleProjectAPI {
  constructor(private http: HttpClient) {}

  getProject(projectId: string): Observable<ProjectDTO> {
    const projectEndpoint = `${PROJECTS_API_ENDPOINT}/${projectId}`;
    return this.http.get<ProjectDTO>(projectEndpoint);
  }
}
