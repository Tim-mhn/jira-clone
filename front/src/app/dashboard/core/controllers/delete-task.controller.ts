import { Injectable, Optional } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { GetTasksOfBoardController } from '../../features/board/controllers/get-board-tasks.controller';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class DeleteTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: TaskCommandsAPI,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    @Optional() private tasksOfBoardController: GetTasksOfBoardController
  ) {}

  deleteTask(taskId: string, requestState?: RequestState) {
    const dto = {
      taskId,
      projectId: this._currentProjectId,
    };
    return this.api.deleteTask(dto).pipe(
      this.requestStateController.handleRequest(requestState),
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Deleting task ...',
        successMessage: 'Task successfully deleted',
      }),
      this._refreshTaskListIfInBoardPage()
    );
  }

  private _refreshTaskListIfInBoardPage<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        switchMap(
          () => this.tasksOfBoardController?.refreshSprintsTasks() || EMPTY
        )
      );
  }
  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
