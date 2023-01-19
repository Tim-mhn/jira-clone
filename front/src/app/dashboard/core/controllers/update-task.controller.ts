import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { PatchTaskDTO } from '../dtos';
import { TaskStatus } from '../models/task-status';
import { CurrentProjectService } from '../state-services/current-project.service';
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

  updateTaskPoints(taskId: string, newPoints: number) {
    const dto: PatchTaskDTO = {
      taskId,
      points: newPoints,
      projectId: this._currentProjectId,
    };

    return this.api.updateTask(dto).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(),
      switchMap(() => this.sprintsController.refreshSprintTasks())
    );
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    const dto: PatchTaskDTO = {
      taskId,
      status: newStatus.Id,
      projectId: this._currentProjectId,
    };

    return this.api.updateTask(dto).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(),
      switchMap(() => this.sprintsController.refreshSprintTasks())
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
