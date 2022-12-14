import { Injectable } from '@angular/core';
import { Mapper } from '../../../shared/mappers';
import { ProjectInfoDTO } from '../dtos/project.dto';
import { ProjectInfo } from '../models/project';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class ProjectMapper implements Mapper<ProjectInfo, ProjectInfoDTO> {
  constructor() {}

  toDomain(p: ProjectInfoDTO): ProjectInfo {
    return {
      ...p,
      Tasks: p?.Tasks?.map((task) => new Task(task)),
    };
  }
}
