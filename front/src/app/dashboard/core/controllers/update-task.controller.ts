import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { PatchTaskAPI, PatchTaskDTO } from '../apis/patch-task.api';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class UpdateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: PatchTaskAPI,
    private currentProjectService: CurrentProjectService
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
      .pipe(this.requestStateController.handleRequest(requestState));
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
