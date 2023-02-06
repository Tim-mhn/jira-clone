import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { BoardProvidersModule } from '../board-providers.module';
import { GetTasksAPI } from '../../../core/apis/get-tasks.api';
import { TasksGroupedBySprintsDTO } from '../../../core/dtos';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { CurrentSprintsService } from '../state-services/current-sprints.service';
import { BoardFilters, SprintWithTasks } from '../../../core/models';
import { filterTasks } from '../../../core/utils/filter-tasks.util';
import { SprintMapper } from '../../../core/mappers/sprint.mapper';
import { TaskMapper } from '../../../core/mappers/task.mapper';

@Injectable({
  providedIn: BoardProvidersModule,
})
export class GetTasksOfBoardController {
  constructor(
    private requestStateController: RequestStateController,
    private api: GetTasksAPI,
    private sprintsService: CurrentSprintsService,
    private currentProjectService: CurrentProjectService,
    private tasksMapper: TaskMapper,
    private sprintMapper: SprintMapper
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
        sprintWithTasksList.map(({ Sprint: sprint, Tasks }) => {
          const filteredTasks = filterTasks(Tasks, filters);
          return {
            Sprint: sprint,
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
        map((tasksGroupedBySprint) => this._mapDTO(tasksGroupedBySprint)),
        tap((sprintsTasks) =>
          this.sprintsService.updateSprintList(sprintsTasks)
        ),
        tap(console.log),
        this.requestStateController.handleRequest(requestState),
        map(() => null)
      );
  }

  private _mapDTO(
    tasksGroupedBySprintsDTO: TasksGroupedBySprintsDTO
  ): SprintWithTasks[] {
    return (
      tasksGroupedBySprintsDTO?.map(({ Sprint: sprintDTO, Tasks: tasks }) => {
        const Sprint = this.sprintMapper.toDomain(sprintDTO);
        const Tasks = this.tasksMapper.mapTaskList(tasks);
        return {
          Sprint,
          Tasks,
        };
      }) || []
    );
  }

  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
