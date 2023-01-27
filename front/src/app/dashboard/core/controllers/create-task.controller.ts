import { Injectable, Optional } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { GetTasksOfBoardController } from '../../features/board/controllers/get-board-tasks.controller';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { NewTaskDTO } from '../dtos/new-task.dto';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({ providedIn: DashboardCoreProvidersModule })
export class CreateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private api: TaskCommandsAPI,
    @Optional() private tasksBoardController: GetTasksOfBoardController
  ) {}

  createTask(
    dtoWithoutProjectId: Omit<NewTaskDTO, 'projectId'>,
    requestState?: RequestState
  ) {
    const dto = {
      ...dtoWithoutProjectId,
      projectId: this._currentProjectId,
    };
    return this.api.createTask(dto).pipe(
      this.requestStateController.handleRequest(requestState),
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Creating task ...',
        successMessage: 'Task created',
      }),
      switchMap(() => this.tasksBoardController?.refreshSprintsTasks())
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
