import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { TaskCommandsAPI } from '../apis/task-commands.api';
import { PatchTaskDTO } from '../dtos';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class UpdateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: TaskCommandsAPI,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService
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

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
