import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { GetSprintsController } from './get-sprints.controller';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class DeleteTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: TaskCommandsAPI,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private sprintsController: GetSprintsController
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
      switchMap(() => this.sprintsController.refreshSprintTasks())
    );
  }
  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
