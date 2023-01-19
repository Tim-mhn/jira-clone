import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core-apis-providers.module';
import { ProjectListAPI } from '../apis/project-list.api';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { Project, ProjectInfoList } from '../models/project';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private taskStatusApi: TaskStatusAPI,
    private requestStateController: RequestStateController,
    private projectListAPI: ProjectListAPI
  ) {}

  getProject(projectId: string): Observable<Project> {
    const allTaskStatus$ = this.taskStatusApi.getAllTaskStatus(projectId);
    const projectInfo$ = this.projectApi.getProject(projectId);

    return forkJoin({
      projectInfo: projectInfo$,
      allTaskStatus: allTaskStatus$,
    }).pipe(
      map(({ projectInfo, allTaskStatus }) => {
        const { Id, Name, Members, Key, Icon } = projectInfo;

        const projectData: Project = {
          Id,
          Name,
          Members,
          Key,
          Icon,
          AllTaskStatus: allTaskStatus,
        };
        return projectData;
      })
    );
  }

  getUserProjects(requestState?: RequestState): Observable<ProjectInfoList> {
    return this.projectListAPI
      .getUserProjects()
      .pipe(this.requestStateController.handleRequest(requestState));
  }
}
