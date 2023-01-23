import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { NewProjectDTO } from '../dtos';
import { PROJECTS_API_ENDPOINT } from './endpoints';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class ProjectCommandsAPI {
  constructor(private http: HttpClient) {}

  createProject(dto: NewProjectDTO) {
    const endpoint = PROJECTS_API_ENDPOINT;
    return this.http.post<any>(endpoint, dto);
  }
}
