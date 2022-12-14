import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PROJECTS_API_ENDPOINT } from '.';
import { ProjectInfoDTO } from '../dtos/project.dto';
import { ProjectMapper } from '../mappers/project.mapper';
import { ProjectInfo } from '../models/project';

@Injectable()
export class SingleProjectAPI {
  constructor(private http: HttpClient, private projectMapper: ProjectMapper) {}

  getProjectInfo(projectId: string): Observable<ProjectInfo> {
    const projectEndpoint = `${PROJECTS_API_ENDPOINT}/${projectId}`;
    return this.http
      .get<ProjectInfoDTO>(projectEndpoint)
      .pipe(map((p) => this.projectMapper.toDomain(p)));
  }
}
