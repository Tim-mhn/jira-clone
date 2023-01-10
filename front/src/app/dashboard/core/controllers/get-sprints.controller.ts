import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { CurrentSprintsService } from '../../board/state-services/current-sprints.service';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { Task } from '../models/task';
import { CurrentProjectService } from '../../board/state-services/current-project.service';
import { TasksGroupedBySprintsDTO } from '../dtos';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class GetSprintsController {
  constructor(
    private requestStateController: RequestStateController,
    private api: GetTasksAPI,
    private sprintsService: CurrentSprintsService,
    private currentProjectService: CurrentProjectService
  ) {}

  getSprintsTasksForProject(
    projectId: string,
    requestState?: RequestState
  ): Observable<void> {
    return this.api
      .getTasksGroupedBySprints(projectId)
      .pipe(this._mapDataAndUpdateSprintListState(requestState));
  }

  refreshSprintTasks() {
    return this.api
      .getTasksGroupedBySprints(this._currentProjectId)
      .pipe(this._mapDataAndUpdateSprintListState());
  }

  private _mapDataAndUpdateSprintListState(requestState?: RequestState) {
    return (source: Observable<TasksGroupedBySprintsDTO>) =>
      source.pipe(
        map((tasksGroupedBySprint) => {
          const sprintsTasks = tasksGroupedBySprint.map(
            ({ Sprint, Tasks }) => ({
              Sprint,
              Tasks: Tasks.map((t) => new Task(t)),
            })
          );

          console.log(sprintsTasks);

          return sprintsTasks;
        }),
        tap((sprintsTasks) =>
          this.sprintsService.updateSprintList(sprintsTasks)
        ),
        this.requestStateController.handleRequest(requestState),
        map(() => null)
      );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
