import { Injectable } from '@angular/core';
import { Mapper } from '../../../shared/mappers';
import { ProjectDTO } from '../dtos/project.dto';
import { Project } from '../models/project';
import { Task } from '../models/task';
import { TaskStatus } from '../models/task-status';

@Injectable({
  providedIn: 'root',
})
export class ProjectMapper implements Mapper<Project, ProjectDTO> {
  constructor() {}

  toDomain(p: ProjectDTO, allStatus: TaskStatus[]): Project {
    return {
      ...p,
      Tasks: p?.Tasks?.map((task) => new Task(task)),
      AllTaskStatus: allStatus,
    };
  }
}
