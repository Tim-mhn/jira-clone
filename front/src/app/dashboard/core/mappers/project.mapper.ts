import { Injectable } from '@angular/core';
import { Mapper } from '../../../shared/mappers';
import { ProjectDTO } from '../dtos/project.dto';
import { Project } from '../models/project';
import { TaskStatus } from '../models/task-status';

@Injectable({
  providedIn: 'root',
})
export class ProjectMapper implements Mapper<Project, ProjectDTO> {
  constructor() {}

  toDomain(_p: ProjectDTO, _allStatus: TaskStatus[]): Project {
    return null;
  }
}
