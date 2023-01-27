import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, Observable, tap } from 'rxjs';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { TasksGroupedBySprintsDTO } from '../dtos';
import { CurrentProjectService } from '../state-services/current-project.service';
import { CurrentSprintsService } from '../../features/board/state-services/current-sprints.service';
import { TaskMapper } from '../mappers/task.mapper';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectId } from '../models';
import { SprintsAPI } from '../apis/sprints.api';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class GetSprintsController {
  constructor(
    private requestStateController: RequestStateController,
    private api: GetTasksAPI,
    private sprintsService: CurrentSprintsService,
    private currentProjectService: CurrentProjectService,
    private mapper: TaskMapper,
    private sprintsAPI: SprintsAPI
  ) {}

  // getSprintsTasksForProject(
  //   projectId: string,
  //   filters: BoardFilters,
  //   requestState?: RequestState
  // ): Observable<void> {
  //   return this.api
  //     .getTasksGroupedBySprints(projectId, filters)
  //     .pipe(this._mapDataAndUpdateSprintListState(requestState));
  // }

  // refreshSprintsTasks() {
  //   return this.api
  //     .getTasksGroupedBySprints(this._currentProjectId)
  //     .pipe(this._mapDataAndUpdateSprintListState());
  // }

  getActiveSprintsOfProjectAndUpdateState(
    projectId: ProjectId,
    requestState?: RequestState
  ) {
    return this.sprintsAPI.getActiveSprints(projectId).pipe(
      tap((sprints) => this.sprintsService.updateSprintInfoList(sprints)),
      this.requestStateController.handleRequest(requestState)
    );
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
