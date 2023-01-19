import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { NewTaskDTO } from '../dtos/new-task.dto';
import { CurrentProjectService } from '../state-services/current-project.service';
import { GetSprintsController } from './get-sprints.controller';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CreateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private api: TaskCommandsAPI,
    private sprintsController: GetSprintsController
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
      switchMap(() => this.sprintsController.refreshSprintTasks())
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
