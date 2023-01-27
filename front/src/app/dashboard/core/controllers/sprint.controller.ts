import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardProvidersModule } from '../../features/board/board-providers.module';
import { GetTasksOfBoardController } from '../../features/board/controllers/get-board-tasks.controller';
import { SprintsAPI } from '../apis/sprints.api';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({
  providedIn: BoardProvidersModule,
})
export class SprintController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private api: SprintsAPI,
    private tasksOfBoardController: GetTasksOfBoardController
  ) {}

  createSprint(sprintName: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.createSprint({ sprintName, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Creating sprint ...',
        successMessage: 'Sprint successfully created',
      }),
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  deleteSprint(sprintId: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.deleteSprint({ sprintId, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Deleting sprint ...',
        successMessage: 'Sprint successfully deleted',
      }),
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  completeSprint(sprintId: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.completeSprint({ sprintId, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage: 'Sprint successfully completed',
        },
        { showLoadingMessage: false }
      ),
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
