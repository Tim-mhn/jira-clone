import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { PatchTaskDTO } from '../dtos';
import { GetSprintsController } from './get-sprints.controller';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class UpdateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: TaskCommandsAPI,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private sprintsController: GetSprintsController
  ) {}

  updateTask(
    dtoWithoutProjectId: Omit<PatchTaskDTO, 'projectId'>,
    requestState?: RequestState
  ) {
    const dto: PatchTaskDTO = {
      ...dtoWithoutProjectId,
      projectId: this._currentProjectId,
    };

    return this.api
      .updateTask(dto)
      .pipe(
        this.requestStateController.handleRequest(requestState),
        this.snackbarFeedback.showFeedbackSnackbars()
      );
  }

  moveTaskToSprint(
    dto: Pick<PatchTaskDTO, 'taskId' | 'sprintId'>,
    requestState?: RequestState
  ) {
    const dtoWithProjectId: PatchTaskDTO = {
      ...dto,
      projectId: this._currentProjectId,
    };

    return this.api.updateTask(dtoWithProjectId).pipe(
      this.requestStateController.handleRequest(requestState),
      this.snackbarFeedback.showFeedbackSnackbars(),
      switchMap(() => this.sprintsController.refreshSprintTasks())
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}