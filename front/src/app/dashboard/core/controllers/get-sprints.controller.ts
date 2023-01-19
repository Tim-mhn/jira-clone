import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { Task } from '../models/task';
import { TasksGroupedBySprintsDTO } from '../dtos';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { BoardFilters } from '../models/board-filters';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { CurrentProjectService } from '../state-services/current-project.service';
import { CurrentSprintsService } from '../../features/board/state-services/current-sprints.service';

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
    filters: BoardFilters,
    requestState?: RequestState
  ): Observable<void> {
    return this.api
      .getTasksGroupedBySprints(projectId, filters)
      .pipe(this._mapDataAndUpdateSprintListState(requestState));
  }

  @logMethod
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
