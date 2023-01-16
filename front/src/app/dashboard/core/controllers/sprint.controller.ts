import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { SprintsAPI } from '../apis/sprints.api';
import { GetSprintsController } from './get-sprints.controller';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class SprintController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private api: SprintsAPI,
    private sprintsController: GetSprintsController
  ) {}

  @logMethod
  createSprint(sprintName: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.createSprint({ sprintName, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Creating sprint ...',
        successMessage: 'Sprint successfully created',
      }),
      switchMap(() => this.sprintsController.refreshSprintTasks()),
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
      switchMap(() => this.sprintsController.refreshSprintTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
