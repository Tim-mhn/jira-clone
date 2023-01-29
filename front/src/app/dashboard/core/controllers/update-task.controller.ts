import { Injectable, Optional } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { GetTasksOfBoardController } from '../../features/board/controllers/get-board-tasks.controller';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { PatchTaskDTO } from '../dtos';
import { SprintInfo, Task, TaskType } from '../models';
import { TaskStatus } from '../models/task-status';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({ providedIn: DashboardCoreProvidersModule })
export class UpdateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: TaskCommandsAPI,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    @Optional() private tasksOfBoardController: GetTasksOfBoardController
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

    return this.api
      .updateTask(dto)
      .pipe(
        this.snackbarFeedback.showFeedbackSnackbars(),
        this._refreshTaskListIfInBoardPage()
      );
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    const dto: PatchTaskDTO = {
      taskId,
      status: newStatus.Id,
      projectId: this._currentProjectId,
    };

    return this.api
      .updateTask(dto)
      .pipe(
        this.snackbarFeedback.showFeedbackSnackbars(),
        this._refreshTaskListIfInBoardPage()
      );
  }

  updateTaskType(task: Task, newType: TaskType) {
    const dto: PatchTaskDTO = {
      taskId: task.Id,
      type: newType?.Id,
      projectId: this._currentProjectId,
    };

    return this.api
      .updateTask(dto)
      .pipe(this.snackbarFeedback.showFeedbackSnackbars());
  }

  moveTaskToSprint(
    taskAndSprint: { task: Task; sprint: SprintInfo },
    requestState?: RequestState
  ) {
    const { task, sprint } = taskAndSprint;
    const dtoWithProjectId: PatchTaskDTO = {
      taskId: task.Id,
      sprintId: sprint.Id,
      projectId: this._currentProjectId,
    };

    return this.api.updateTask(dtoWithProjectId).pipe(
      this.requestStateController.handleRequest(requestState),
      this.snackbarFeedback.showFeedbackSnackbars({
        successMessage: `Task successfully moved to ${sprint.Name}`,
      }),
      this._refreshTaskListIfInBoardPage()
    );
  }

  private _refreshTaskListIfInBoardPage<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        switchMap(
          () => this.tasksOfBoardController?.refreshSprintsTasks() || of(null)
        )
      );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
