import { Injectable, Optional } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core-apis-providers.module';
import { ProjectListAPI } from '../apis/project-list.api';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { Project, ProjectInfoList } from '../models/project';
import { ProjectCommandsAPI } from '../apis/project-commands.api';
import { NewProjectDTO } from '../dtos';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { ProjectListService } from '../../features/project-list/state-services/project-list.service';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private taskStatusApi: TaskStatusAPI,
    private requestStateController: RequestStateController,
    private projectListAPI: ProjectListAPI,
    private projectCommandsAPI: ProjectCommandsAPI,
    private feedbackSnackbars: SnackbarFeedbackService,
    @Optional() private projectListService: ProjectListService
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

  getUserProjectsAndUpdateList(
    requestState?: RequestState
  ): Observable<ProjectInfoList> {
    return this.projectListAPI.getUserProjects().pipe(
      tap((list) => this.projectListService.updateProjectList(list)),
      this.requestStateController.handleRequest(requestState)
    );
  }

  createProjectAndUpdateList(
    newProject: NewProjectDTO,
    requestState?: RequestState
  ) {
    return this.projectCommandsAPI.createProject(newProject).pipe(
      switchMap(() => this.getUserProjectsAndUpdateList()),
      this.feedbackSnackbars.showFeedbackSnackbars({
        loadingMessage: 'Creating project ...',
        successMessage: `${newProject.name} successfully created`,
      }),
      this.requestStateController.handleRequest(requestState)
    );
  }
}
