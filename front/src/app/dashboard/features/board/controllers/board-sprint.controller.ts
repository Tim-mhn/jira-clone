import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap } from 'rxjs';
import { SprintController } from '../../../core/controllers/sprint.controller';
import { Sprint } from '../../../core/models';
import { BoardProvidersModule } from '../board-providers.module';
import { GetTasksOfBoardController } from './get-board-tasks.controller';

@Injectable({
  providedIn: BoardProvidersModule,
})
export class BoardSprintController {
  constructor(
    private requestStateController: RequestStateController,
    private tasksOfBoardController: GetTasksOfBoardController,
    private sprintController: SprintController
  ) {}

  createSprintAndUpdateBoardList(
    sprintName: string,
    requestState?: RequestState
  ) {
    return this.sprintController.createSprint(sprintName).pipe(
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  deleteSprintAndUpdateBoardList(
    sprintId: string,
    requestState?: RequestState
  ) {
    return this.sprintController.deleteSprint(sprintId).pipe(
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  completeSprintAndUpdateBoardList(
    sprint: Sprint,
    requestState?: RequestState
  ) {
    return this.sprintController.completeSprint(sprint).pipe(
      switchMap(() => this.tasksOfBoardController?.refreshSprintsTasks()),
      this.requestStateController.handleRequest(requestState)
    );
  }
}
