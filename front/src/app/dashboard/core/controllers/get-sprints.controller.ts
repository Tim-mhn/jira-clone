import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map, tap } from 'rxjs';
import { CurrentSprintsService } from '../../features/board/state-services/current-sprints.service';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectId, SprintInfo } from '../models';
import { SprintsAPI } from '../apis/sprints.api';
import { SprintInfoDTO } from '../dtos/sprints.dtos';
import { SprintMapper } from '../mappers/sprint.mapper';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class GetSprintsController {
  constructor(
    private requestStateController: RequestStateController,
    private sprintsService: CurrentSprintsService,
    private sprintsAPI: SprintsAPI,
    private mapper: SprintMapper
  ) {}

  getActiveSprintsOfProjectAndUpdateState(
    projectId: ProjectId,
    requestState?: RequestState
  ) {
    return this.sprintsAPI.getActiveSprints(projectId).pipe(
      map((sprintsInfoDTO) => this._mapDTO(sprintsInfoDTO)),
      tap((sprints) => this.sprintsService.updateSprintInfoList(sprints)),
      this.requestStateController.handleRequest(requestState)
    );
  }

  private _mapDTO(sprintInfoDTOList: SprintInfoDTO[]): SprintInfo[] {
    return sprintInfoDTOList.map((dto) => this.mapper.dtoToSprintInfo(dto));
  }
}
