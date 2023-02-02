import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { BoardProvidersModule } from '../board-providers.module';
import { GetTasksAPI } from '../../../core/apis/get-tasks.api';
import { TasksGroupedBySprintsDTO } from '../../../core/dtos';
import { TaskMapper } from '../../../core/mappers/task.mapper';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { CurrentSprintsService } from '../state-services/current-sprints.service';
import { BoardFilters } from '../../../core/models';
import { filterTasks } from '../../../core/utils/filter-tasks.util';

@Injectable({
  providedIn: BoardProvidersModule,
})
export class GetTasksOfBoardController {
  constructor(
    private requestStateController: RequestStateController,
    private api: GetTasksAPI,
    private sprintsService: CurrentSprintsService,
    private currentProjectService: CurrentProjectService,
    private mapper: TaskMapper
  ) {}

  getSprintsTasksForProject(
    projectId: string,
    requestState?: RequestState
  ): Observable<void> {
    return this.api
      .getTasksGroupedBySprints(projectId)
      .pipe(this._mapDataAndUpdateSprintListState(requestState));
  }

  filterSprintTasksAndUpdateState(filters: BoardFilters) {
    return this.sprintsService.tasksGroupedBySprints$.pipe(
      map((sprintWithTasksList) =>
        sprintWithTasksList.map(({ Sprint, Tasks }) => {
          const filteredTasks = filterTasks(Tasks, filters);
          return {
            Sprint,
            Tasks: filteredTasks,
          };
        })
      ),
      tap((sprintsWithFilteredTasks) =>
        this.sprintsService.updateSprintList(sprintsWithFilteredTasks)
      )
    );
  }

  refreshSprintsTasks() {
    return this.api
      .getTasksGroupedBySprints(this._currentProjectId)
      .pipe(this._mapDataAndUpdateSprintListState());
  }

  private _mapDataAndUpdateSprintListState(requestState?: RequestState) {
    return (source: Observable<TasksGroupedBySprintsDTO>) =>
      source.pipe(
        map((tasksGroupedBySprint) => {
          const sprintsTasks = tasksGroupedBySprint?.map(
            ({ Sprint, Tasks }) => ({
              Sprint,
              Tasks: this.mapper.mapTaskList(Tasks),
            })
          );

          return sprintsTasks || [];
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
