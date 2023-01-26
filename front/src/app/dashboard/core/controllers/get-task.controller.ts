import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, switchMap } from 'rxjs';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { TaskMapper } from '../mappers/task.mapper';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class GetTaskController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private api: GetTasksAPI,
    private mapper: TaskMapper
  ) {}

  getTask(taskId: string, requestState?: RequestState) {
    return this._currentProjectId$.pipe(
      switchMap((projectId) =>
        this.api.getSingleTask({
          taskId,
          projectId,
        })
      ),
      map((taskDTO) => this.mapper.toDomain(taskDTO)),
      this.requestStateController.handleRequest(requestState)
    );
  }

  private get _currentProjectId$() {
    return this.currentProjectService.currentProject$.pipe(
      map((project) => project.Id)
    );
  }
}
