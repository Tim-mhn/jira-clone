import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../../shared/services/snackbar-feedback.service';
import { ProjectCommandsAPI } from '../../../core/apis/project-commands.api';
import { ProjectListAPI } from '../../../core/apis/project-list.api';
import { NewProjectDTO } from '../../../core/dtos';
import { ProjectInfo, ProjectInfoList } from '../../../core/models';
import { ProjectListProvidersModule } from '../project-list-providers.module';
import { ProjectListService } from '../state-services/project-list.service';

@Injectable({
  providedIn: ProjectListProvidersModule,
})
export class ProjectListController {
  constructor(
    private requestStateController: RequestStateController,
    private projectListAPI: ProjectListAPI,
    private projectListService: ProjectListService,
    private projectCommandsAPI: ProjectCommandsAPI,
    private feedbackSnackbars: SnackbarFeedbackService
  ) {}

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

  deleteProjectAndUpdateList(
    projectInfo: ProjectInfo,
    requestState: RequestState
  ) {
    return this.projectCommandsAPI.deleteProject(projectInfo.Id).pipe(
      this.feedbackSnackbars.showFeedbackSnackbars({
        loadingMessage: 'Deleting project ...',
        successMessage: `Project ${projectInfo.Name} successfully deleted`,
      }),
      switchMap(() => this.getUserProjectsAndUpdateList()),
      this.requestStateController.handleRequest(requestState)
    );
  }
}
