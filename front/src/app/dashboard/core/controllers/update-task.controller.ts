import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { PatchTaskAPI, PatchTaskDTO } from '../apis/patch-task.api';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class UpdateTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private api: PatchTaskAPI
  ) {}

  updateTask(dto: PatchTaskDTO, requestState?: RequestState) {
    return this.api
      .updateTask(dto)
      .pipe(this.requestStateController.handleRequest(requestState));
  }
}
