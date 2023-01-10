import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { ProjectMapper } from '../mappers/project.mapper';
import { Project } from '../models/project';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private taskStatusApi: TaskStatusAPI,
    private mapper: ProjectMapper
  ) {}

  getProject(projectId: string): Observable<Project> {
    const allTaskStatus$ = this.taskStatusApi.getAllTaskStatus(projectId);
    const projectInfo$ = this.projectApi.getProject(projectId);

    return forkJoin({
      projectInfo: projectInfo$,
      allTaskStatus: allTaskStatus$,
    }).pipe(
      map(({ projectInfo, allTaskStatus }) => {
        const { Id, Name, Members } = projectInfo;

        const projectData: Project = {
          Id,
          Name,
          Members,
          AllTaskStatus: allTaskStatus,
        };
        return projectData;
      })
    );
  }
}
