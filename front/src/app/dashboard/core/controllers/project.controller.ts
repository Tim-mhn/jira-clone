import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { Project } from '../models/project';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private taskStatusApi: TaskStatusAPI
  ) {}

  getProject(projectId: string): Observable<Project> {
    const allTaskStatus$ = this.taskStatusApi.getAllTaskStatus(projectId);
    const projectInfo$ = this.projectApi.getProject(projectId);

    return forkJoin({
      projectInfo: projectInfo$,
      allTaskStatus: allTaskStatus$,
    }).pipe(
      map(({ projectInfo, allTaskStatus }) => {
        const projectData: Project = {
          ...projectInfo,
          AllTaskStatus: allTaskStatus,
        };
        return projectData;
      })
    );
  }
}
