import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { tap } from 'rxjs';
import { CurrentSprintsService } from '../../features/board/state-services/current-sprints.service';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectId } from '../models';
import { SprintsAPI } from '../apis/sprints.api';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class GetSprintsController {
  constructor(
    private requestStateController: RequestStateController,
    private sprintsService: CurrentSprintsService,
    private sprintsAPI: SprintsAPI
  ) {}

  getActiveSprintsOfProjectAndUpdateState(
    projectId: ProjectId,
    requestState?: RequestState
  ) {
    return this.sprintsAPI.getActiveSprints(projectId).pipe(
      tap((sprints) => this.sprintsService.updateSprintInfoList(sprints)),
      this.requestStateController.handleRequest(requestState)
    );
  }
}
